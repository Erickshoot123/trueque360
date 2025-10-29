// --- 1. Importaciones ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Librería para encriptar contraseñas
require('dotenv').config(); // Carga las variables del .env

// Importamos nuestro modelo de Usuario
const User = require('./models/User'); 

// --- 2. Configuración Inicial ---
const app = express();
app.use(cors()); // Permite que React (frontend) hable con este backend
app.use(express.json()); // Permite al servidor entender el JSON que envía React
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
  console.log('--- NUEVA PETICIÓN ---');
  console.log('Ruta:', req.path);
  console.log('Método:', req.method);
  console.log('Cabecera Content-Type:', req.headers['content-type']);
  console.log('req.body ANTES de la ruta:', req.body);
  
  // Imprime el body "crudo" si está disponible (para ver si llega algo)
  req.on('data', chunk => {
    console.log('Datos crudos (data chunk):', chunk.toString());
  });

  next(); // Pasa la petición a la siguiente ruta (ej: /api/register)
});




// --- 3. Conexión a MongoDB ---
// process.env.DATABASE_URL lee la variable del archivo .env
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// --- 4. RUTAS (ENDPOINTS DE LA API) ---

// RUTA DE REGISTRO
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario o email ya existen
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El email o nombre de usuario ya está en uso' });
    }

    // ¡ENCRIPTAR LA CONTRASEÑA!
    const salt = await bcrypt.genSalt(10); // Genera "sal"
    const hashedPassword = await bcrypt.hash(password, salt); // Encripta

    // Crear el nuevo usuario con la contraseña encriptada
    const newUser = new User({
      username,
      email,
      password: hashedPassword // Guardamos la versión encriptada
    });

    // Guardar en la base de datos
    await newUser.save();

    // Enviar respuesta exitosa
    res.status(201).json({ message: 'Usuario registrado con éxito' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// RUTA DE LOGIN
app.post('/api/login', async (req, res) => {
  try {
    // Usamos 'username' para el login, como en tu formulario de React
    const { username, password } = req.body; 

    // 1. Buscar al usuario por su nombre de usuario
    const user = await User.findOne({ username: username });
    if (!user) {
      // No decimos "usuario no encontrado" por seguridad
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // 2. Comparar la contraseña que nos envían con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // La contraseña no coincide
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // 3. ¡ÉXITO! Las credenciales son correctas
    // (Aquí es donde normalmente se crea un Token JWT, pero por ahora solo enviamos éxito)
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      // En un futuro: token: 'jwt-token-aqui'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
});


// --- 5. Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});