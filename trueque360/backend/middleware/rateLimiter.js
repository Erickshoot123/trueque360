// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Configuración de rate limiting para el login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // limita cada IP a 5 intentos de login por ventana
    message: { 
        success: false, 
        message: 'Demasiados intentos de inicio de sesión. Por favor, intente más tarde.' 
    }
}); 

module.exports = { loginLimiter };