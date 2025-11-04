// backend/routes/articleRoutes.js
const express = require('express');
const { body } = require('express-validator');
const articleController = require('../controllers/articleController');
const { verifyToken } = require('../middleware/authMiddleware'); // Necesario para rutas protegidas

const router = express.Router();

// Validaciones para la creación y actualización
const articleValidations = [
    body('title')
        .trim().isLength({ min: 5, max: 100 }).withMessage('El título debe tener entre 5 y 100 caracteres.'),
    body('description')
        .trim().isLength({ min: 20, max: 1000 }).withMessage('La descripción debe tener entre 20 y 1000 caracteres.'),
    body('category')
        .isIn(['Electrónica', 'Libros', 'Servicios', 'Hogar', 'Otros']).withMessage('Categoría inválida.'),
    body('images')
        .isArray({ min: 1 }).withMessage('Se requiere al menos una imagen (URL).'),
    body('images.*').isURL().withMessage('Cada elemento en imágenes debe ser una URL válida.'),
];


// --- RUTAS PÚBLICAS (Lectura) ---

// GET /api/articles - Leer todos los artículos
router.get('/', articleController.getAllArticles);

// GET /api/articles/:id - Leer un artículo por ID
router.get('/:id', articleController.getArticleById);


// --- RUTAS PROTEGIDAS (CRUD completo) ---

// Todas las rutas siguientes requieren que el usuario esté autenticado (verifyToken)

// POST /api/articles - Crear un nuevo artículo
router.post('/', verifyToken, articleValidations, articleController.createArticle);

// PUT /api/articles/:id - Actualizar un artículo (Requiere ser dueño)
router.put('/:id', verifyToken, articleValidations, articleController.updateArticle);

// DELETE /api/articles/:id - Eliminar un artículo (Requiere ser dueño)
router.delete('/:id', verifyToken, articleController.deleteArticle);


module.exports = router;