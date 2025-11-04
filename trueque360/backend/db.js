// backend/db.js
const mongoose = require('mongoose');

const connectDB = () => {
    // process.env.DATABASE_URL lee la variable del archivo .env
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
        .catch((err) => {
            console.error('Error al conectar a MongoDB:', err);
            // Salir de la aplicación si hay error de conexión
            process.exit(1);
        });
};

module.exports = connectDB;