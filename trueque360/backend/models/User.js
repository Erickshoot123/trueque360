const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  
  username: {
    type: String,
    required: true, 
    unique: true,  
    trim: true      
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true 
  },

  password: {
    type: String,
    required: true,
  },


  role: {
    type: String,
    enum: ['user', 'admin'], // Solo permite estos dos valores
    default: 'user', // El valor por defecto para nuevos registros
    required: true
  }


}, {
  timestamps: true 
});


const User = mongoose.model('User', userSchema);

module.exports = User;