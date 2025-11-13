const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Todas las rutas de mensajes requieren autenticación
router.use(verifyToken);

// POST /api/messages - Crear un mensaje
router.post('/', messageController.createMessage);

// GET /api/messages/conversation/:conversationId - Obtener mensajes de una conversación
router.get('/conversation/:conversationId', messageController.getMessagesByConversation);

// GET /api/messages/last/:conversationId - Obtener el último mensaje de una conversación
router.get('/last/:conversationId', messageController.getLastMessage);

module.exports = router;
