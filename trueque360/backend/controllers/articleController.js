const Article = require('../models/Article');
const { validationResult } = require('express-validator');

// 1. CREAR Artículo (C de CRUD)
exports.createArticle = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors: errors.array().map(err => err.msg) });
        }

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
        // Filtramos para no mostrar artículos con status 'Eliminado'
        const articles = await Article.find({ status: { $ne: 'Eliminado' } })
            // --- ¡CORRECCIÓN IMPORTANTE! ---
            // Le pedimos que también incluya el _id del dueño
            .populate('owner', 'username _id'); 

        res.status(200).json({ success: true, articles });
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// 3. LEER UN Artículo por ID (R de CRUD)
exports.getArticleById = async (req, res) => {
    try {
        // --- ¡CORRECCIÓN IMPORTANTE! ---
        // También lo cambiamos aquí para que funcione en la página de detalles
        const article = await Article.findById(req.params.id)
            .populate('owner', 'username _id');

        if (!article || article.status === 'Eliminado') { // Ocultamos si está eliminado
            return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
        }

        res.status(200).json({ success: true, article });
    } catch (error) {
        console.error('Error al obtener artículo por ID:', error);
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
        
        const article = await Article.findById(articleId);
        if (!article || article.status === 'Eliminado') {
            return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
        }

        if (!article.owner.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para actualizar este artículo.' });
        }

        // Prohibir cambiar el status si se intenta por aquí
        if (updates.status) {
            delete updates.status;
        }

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

// 5. ELIMINAR Artículo (D de CRUD) - Borrado Lógico
exports.deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        
        const article = await Article.findById(articleId);
        if (!article || article.status === 'Eliminado') {
            return res.status(404).json({ success: false, message: 'Artículo no encontrado' }); 
        }

        if (!article.owner.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este artículo.' });
        }
        
        // --- ¡CAMBIO AQUÍ! ---
        // En lugar de deleteOne, actualizamos el status a 'Eliminado'
        article.status = 'Eliminado';
        await article.save();

        res.status(200).json({ success: true, message: 'Artículo eliminado con éxito' });
        
    } catch (error) {
        console.error('Error al eliminar artículo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'ID de artículo inválido' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
