// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Leer configuración desde variables de entorno para mayor flexibilidad
const WINDOW_MINUTES = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15; // minutos
const MAX_ATTEMPTS = parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS, 10) || 10; // intentos por ventana
const SKIP_SUCCESS = process.env.RATE_LIMIT_SKIP_SUCCESSFUL === 'false' ? false : true; // default: true
const WINDOW_MS = WINDOW_MINUTES * 60 * 1000;

// Configuración de rate limiting para el login
// - `standardHeaders` añade `RateLimit-*` headers (RFC)
// - `legacyHeaders` desactiva las cabeceras obsoletas
// - `skipSuccessfulRequests` evita contar logins exitosos en el contador
const loginLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: MAX_ATTEMPTS,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: SKIP_SUCCESS,
    handler: (req, res /*, next */) => {
        // calcular tiempo restante en segundos
        const retryAfterSec = req.rateLimit && req.rateLimit.resetTime
            ? Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
            : Math.ceil(WINDOW_MS / 1000);

        // añadir cabecera Retry-After para que clientes (y hostings) puedan mostrarla
        res.set('Retry-After', String(retryAfterSec));
        return res.status(429).json({ 
            success: false, 
            message: 'Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo más tarde.',
            retryAfter: retryAfterSec
        });
    }
});

module.exports = { loginLimiter };