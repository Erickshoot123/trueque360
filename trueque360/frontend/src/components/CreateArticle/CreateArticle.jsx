import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CreateArticle.css'; // Importamos el CSS para el formulario

function CreateArticle() {
  // Estados para cada campo del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Otros'); // Valor por defecto
  const [images, setImages] = useState('');
  const [preferredItems, setPreferredItems] = useState('');
  
  // Estado para mensajes de error o éxito
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Las categorías DEBEN coincidir con tu 'enum' del backend
  const categories = ['Electrónica', 'Libros', 'Servicios', 'Hogar', 'Otros'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // --- 1. OBTENER EL TOKEN GUARDADO ---
    // Usamos sessionStorage (como acordamos)
    const token = sessionStorage.getItem('token');
    if (!token) {
      setMessage('Error: No estás autenticado. Por favor, inicia sesión.');
      setIsLoading(false);
      return;
    }

    try {
      // --- 2. PREPARAR EL BODY ---
      // Convertimos las cadenas separadas por comas en arrays
      const articleData = {
        title,
        description,
        category,
        images: images.split(',').map(img => img.trim()).filter(img => img.length > 0),
        preferredItems: preferredItems.split(',').map(item => item.trim()).filter(item => item.length > 0)
      };
      
      // Validar que haya al menos una imagen
      if (articleData.images.length === 0) {
          throw new Error("Debes proporcionar al menos una URL de imagen.");
      }

      // --- 3. LLAMAR A LA API (POST CON TOKEN) ---
      const response = await fetch('http://localhost:3000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // --- ¡ESTA ES LA PARTE MÁS IMPORTANTE! ---
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(articleData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Si la API devuelve un array de errores (de express-validator)
        if (data.errors) {
            throw new Error(data.errors.join(', '));
        }
        throw new Error(data.message || 'Error al crear el artículo');
      }

      // 4. ÉXITO
      setMessage('¡Artículo creado con éxito! Redirigiendo...');
      
      // Redirigir al dashboard (donde ProductGrid lo mostrará)
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (error) {
      setMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="create-article-layout">
        <nav className="create-article-nav">
            <Link to="/dashboard">&larr; Volver al Dashboard</Link>
            <h2>Publicar Nuevo Trueque</h2>
        </nav>
        <div className="create-article-container">
            <form className="create-article-form" onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label htmlFor="title">Título</label>
                    <input 
                        type="text" 
                        id="title"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Ej: iPhone 12 casi nuevo" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea 
                        id="description"
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Describe tu artículo, su estado, etc." 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Categoría</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="images">URLs de Imágenes</label>
                    <input 
                        type="text" 
                        id="images"
                        value={images} 
                        onChange={(e) => setImages(e.target.value)} 
                        placeholder="ej: https://img.url/1.jpg, https://img.url/2.jpg" 
                        required 
                    />
                    <small>Separar múltiples imágenes con una coma (,)</small>
                </div>

                <div className="form-group">
                    <label htmlFor="preferredItems">¿Qué buscas a cambio?</label>
                    <input 
                        type="text" 
                        id="preferredItems"
                        value={preferredItems} 
                        onChange={(e) => setPreferredItems(e.target.value)} 
                        placeholder="Ej: Libros, Videojuegos, Servicios" 
                    />
                    <small>Separar múltiples items con una coma (,)</small>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Publicando...' : 'Publicar Artículo'}
                </button>
                
                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    </div>
  );
}

export default CreateArticle;