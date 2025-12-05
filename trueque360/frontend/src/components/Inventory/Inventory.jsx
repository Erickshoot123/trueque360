import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Inventory.css';
import { API_BASE } from '../../api';

function Inventory() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  const categories = ['Todos', 'Electrónica', 'Libros', 'Servicios', 'Hogar', 'Otros'];

  useEffect(() => {
    const fetchMyArticles = async () => {
      if (!token || !userId) {
        setError('No autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/articles`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los artículos');
        }

        const data = await response.json();
        // Filtrar solo los artículos del usuario actual
        const myArticles = data.articles.filter(
          article => article.owner && article.owner._id === userId
        );
        setArticles(myArticles);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyArticles();
  }, [token, userId]);

  // Filtrar artículos por categoría
  const filteredArticles = selectedCategory === 'Todos' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="inventory-loading">Cargando tu inventario...</div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      {/* Header */}
      <div className="inventory-header">
        <div className="inventory-header-content">
          <h1>📦 Mi Inventario</h1>
          <p className="inventory-subtitle">Artículos que has publicado y están disponibles para trueque</p>
        </div>
        <Link to="/publicar" className="btn-new-article">
          ➕ Nuevo Artículo
        </Link>
      </div>

      {/* Filtro de categorías */}
      <div className="inventory-filter">
        <label htmlFor="category-filter">Filtrar por categoría:</label>
        <select 
          id="category-filter"
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Contador de artículos */}
      <div className="inventory-stats">
        <span className="stat-item">
          <strong>Total:</strong> {articles.length} artículos
        </span>
        <span className="stat-item">
          <strong>En esta categoría:</strong> {filteredArticles.length}
        </span>
      </div>

      {/* Grid de artículos */}
      <div className="inventory-grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div key={article._id} className="inventory-card">
              <div className="card-image-wrapper">
                <img 
                  src={article.images[0] || 'https://placehold.co/300x200?text=Sin+Imagen'} 
                  alt={article.title}
                  className="card-image"
                  onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=Error'; }}
                />
                <span className="card-category-badge">{article.category}</span>
                <span className={`card-status-badge status-${article.status.toLowerCase()}`}>
                  {article.status}
                </span>
              </div>

              <div className="card-info">
                <h3 className="card-title">{article.title}</h3>
                
                <p className="card-description">
                  {article.description.substring(0, 80)}
                  {article.description.length > 80 ? '...' : ''}
                </p>

                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">Busca:</span>
                    <span className="detail-value">
                      {article.preferredItems.length > 0 
                        ? article.preferredItems.slice(0, 2).join(', ')
                        : 'Abierto a ofertas'}
                      {article.preferredItems.length > 2 ? '...' : ''}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Publicado:</span>
                    <span className="detail-value">
                      {new Date(article.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <Link to={`/articulo/${article._id}`} className="btn-view">
                    Ver Detalles
                  </Link>
                  <Link to={`/editar/${article._id}`} className="btn-edit">
                    ✏️ Editar
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h2>No hay artículos en esta categoría</h2>
            <p>
              {selectedCategory === 'Todos' 
                ? 'Comienza a publicar artículos para intercambiar' 
                : `No tienes artículos en la categoría "${selectedCategory}"`}
            </p>
            <Link to="/publicar" className="btn-create">
              ➕ Publicar mi primer artículo
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}

export default Inventory;
