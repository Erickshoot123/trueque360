// backend/models/Article.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    // Referencia al usuario que es dueño del artículo
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true,
    },
    
    title: {
        type: String,
        required: true, 
        trim: true,
        maxlength: 100 // Límite de caracteres
    },

    description: {
        type: String,
        required: true,
        maxlength: 1000 // Límite de caracteres
    },
    
    category: {
        type: String,
        required: true,
        enum: ['Electrónica', 'Libros', 'Servicios', 'Hogar', 'Otros'], // Categorías predefinidas
    },

    images: {
        type: [String], // Array de URLs de imágenes
        required: true, 
        validate: [v => v && v.length > 0, 'Se requiere al menos una imagen.']
    },

    status: {
        type: String,
        required: true,
        default: 'Disponible',
        // --- ¡CAMBIO AQUÍ! ---
        // Añadimos 'Eliminado' para el borrado lógico
        enum: ['Disponible', 'En trueque', 'Cerrado', 'Eliminado'],
    },

    preferredItems: {
        type: [String], // Array de strings que indican qué busca a cambio
        default: [],
    }

}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;