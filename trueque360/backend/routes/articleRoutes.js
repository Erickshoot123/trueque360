const express = require('express');
const { body } = require('express-validator');
const articleController = require('../controllers/articleController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Sincronizado con el enum exacto (mayúsculas/minúsculas) del Modelo Article.js
const validCategories = ['Electrónica', 'Libros', 'Servicios', 'Hogar', 'Otros']; 

// --- Validaciones para crear/actualizar ---
const articleValidationRules = [
  body('title').notEmpty().withMessage('El título es requerido'),
  body('description').notEmpty().withMessage('La descripción es requerida'),
  
  // --- REGLA CORREGIDA ---
  body('category')
    .notEmpty().withMessage('La categoría es requerida')
    .trim() // Quita espacios al inicio/final
    // Se elimina .toLowerCase() para validar el caso exacto
    .isIn(validCategories).withMessage('Categoría inválida. Debe coincidir exactamente (ej: "Electrónica", "Libros").'), 

  body('images').isArray({ min: 1 }).withMessage('Se requiere al menos una imagen')
];

// --- RUTAS DEL CRUD PARA /api/articles ---

// [C]REATE: POST /api/articles
// Protegida: Solo usuarios con token pueden crear
router.post(
  '/', 
  verifyToken, // Middleware: Verifica el token y añade 'req.user'
  articleValidationRules, 
  articleController.createArticle
);

// [R]EAD: GET /api/articles (Leer todos)
// Pública: Cualquiera puede ver los artículos
router.get('/', articleController.getAllArticles);

// [R]EAD: GET /api/articles/:id (Leer uno)
// Pública: Cualquiera puede ver un artículo
router.get('/:id', articleController.getArticleById);

// [U]PDATE: PUT /api/articles/:id
// Protegida: Solo el dueño (verificado en el controlador) puede actualizar
router.put(
  '/:id', 
  verifyToken, 
  // Nota: Deberíamos aplicar las validaciones también al actualizar
  // (Opcional, pero recomendado)
  // articleValidationRules, 
  articleController.updateArticle
);

// [D]ELETE: DELETE /api/articles/:id
// Protegida: Solo el dueño (verificado en el controlador) puede eliminar
router.delete(
  '/:id', 
  verifyToken, 
  articleController.deleteArticle
);

module.exports = router;