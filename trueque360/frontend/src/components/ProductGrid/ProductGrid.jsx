import React, { useState, useEffect } from 'react';
// --- ¡IMPORTA 'Link' DE REACT-ROUTER-DOM! ---
import { Link } from 'react-router-dom';
// (No necesitas importar el CSS aquí si ya lo haces en Dashboard.js)
import './ProductGrid.css'; // <-- ¡HE CORREGIDO ESTO!

function ProductGrid({ selectedCategory = 'Todos' }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función Async para cargar los artículos
    const fetchArticles = async () => {
      try {
        // Llamamos a la API del backend (ruta pública)
        const response = await fetch('http://localhost:3000/api/articles');
        if (!response.ok) {
          throw new Error('Error al cargar los artículos');
        }
        const data = await response.json();
        setArticles(data.articles); // Guardamos los artículos en el estado
      } catch (err) {
        setError(err.message); // Guardamos el error
      } finally {
        setLoading(false); // Terminamos de cargar
      }
    };

    fetchArticles();
  }, []); // El array vacío [] significa que esto se ejecuta 1 vez al montar el componente

  // --- Filtrar artículos según la categoría seleccionada ---
  const filteredArticles = selectedCategory === 'Todos' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  // --- Renderizado de Carga ---
  if (loading) {
    return <div className="product-grid-loading">Cargando artículos...</div>;
  }

  // --- Renderizado de Error ---
  if (error) {
    return <div className="product-grid-error">Error: {error}</div>;
  }

  // --- Renderizado de Artículos ---
  return (
    <div className="product-grid-container">
      <h2>Artículos Disponibles</h2>

      {/* Contenedor de la cuadrícula */}
      <div className="product-grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
            // Cada tarjeta ahora es un Link a su página de detalle
            <Link to={`/articulo/${article._id}`} key={article._id} className="product-card-link">
              <div className="product-card">
                <div className="card-image-container">
                  <img 
                    src={article.images[0] || 'https://placehold.co/300x200?text=Sin+Imagen'} 
                    alt={article.title} 
                    onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=Error'; }}
                  />
                </div>
                <div className="card-content">
                  <h3 className="card-title">{article.title}</h3>
                  <p className="card-preferred">
                    Busca: {article.preferredItems.join(', ') || 'Abierto a ofertas'}
                  </p>
                  <span className="card-owner">
                    Publicado por: {article.owner ? article.owner.username : 'Anónimo'}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No hay artículos disponibles en esta categoría.</p>
        )}
      </div>
    </div>
  );
}

export default ProductGrid;