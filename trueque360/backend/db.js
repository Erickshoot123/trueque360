// backend/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

        console.log('Conexión a MongoDB Atlas exitosa ✔️');
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
