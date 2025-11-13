const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importación de Rutas
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

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
// Montamos las rutas de conversaciones
app.use('/api/conversations', conversationRoutes);
// Montamos las rutas de mensajes
app.use('/api/messages', messageRoutes);
// Montamos las rutas de trueques
app.use('/api/trades', tradeRoutes);

// Exportamos la aplicación
module.exports = app;