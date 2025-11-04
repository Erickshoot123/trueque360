// backend/models/Trade.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    // Usuario que INICIA la propuesta
    proposer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    // Usuario que RECIBE la propuesta y debe ACEPTAR/RECHAZAR
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Artículo que ofrece el proponente
    proposerArticle: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },

    // Artículo que el receptor tiene y que el proponente desea
    receiverArticle: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    
    // Estado del trueque
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
    },

    // Campo opcional para registrar si ambas partes han confirmado la finalización física
    proposerConfirmed: {
        type: Boolean,
        default: false,
    },

    receiverConfirmed: {
        type: Boolean,
        default: false,
    },

    // Fecha en que se acepta el trueque (para métricas)
    acceptedAt: {
        type: Date,
        default: null,
    }

}, {
    timestamps: true // created/updated at
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;