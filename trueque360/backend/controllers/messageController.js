const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Crear un mensaje dentro de una conversación
exports.createMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, content } = req.body;
    const senderId = req.user.id; // Del JWT

    if (!content || !conversationId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: 'conversationId, receiverId y content son requeridos'
      });
    }

    // Verificar que la conversación existe
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada'
      });
    }

    // Crear el mensaje
    const newMessage = new Message({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      content
    });

    await newMessage.save();

    // Poblar referencias para responder con datos completos
    await newMessage.populate('sender', 'username email');
    await newMessage.populate('receiver', 'username email');

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado correctamente',
      data: newMessage
    });
  } catch (error) {
    console.error('Error en createMessage:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener todos los mensajes de una conversación
exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Verificar que la conversación existe
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada'
      });
    }

    // Obtener los mensajes y poblar información del usuario
    const messages = await Message.find({ conversationId })
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error en getMessagesByConversation:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener el último mensaje de una conversación (para preview)
exports.getLastMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const lastMessage = await Message.findOne({ conversationId })
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: lastMessage
    });
  } catch (error) {
    console.error('Error en getLastMessage:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
