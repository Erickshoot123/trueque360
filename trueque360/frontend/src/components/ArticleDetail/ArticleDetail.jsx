import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ChatInitiator from '../ChatInitiator/ChatInitiator';
import TradeProposal from '../TradeProposal/TradeProposal';
import './ArticleDetail.css'; // Crearemos este CSS

function ArticleDetail() {
  // Obtenemos el 'id' del artículo desde la URL (ej: /articulo/12345)
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChatInitiator, setShowChatInitiator] = useState(false);
  const [showTradeProposal, setShowTradeProposal] = useState(false);

  // Verificamos si el usuario actual es el dueño
  const currentUserId = sessionStorage.getItem('userId');
  const isOwner = article && currentUserId === article.owner._id;

  // 1. Efecto para Cargar los datos del artículo
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Llamamos al endpoint de la API que ya creaste
        const response = await fetch(`http://localhost:3000/api/articles/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'No se pudo cargar el artículo');
        }
        setArticle(data.article);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // Se ejecuta cada vez que el 'id' en la URL cambia

  // 2. Función para Borrar la publicación
  const handleDelete = async () => {
    // (En una app real, pediríamos confirmación)
    
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado para realizar esta acción.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar');
      }

      // ¡Éxito! Redirigir de vuelta al Dashboard
      alert('¡Artículo eliminado!'); // (Usamos alert temporalmente, idealmente sería un modal)
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    }
  };

  // 3. Función para borrar conversaciones asociadas al artículo (solo dueño)
  const handleDeleteArticleChats = async () => {
    const confirmDelete = window.confirm('¿Eliminar todas las conversaciones relacionadas con este artículo? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado para realizar esta acción.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/conversations/article/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar conversaciones');
      }

      alert('Conversaciones relacionadas con el artículo eliminadas correctamente');
    } catch (err) {
      setError(err.message);
    }
  };


  // --- Renderizado ---
  if (loading) {
    return <div className="detail-loading">Cargando artículo...</div>;
  }

  if (error) {
    return <div className="detail-error">Error: {error}</div>;
  }

  if (!article) {
    return <div className="detail-error">Artículo no encontrado.</div>;
  }

  // --- ¡AQUÍ ESTÁ LA DEPURACIÓN! ---
  // Si llegamos a este punto, 'article' ya no es null.
  console.log("--- DEBUG DEL BOTÓN ---");
  console.log("ID del usuario logueado (currentUserId):", currentUserId);
  console.log("ID del dueño del artículo (article.owner._id):", article ? article.owner._id : "Artículo no cargado");
  console.log("¿Son iguales? (isOwner):", isOwner);
  console.log("------------------------");
  // ---------------------------------

  // ¡Datos cargados! Mostramos la página
  return (
    <div className="article-detail-container">
      <Link to="/dashboard" className="back-link">&larr; Volver al Dashboard</Link>
      
      <div className="article-content-wrapper">
        {/* Columna de Imagen */}
        <div className="article-image-section">
          <img src={article.images[0]} alt={article.title} />
        </div>

        {/* Columna de Detalles */}
        <div className="article-info-section">
          <span className="info-category">{article.category}</span>
          <h1>{article.title}</h1>
          <p className="info-owner">Publicado por: <strong>{article.owner.username}</strong></p>

          <h3>Descripción</h3>
          <p>{article.description}</p>

          <h3>Busca a cambio (Preferred Items):</h3>
          {article.preferredItems && article.preferredItems.length > 0 ? (
            <ul className="preferred-items-list">
              {article.preferredItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>El publicador no especificó items preferidos.</p>
          )}

          {/* --- ¡BOTÓN CONDICIONAL! --- */}
          {/* Solo se muestra si el 'isOwner' es true */}
          {isOwner && (
            <>
              <button onClick={handleDelete} className="delete-button">
                🗑️ Borrar Publicación
              </button>
              <button onClick={handleDeleteArticleChats} className="delete-chats-button">
                🧹 Borrar conversaciones del artículo
              </button>
            </>
          )}

          {/* --- ¡BOTÓN PARA CONTACTAR! --- */}
          {/* Solo se muestra si el usuario NO es el dueño */}
          {!isOwner && (
            <>
              <button 
                onClick={() => setShowChatInitiator(true)} 
                className="contact-button"
              >
                💬 Contactar al Vendedor
              </button>
              <button 
                onClick={() => setShowTradeProposal(true)} 
                className="trade-button"
              >
                🤝 Proponer Trueque
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de ChatInitiator */}
      {showChatInitiator && (
        <ChatInitiator
          articleOwner={article.owner}
          articleId={article._id}
          onClose={() => setShowChatInitiator(false)}
          onSuccess={() => {
            alert('¡Mensaje enviado! Ve a la sección de Mensajes para continuar la conversación.');
            setShowChatInitiator(false);
          }}
        />
      )}

      {/* Modal de Propuesta de Trueque */}
      {showTradeProposal && (
        <TradeProposal
          articleId={article._id}
          articleOwner={article.owner}
          onClose={() => setShowTradeProposal(false)}
          onSuccess={() => {
            setShowTradeProposal(false);
          }}
        />
      )}
    </div>
  );
}

export default ArticleDetail;