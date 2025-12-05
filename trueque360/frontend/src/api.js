// frontend/src/api.js
// Centraliza la URL base de la API para permitir cambiarla según el entorno.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
