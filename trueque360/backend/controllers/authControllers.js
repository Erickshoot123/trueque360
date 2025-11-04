// backend/controllers/authController.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importamos el modelo
const { JWT_SECRET } = require('../config/jwtConfig'); // Importamos la clave

// Lógica para el Registro de Usuario
exports.registerUser = async (req, res) => {
    try {
        // 1. Verificar errores de validación (de express-validator)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Error de validación',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { username, email, password } = req.body;

        // 2. Verificar si el usuario o email ya existen
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'El email o nombre de usuario ya está en uso' 
            });
        }

        // 3. Encriptar contraseña
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Crear y guardar el nuevo usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado con éxito' });

    } catch (error) {
        // Manejar error de índice duplicado (11000)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'El email o nombre de usuario ya está en uso'
            });
        }
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};


exports.getAdminDashboardData = async (req, res) => {
    // Esta función solo se ejecuta si el usuario pasó los middlewares verifyToken + isAdmin
    try {
        // En un proyecto real, necesitarías importar el modelo Article aquí
        // const totalArticles = await Article.countDocuments(); 
        
        // Ejemplo de datos de administración
        const totalUsers = await User.countDocuments();
        
        res.status(200).json({
            success: true,
            message: 'Acceso al Panel de Administración concedido',
            data: {
                totalUsers,
                // Agrega más estadísticas importantes para el administrador aquí
            }
        });

    } catch (error) {
        console.error('Error al obtener datos de admin:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};


// Lógica para el Login de Usuario
exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Error de validación',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { username, password } = req.body;

        // 1. Buscar al usuario
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }

        // 2. Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }

        // 3. Crear y enviar token JWT
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email, role: user.role }, 
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: { username: user.username, email: user.email, role: user.role}
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Lógica para obtener Perfil de Usuario
exports.getProfile = async (req, res) => {
    try {
        // req.user viene del middleware verifyToken
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};