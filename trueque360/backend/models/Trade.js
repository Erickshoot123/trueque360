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

    // Artículo que ofrece el proponente (opcional si hay descripción)
    proposerArticle: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: false,
    },

    // Descripción del artículo que ofrece el proponente (si no es publicado)
    proposedItemDescription: {
        type: String,
        required: false,
        maxlength: 500,
    },

    // Artículo que el receptor tiene y que el proponente desea (opcional si hay descripción)
    receiverArticle: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: false,
    },

    // Descripción del artículo que desea del receptor (si no es publicado)
    requestedItemDescription: {
        type: String,
        required: false,
        maxlength: 500,
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