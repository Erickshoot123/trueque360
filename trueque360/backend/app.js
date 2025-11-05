const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importación de Rutas
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

// --- Configuración Inicial ---
const app = express();

// Middlewares globales
app.use(cors()); 
app.use(express.json()); 
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Montaje de Rutas ---
// Montamos todas las rutas de autenticación bajo el prefijo /api
app.use('/api', authRoutes); 
// Montamos las rutas de artículos
app.use('/api/articles', articleRoutes);

// Exportamos la aplicación
module.exports = app;