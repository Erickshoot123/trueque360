import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './EditArticle.css';

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Estados para cada campo del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Otros');
  const [images, setImages] = useState('');
  const [preferredItems, setPreferredItems] = useState('');
  const [status, setStatus] = useState('Disponible');

  const token = sessionStorage.getItem('token');
  const categories = ['Electrónica', 'Libros', 'Servicios', 'Hogar', 'Otros'];
  const statuses = ['Disponible', 'Otros'];

  // Cargar los datos del artículo
  useEffect(() => {
    const fetchArticle = async () => {
      if (!token) {
        setError('No estás autenticado');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://trueque360.onrender.com/api/articles/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar el artículo');
        }

        const data = await response.json();
        const article = data.article;

        // Llenar los campos del formulario
        setTitle(article.title || '');
        setDescription(article.description || '');
        setCategory(article.category || 'Otros');
        setImages(Array.isArray(article.images) ? article.images.join(', ') : (article.images || ''));
        setPreferredItems(Array.isArray(article.preferredItems) ? article.preferredItems.join(', ') : (article.preferredItems || ''));
        setStatus(article.status || 'Disponible');
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSaving(true);

    if (!token) {
      setError('Error: No estás autenticado');
      setIsSaving(false);
      return;
    }

    try {
      // Preparar los datos
      const articleData = {
        title,
        description,
        category,
        images: images.split(',').map(img => img.trim()).filter(img => img.length > 0),
        preferredItems: preferredItems.split(',').map(item => item.trim()).filter(item => item.length > 0),
        status
      };

      // Validar que haya al menos una imagen
      if (articleData.images.length === 0) {
        throw new Error('Debes proporcionar al menos una URL de imagen.');
      }

      // Llamar a la API (PUT para actualizar)
      const response = await fetch(`http://localhost:3000/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          throw new Error(data.errors.join(', '));
        }
        throw new Error(data.message || 'Error al actualizar el artículo');
      }

      // Éxito
      setMessage('¡Artículo actualizado con éxito! Redirigiendo...');
      setTimeout(() => navigate('/inventory'), 1500);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-article-layout">
        <div className="loading-container">
          <p>Cargando artículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-article-layout">
      <nav className="edit-article-nav">
        <Link to="/inventory">&larr; Volver al Inventario</Link>
        <h2>Editar artículo</h2>
      </nav>
      <div className="edit-article-container">
        {error && <div className="error-message"><p>{error}</p></div>}
        
        <form className="edit-article-form" onSubmit={handleSubmit}>
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
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
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

          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          {message && <p className="form-message success">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default EditArticle;
