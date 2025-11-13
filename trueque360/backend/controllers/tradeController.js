const Trade = require('../models/Trade');
const Article = require('../models/Article');
const User = require('../models/User');

// Crear una solicitud de trueque
exports.createTradeRequest = async (req, res) => {
  try {
    const { receiverId, proposerArticleId, receiverArticleId, proposedItemDescription, requestedItemDescription } = req.body;
    const currentUserId = req.user.id;

    // Validaciones
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'receiverId es requerido'
      });
    }

    // Validar que al menos se proponga un artículo o descripción
    if (!proposerArticleId && !proposedItemDescription) {
      return res.status(400).json({
        success: false,
        message: 'Debes proponer un artículo publicado o describir el artículo que ofreces'
      });
    }

    // Validar que al menos se solicite un artículo o descripción
    if (!receiverArticleId && !requestedItemDescription) {
      return res.status(400).json({
        success: false,
        message: 'Debes solicitar un artículo publicado o describir lo que deseas'
      });
    }

    if (currentUserId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes proponer un trueque contigo mismo'
      });
    }

    // Verificar artículos si se proporcionan IDs (no requeridos ahora)
    if (proposerArticleId) {
      const proposerArticle = await Article.findById(proposerArticleId);
      if (!proposerArticle) {
        return res.status(404).json({
          success: false,
          message: 'El artículo propuesto no existe'
        });
      }
      if (proposerArticle.owner.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para proponer este artículo'
        });
      }
    }

    if (receiverArticleId) {
      const receiverArticle = await Article.findById(receiverArticleId);
      if (!receiverArticle) {
        return res.status(404).json({
          success: false,
          message: 'El artículo solicitado no existe'
        });
      }
      if (receiverArticle.owner.toString() !== receiverId) {
        return res.status(403).json({
          success: false,
          message: 'El usuario receptor no es dueño del artículo solicitado'
        });
      }
    }

    // Crear la solicitud de trueque
    const trade = new Trade({
      proposer: currentUserId,
      receiver: receiverId,
      proposerArticle: proposerArticleId || null,
      proposedItemDescription: proposedItemDescription || null,
      receiverArticle: receiverArticleId || null,
      requestedItemDescription: requestedItemDescription || null,
      status: 'Pending'
    });

    await trade.save();
    await trade.populate('proposer', 'username email');
    await trade.populate('receiver', 'username email');
    await trade.populate('proposerArticle', 'title images');
    await trade.populate('receiverArticle', 'title images');

    res.status(201).json({
      success: true,
      message: 'Solicitud de trueque creada correctamente',
      data: trade
    });
  } catch (error) {
    console.error('Error en createTradeRequest:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener trueques del usuario actual (tanto los que propone como los que recibe)
exports.getUserTrades = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Obtener trueques donde el usuario es receptor (recibe solicitudes)
    const receivedTrades = await Trade.find({ receiver: currentUserId })
      .populate('proposer', 'username email')
      .populate('receiver', 'username email')
      .populate('proposerArticle', 'title images')
      .populate('receiverArticle', 'title images')
      .sort({ createdAt: -1 });

    // Obtener trueques donde el usuario es proponente
    const sentTrades = await Trade.find({ proposer: currentUserId })
      .populate('proposer', 'username email')
      .populate('receiver', 'username email')
      .populate('proposerArticle', 'title images')
      .populate('receiverArticle', 'title images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        received: receivedTrades,
        sent: sentTrades
      }
    });
  } catch (error) {
    console.error('Error en getUserTrades:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar estado del trueque (aceptar/rechazar/completar)
exports.updateTradeStatus = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const { status } = req.body;
    const currentUserId = req.user.id;

    // Validar status
    if (!['Accepted', 'Rejected', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido. Debe ser: Accepted, Rejected, Completed o Cancelled'
      });
    }

    const trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trueque no encontrado'
      });
    }

    // Verificar permisos: solo el receiver puede aceptar/rechazar, ambos pueden completar
    if (status === 'Accepted' || status === 'Rejected') {
      if (trade.receiver.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Solo el receptor puede aceptar o rechazar un trueque'
        });
      }
    } else if (status === 'Completed') {
      if (trade.proposer.toString() !== currentUserId && trade.receiver.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Solo los participantes del trueque pueden marcarlo como completado'
        });
      }
    }

    // Actualizar status
    trade.status = status;
    if (status === 'Accepted') {
      trade.acceptedAt = new Date();
    }

    await trade.save();
    await trade.populate('proposer', 'username email');
    await trade.populate('receiver', 'username email');
    await trade.populate('proposerArticle', 'title images');
    await trade.populate('receiverArticle', 'title images');

    res.status(200).json({
      success: true,
      message: `Trueque ${status.toLowerCase()} correctamente`,
      data: trade
    });
  } catch (error) {
    console.error('Error en updateTradeStatus:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener un trueque específico
exports.getTradeById = async (req, res) => {
  try {
    const { tradeId } = req.params;

    const trade = await Trade.findById(tradeId)
      .populate('proposer', 'username email')
      .populate('receiver', 'username email')
      .populate('proposerArticle', 'title images')
      .populate('receiverArticle', 'title images');

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trueque no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: trade
    });
  } catch (error) {
    console.error('Error en getTradeById:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
