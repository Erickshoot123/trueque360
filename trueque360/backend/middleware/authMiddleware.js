// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig'); // Importamos la clave

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso denegado. Token no proporcionado.' 
    });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado.' 
    });
  }
};

const isAdmin = (req, res, next) => {
    // Verifica si el usuario autenticado tiene el rol 'admin'
    if (req.user && req.user.role === 'admin') {
        next(); // Es administrador, permite el acceso a la ruta
    } else {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado. Requiere privilegios de administrador.' 
        });
    }
};


module.exports = { verifyToken , isAdmin };