// backend/server.js
require('dotenv').config(); // Carga las variables del .env
const app = require('./app'); // Importa la aplicación configurada
const connectDB = require('./db'); // Importa la función de conexión

const PORT = process.env.PORT || 3000;

// Iniciar Conexión a DB
connectDB();

// Iniciar Servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  });
}

// Nota: El archivo User.js no necesita cambios
