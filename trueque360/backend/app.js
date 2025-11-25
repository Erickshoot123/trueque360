const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importación de Rutas
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();

// Middlewares - CORS Configuration
// In development, allow all origins. In production, restrict to CLIENT_URL
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL 
        : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Prefijo general de la API
app.use('/api', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/trades', tradeRoutes);

// Exportamos app para server.js
module.exports = app;
