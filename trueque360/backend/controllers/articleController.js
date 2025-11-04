// backend/controllers/articleController.js
const Article = require('../models/Article');
const { validationResult } = require('express-validator');

// 1. CREAR Artículo (C de CRUD)
exports.createArticle = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors: errors.array().map(err => err.msg) });
        }

        // El ID del dueño viene del token JWT verificado en el middleware (req.user.id)
        const owner = req.user.id; 
        const { title, description, category, images, preferredItems } = req.body;

        const newArticle = new Article({
            owner,
            title,
            description,
            category,
            images,
            preferredItems: preferredItems || [],
            status: 'Disponible'
        });

        await newArticle.save();
        res.status(201).json({ 
            success: true, 
            message: 'Artículo publicado con éxito', 
            article: newArticle 
        });

    } catch (error) {
        console.error('Error al crear artículo:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// 2. LEER TODOS los Artículos (R de CRUD)
exports.getAllArticles = async (req, res) => {
    try {
        // Obtenemos todos los artículos y populamos el campo 'owner' para mostrar el nombre
        const articles = await Article.find({})
            .populate('owner', 'username email'); // Solo trae el username y email del dueño

        res.status(200).json({ success: true, articles });
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// 3. LEER UN Artículo por ID (R de CRUD)
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('owner', 'username email');

        if (!article) {
            return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
        }

        res.status(200).json({ success: true, article });
    } catch (error) {
        console.error('Error al obtener artículo por ID:', error);
        // Si el ID no tiene el formato correcto de MongoDB, mongoose lanza un error de CastError
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'ID de artículo inválido' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// 4. ACTUALIZAR Artículo (U de CRUD)
exports.updateArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const updates = req.body;
        
        // 1. Encontrar el artículo
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
        }

        // 2. Verificar si el usuario es el dueño (Seguridad)
        // req.user.id es un ObjectId, article.owner es un ObjectId. Usamos equals() para comparar.
        if (!article.owner.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para actualizar este artículo.' });
        }

        // 3. Aplicar y guardar los cambios
        Object.assign(article, updates);
        await article.save();

        res.status(200).json({ 
            success: true, 
            message: 'Artículo actualizado con éxito', 
            article 
        });

    } catch (error) {
        console.error('Error al actualizar artículo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'ID de artículo inválido' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// 5. ELIMINAR Artículo (D de CRUD)
exports.deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        
        // 1. Encontrar el artículo
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
        }

        // 2. Verificar si el usuario es el dueño (Seguridad)
        if (!article.owner.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este artículo.' });
        }
        
        // 3. Eliminar
        await Article.deleteOne({ _id: articleId });

        res.status(200).json({ success: true, message: 'Artículo eliminado con éxito' });
        
    } catch (error) {
        console.error('Error al eliminar artículo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'ID de artículo inválido' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};