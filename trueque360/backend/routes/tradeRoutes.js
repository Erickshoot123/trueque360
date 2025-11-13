const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const tradeController = require('../controllers/tradeController');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// POST /api/trades - Crear solicitud de trueque
router.post('/', tradeController.createTradeRequest);

// GET /api/trades - Obtener todos los trueques del usuario (recibidos y enviados)
router.get('/', tradeController.getUserTrades);

// GET /api/trades/:tradeId - Obtener un trueque específico
router.get('/:tradeId', tradeController.getTradeById);

// PATCH /api/trades/:tradeId - Actualizar estado del trueque
router.patch('/:tradeId', tradeController.updateTradeStatus);

module.exports = router;
