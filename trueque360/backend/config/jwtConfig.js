// backend/config/jwtConfig.js
// La clave secreta para JWT - se lee del .env
const JWT_SECRET = process.env.JWT_SECRET || 'CLAVETRUEQUE360SUPERSECRETA1234567890';

module.exports = {
    JWT_SECRET
};