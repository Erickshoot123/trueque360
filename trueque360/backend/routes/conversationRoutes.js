const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

// Todas las rutas de conversaciones requieren autenticación
router.use(verifyToken);

// POST /api/conversations - Crear una conversación
router.post('/', conversationController.createConversation);

// GET /api/conversations - Obtener todas las conversaciones del usuario
router.get('/', conversationController.getUserConversations);

// GET /api/conversations/:conversationId - Obtener una conversación específica
router.get('/:conversationId', conversationController.getConversationById);

// GET /api/conversations/:conversationId/other-participant - Obtener el otro participante
router.get('/:conversationId/other-participant', conversationController.getOtherParticipant);

// DELETE /api/conversations/:conversationId - Eliminar conversación (participante)
router.delete('/:conversationId', conversationController.deleteConversation);

// DELETE /api/conversations/article/:articleId - Eliminar todas las conversaciones de un artículo (dueño)
router.delete('/article/:articleId', conversationController.deleteConversationsByArticle);

module.exports = router;
