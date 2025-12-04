import React, { useState, useEffect } from 'react';
import './TradeProposal.css';

function TradeProposal({ articleId, articleOwner, onClose, onSuccess }) {
  const [userArticles, setUserArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [proposalMode, setProposalMode] = useState('article'); // 'article' o 'description'
  const [proposalDescription, setProposalDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  // Cargar artículos del usuario actual
  useEffect(() => {
    if (!token) return;

    const fetchUserArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://trueque360.onrender.com/api/articles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar tus artículos');
        }

        const data = await response.json();
        // backend devuelve { success, articles }
        const allArticles = data.articles || [];

        // Filtrar solo artículos del usuario actual y disponibles
        const myArticles = allArticles.filter(a => {
          // owner puede estar poblado como objeto {_id, username} o como id string
          const ownerId = a.owner && (a.owner._id || a.owner);
          return String(ownerId) === String(userId) && a.status === 'Disponible';
        });

        setUserArticles(myArticles);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserArticles();
  }, [token, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (proposalMode === 'article') {
      if (!selectedArticleId) {
        setError('Por favor selecciona un artículo para ofrecer');
        return;
      }
    } else {
      if (!proposalDescription.trim()) {
        setError('Por favor describe el artículo que ofreces');
        return;
      }
      if (proposalDescription.trim().length < 10) {
        setError('La descripción debe tener al menos 10 caracteres');
        return;
      }
    }

    try {
      setLoading(true);

      const body = {
        receiverId: articleOwner._id,
        receiverArticleId: articleId
      };

      // Añadir propuesta según el modo
      if (proposalMode === 'article') {
        body.proposerArticleId = selectedArticleId;
      } else {
        body.proposedItemDescription = proposalDescription.trim();
      }

      const response = await fetch('https://trueque360.onrender.com/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al proponer trueque');
      }

      if (onSuccess) {
        onSuccess();
      }
      alert('¡Solicitud de trueque enviada correctamente!');
      onClose();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trade-proposal-overlay">
      <div className="trade-proposal-modal">
        <div className="modal-header">
          <h2>Proponer Trueque a {articleOwner.username}</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="trade-proposal-form">
          {/* Tabs para seleccionar modo */}
          <div className="proposal-tabs">
            <button
              type="button"
              className={`tab-btn ${proposalMode === 'article' ? 'active' : ''}`}
              onClick={() => {
                setProposalMode('article');
                setError(null);
              }}
              disabled={loading || userArticles.length === 0}
            >
              📦 Seleccionar Artículo
            </button>
            <button
              type="button"
              className={`tab-btn ${proposalMode === 'description' ? 'active' : ''}`}
              onClick={() => {
                setProposalMode('description');
                setError(null);
              }}
              disabled={loading}
            >
              ✍️ Describir Artículo
            </button>
          </div>

          {/* Modo: Seleccionar artículo */}
          {proposalMode === 'article' && (
            <div className="form-group">
              <label htmlFor="article">Selecciona el artículo que ofreces:</label>
              {userArticles.length === 0 ? (
                <p className="empty-message">
                  No tienes artículos disponibles publicados. 
                  <br />
                  Usa la pestaña "Describir Artículo" para proponer un trueque sin publicar.
                </p>
              ) : (
                <>
                  <select
                    id="article"
                    value={selectedArticleId}
                    onChange={(e) => setSelectedArticleId(e.target.value)}
                    disabled={loading}
                    className="article-select"
                  >
                    <option value="">-- Selecciona un artículo --</option>
                    {userArticles.map(article => (
                      <option key={article._id} value={article._id}>
                        {article.title}
                      </option>
                    ))}
                  </select>

                  {/* Vista previa de la imagen del artículo seleccionado */}
                  {selectedArticleId && (() => {
                    const sel = userArticles.find(a => a._id === selectedArticleId);
                    if (!sel) return null;
                    const img = (sel.images && sel.images[0]) || '';
                    return (
                      <div className="article-preview">
                        {img ? (
                          <img src={img} alt={sel.title} />
                        ) : (
                          <div className="no-image">Sin imagen</div>
                        )}
                        <div className="preview-title">{sel.title}</div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {/* Modo: Describir artículo */}
          {proposalMode === 'description' && (
            <div className="form-group">
              <label htmlFor="description">Describe el artículo que ofreces:</label>
              <textarea
                id="description"
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                disabled={loading}
                className="description-textarea"
                placeholder="Ej: Una bicicleta roja en buen estado, con cambios de 18 velocidades..."
                maxLength="500"
              />
              <small className="char-count">
                {proposalDescription.length}/500 caracteres
              </small>
            </div>
          )}

          {error && <div className="error-alert">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-propose"
              disabled={loading}
            >
              {loading ? 'Enviando...' : '🤝 Proponer Trueque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TradeProposal;
