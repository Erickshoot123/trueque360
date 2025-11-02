// --- 1. Importaciones ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- ¡NUEVAS IMPORTACIONES! ---
const http = require('http'); // Servidor base de Node
const { Server } = require("socket.io"); // Servidor de Socket.IO

// Importamos TODOS los modelos
const User = require('./models/User'); 
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

// --- 2. Configuración Inicial ---
const app = express();
app.use(cors()); // Permitimos CORS para peticiones HTTP
app.use(express.json());
const PORT = process.env.PORT || 3000;

// --- ¡NUEVA CONFIGURACIÓN DE SERVIDOR PARA SOCKET.IO! ---
// Creamos un servidor HTTP a partir de nuestra app de Express
const server = http.createServer(app); 

// Creamos un servidor de Socket.IO (io) a partir del servidor HTTP
// Configuramos CORS para Socket.IO también
const io = new Server(server, {
  cors: {
    origin: "*", // Permite cualquier origen (ajusta esto en producción)
    methods: ["GET", "POST"]
  }
});
// -----------------------------------------------------

// --- 3. Conexión a MongoDB ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));


// --- ¡NUEVO! Middleware de Autenticación JWT ---
// Esta función protegerá nuestras rutas
const authMiddleware = (req, res, next) => {
  // Obtenemos el token del encabezado 'Authorization'
  // Formato: "Bearer TOKEN_LARGO_AQUI"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Nos quedamos solo con el token

  if (token == null) {
    // Si no hay token, no está autorizado
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verificamos el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Si el token es inválido o expiró
      return res.status(403).json({ message: 'Token is not valid' });
    }
    // Si el token es válido, guardamos los datos del usuario en 'req.user'
    // 'user' es el payload que pusimos al firmar: { userId: ..., username: ... }
    req.user = user;
    next(); // Continuamos a la ruta protegida
  });
};
// --- 4. RUTAS HTTP (API) ---

// Asegúrate de tener esto en la parte superior de tu server.js (fuera de esta ruta):
// require('dotenv').config();

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body; 
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // ✅ Verificar que JWT_SECRET esté definido
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret.trim() === '') {
      console.error('ERROR: La variable JWT_SECRET no está definida en el archivo .env');
      return res.status(500).json({
        success: false,
        message: 'Configuración del servidor incorrecta (falta JWT_SECRET)',
      });
    }

    const tokenPayload = { userId: user._id, username: user.username };
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: token,
      userId: user._id
    });

  } catch (error) {
    console.error('¡ERROR GRAVE EN /api/login!:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});



app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body; 
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    const tokenPayload = { userId: user._id, username: user.username };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: token,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
});

// --- ¡NUEVAS RUTAS HTTP PARA EL CHAT! ---

// Ruta para obtener todos los usuarios (para la lista de contactos)
// La protegemos con nuestro middleware
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    // Buscamos todos los usuarios excepto el usuario que está haciendo la petición
    const users = await User.find({ _id: { $ne: req.user.userId } }).select('-password'); // .select('-password') evita enviar el hash de la contraseña
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuarios', error: error.message });
  }
});

// Ruta para obtener el historial de mensajes con OTRO usuario
// La protegemos con nuestro middleware
app.get('/api/messages/:otherUserId', authMiddleware, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.userId;

    // 1. Buscar si ya existe una conversación entre estos dos usuarios
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });

    if (!conversation) {
      // Si no hay conversación, no hay mensajes
      return res.json([]);
    }

    // 2. Si existe la conversación, buscar todos los mensajes
    const messages = await Message.find({
      conversationId: conversation._id
    });
    // (En una app real, aquí haríamos paginación, pero por ahora está bien)
    
    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: 'Error al buscar mensajes', error: error.message });
  }
});


// --- 5. ¡NUEVO! LÓGICA DE SOCKET.IO (CHAT EN TIEMPO REAL) ---

// Middleware de Socket.IO para autenticar conexiones
// ¡Cada conexión de socket DEBE tener un token!
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // El frontend debe enviar el token aquí

  if (!token) {
    return next(new Error('Authentication error: No token'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    // Si el token es válido, guardamos el payload del usuario en el socket
    socket.user = decodedPayload; // { userId: ..., username: ... }
    next();
  });
});


// 'io.on('connection', ...)' se ejecuta CADA VEZ que un usuario se conecta
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.user.username} (ID: ${socket.id})`);

  // Unimos al usuario a una "sala" privada que tiene su propio ID de usuario
  // Esto nos permite enviarle mensajes directos
  socket.join(socket.user.userId);

  // Escuchamos el evento 'sendMessage' (cuando el frontend nos envía un mensaje)
  socket.on('sendMessage', async (data) => {
    // 'data' debería ser algo como: { receiverId: "...", content: "Hola!" }
    try {
      const { receiverId, content } = data;
      const senderId = socket.user.userId;

      // 1. Buscar (o crear) la conversación
      let conversation = await Conversation.findOneAndUpdate(
        {
          // Buscar una conversación que tenga a AMBOS usuarios
          participants: { $all: [senderId, receiverId] }
        },
        {
          // Si no existe, crearla con estos participantes
          $setOnInsert: { participants: [senderId, receiverId] }
        },
        {
          new: true, // Devuelve el documento nuevo si se crea
          upsert: true // 'upsert' = update + insert
        }
      );

      // 2. Crear el nuevo mensaje
      const newMessage = new Message({
        conversationId: conversation._id,
        sender: senderId,
        receiver: receiverId,
        content: content
      });

      // 3. Guardar el mensaje en la BD
      await newMessage.save();

      // 4. ¡Enviar el mensaje en tiempo real!
      
      // Enviamos el mensaje a la "sala" del destinatario
      io.to(receiverId).emit('receiveMessage', newMessage);
      
      // También enviamos el mensaje de vuelta al emisor (para que su UI se actualice)
      io.to(senderId).emit('receiveMessage', newMessage);
      
      console.log(`Mensaje enviado de ${senderId} a ${receiverId}`);

    } catch (error) {
      console.error('Error en evento sendMessage:', error);
      // Opcional: emitir un evento de error de vuelta al cliente
      socket.emit('messageError', { message: 'No se pudo enviar el mensaje' });
    }
  });

  // Escuchamos el evento 'disconnect'
  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.user.username} (ID: ${socket.id})`);
  });
});


// --- 6. Iniciar Servidor (¡IMPORTANTE!) ---
// Usamos 'server.listen' en lugar de 'app.listen'
server.listen(PORT, () => {
  console.log(`Servidor (Express y Socket.IO) corriendo en http://localhost:${PORT}`);
});