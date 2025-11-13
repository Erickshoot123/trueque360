const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Article = require('../models/Article');

// Crear una conversación entre dos usuarios
exports.createConversation = async (req, res) => {
  try {
    const { participantId, articleId } = req.body;
    const currentUserId = req.user.id; // Del JWT

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'participantId es requerido'
      });
    }

    if (currentUserId === participantId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes crear una conversación contigo mismo'
      });
    }

    // Buscar si ya existe una conversación entre estos dos usuarios
    // Si se proporcionó articleId, la conversación debe ser única por artículo
    const existingQuery = {
      participants: { $all: [currentUserId, participantId] }
    };

    if (articleId) {
      existingQuery.article = articleId;
    }

  const existingConversation = await Conversation.findOne(existingQuery).populate('participants', 'username email').populate('article', 'title images');

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: 'La conversación ya existe',
        data: existingConversation
      });
    }

    // Crear nueva conversación (asociada a un artículo si se proporciona)
    const newConversation = new Conversation({
      participants: [currentUserId, participantId],
      article: articleId || undefined,
    });

  await newConversation.save();
  await newConversation.populate('participants', 'username email');
  await newConversation.populate('article', 'title images');

    res.status(201).json({
      success: true,
      message: 'Conversación creada correctamente',
      data: newConversation
    });
  } catch (error) {
    console.error('Error en createConversation:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener todas las conversaciones del usuario actual
exports.getUserConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Del JWT

    // Obtener conversaciones donde el usuario es participante
    const conversations = await Conversation.find({
      participants: currentUserId
    })
      .populate('participants', 'username email')
      .populate('article', 'title images')
      .sort({ updatedAt: -1 });

    // Para cada conversación, obtener el último mensaje
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 });

        return {
          ...conv.toObject(),
          lastMessage: lastMessage
        };
      })
    );

    res.status(200).json({
      success: true,
      data: conversationsWithLastMessage
    });
  } catch (error) {
    console.error('Error en getUserConversations:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener detalles de una conversación específica
exports.getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user.id;

    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'username email')
      .populate('article', 'title images');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada'
      });
    }

    // Verificar que el usuario es participante
    if (!conversation.participants.some(p => p._id.toString() === currentUserId)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a esta conversación'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error en getConversationById:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener el otro participante de una conversación
exports.getOtherParticipant = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user.id;

    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'username email');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada'
      });
    }

    // Encontrar el otro participante
    const otherParticipant = conversation.participants.find(
      p => p._id.toString() !== currentUserId
    );

    if (!otherParticipant) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el otro participante'
      });
    }

    res.status(200).json({
      success: true,
      data: otherParticipant
    });
  } catch (error) {
    console.error('Error en getOtherParticipant:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Eliminar una conversación específica y sus mensajes (solo participantes)
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversación no encontrada' });
    }

    // Solo un participante puede eliminar la conversación (ambos participantes tienen acceso)
    if (!conversation.participants.some(p => p.toString() === currentUserId)) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta conversación' });
    }

    // Eliminar mensajes asociados
    await Message.deleteMany({ conversationId: conversation._id });

    // Eliminar conversación
    await Conversation.findByIdAndDelete(conversation._id);

    return res.status(200).json({ success: true, message: 'Conversación y mensajes eliminados correctamente' });
  } catch (error) {
    console.error('Error en deleteConversation:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar todas las conversaciones asociadas a un artículo (solo el dueño del artículo)
exports.deleteConversationsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const currentUserId = req.user.id;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
    }

    // Solo el dueño del artículo puede eliminar todas las conversaciones relacionadas
    if (article.owner.toString() !== currentUserId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar las conversaciones de este artículo' });
    }

    // Encontrar conversaciones relacionadas
    const conversations = await Conversation.find({ article: articleId });

    const conversationIds = conversations.map(c => c._id);

    // Eliminar mensajes asociados a esas conversaciones
    await Message.deleteMany({ conversationId: { $in: conversationIds } });

    // Eliminar las conversaciones
    await Conversation.deleteMany({ _id: { $in: conversationIds } });

    return res.status(200).json({ success: true, message: 'Conversaciones y mensajes del artículo eliminados correctamente' });
  } catch (error) {
    console.error('Error en deleteConversationsByArticle:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
