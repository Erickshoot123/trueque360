// backend/routes/authRoutes.js

const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authControllers');
const { loginLimiter } = require('../middleware/rateLimiter');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // Importamos isAdmin

const router = express.Router();

// Validaciones reutilizables
const registerValidations = [
    body('email').isEmail().withMessage('El email no es válido').normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/).withMessage('La contraseña debe contener al menos una letra y un número'),
    body('username')
        .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres')
        .matches(/^[A-Za-z0-9_-]+$/).withMessage('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos')
];

const loginValidations = [
    body('username').trim().notEmpty().withMessage('El nombre de usuario es requerido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
];

// RUTA POST /api/register
router.post('/register', registerValidations, authController.registerUser);

// RUTA POST /api/login
router.post('/login', loginLimiter, loginValidations, authController.loginUser);

// RUTA GET /api/perfil (Protegida)
router.get('/perfil', verifyToken, authController.getProfile);

// Este endpoint solo funcionará si el token es válido Y el usuario tiene role: 'admin'
router.get('/admin/dashboard', verifyToken, isAdmin, authController.getAdminDashboardData);

module.exports = router;