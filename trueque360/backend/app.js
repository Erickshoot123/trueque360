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
// Allow only trusted origins. In development include localhost Vite origin(s).
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL]
    : [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', ];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // Not allowed by CORS
        return callback(new Error('CORS policy: Origin not allowed'), false);
    },
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
