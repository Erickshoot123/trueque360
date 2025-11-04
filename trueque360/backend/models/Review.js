// backend/models/Review.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    // El trueque al que está asociada esta reseña
    trade: {
        type: Schema.Types.ObjectId,
        ref: 'Trade',
        required: true,
        unique: true // Una reseña por trueque
    },
    
    // El usuario que escribe la reseña
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    // El usuario que está siendo calificado
    reviewedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Calificación de 1 a 5
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    // Comentario sobre la experiencia
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    }

}, {
    timestamps: true // created/updated at
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;