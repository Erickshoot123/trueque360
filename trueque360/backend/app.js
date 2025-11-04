// backend/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes'); // Importamos las rutas

const articleRoutes = require('./routes/articleRoutes'); // Importamos las rutas de artículos (si existen)

// --- Configuración Inicial ---
const app = express();

// Middlewares globales
app.use(cors()); // Permite que React (frontend) hable con este backend
app.use(express.json()); // Permite al servidor entender el JSON que envía React
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // Logger

// --- Rutas ---
// Montamos todas las rutas de autenticación bajo el prefijo /api
app.use('/api', authRoutes);
app.use('/api/articles', articleRoutes); // Rutas de artículos


// Exportamos la aplicación (útil para testing o el archivo server.js)
module.exports = app;