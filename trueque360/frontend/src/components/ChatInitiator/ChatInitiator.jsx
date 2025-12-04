import React, { useState } from 'react';
import './ChatInitiator.css';

function ChatInitiator({ articleOwner, articleId, onClose, onSuccess }) {
  const [message, setMessage] = useState('¿Sigue disponible?');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    if (userId === articleOwner._id) {
      setError('No puedes iniciar una conversación contigo mismo');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Crear la conversación
      const conversationResponse = await fetch(
        'https://trueque360.onrender.com/api/conversations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
              body: JSON.stringify({
                participantId: articleOwner._id,
                articleId: articleId
              })
        }
      );

      if (!conversationResponse.ok) {
        throw new Error('Error al crear la conversación');
      }

      const conversationData = await conversationResponse.json();
      const conversationId = conversationData.data._id;

      // 2. Enviar el mensaje
      const messageResponse = await fetch(
        'https://trueque360.onrender.com/api/messages',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            conversationId: conversationId,
            receiverId: articleOwner._id,
            content: message
          })
        }
      );

      if (!messageResponse.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      // Éxito
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-initiator-overlay">
      <div className="chat-initiator-modal">
        <div className="modal-header">
          <h2>Contactar a {articleOwner.username}</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="chat-initiator-form">
          <div className="form-group">
            <label htmlFor="message">Tu mensaje inicial:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows="4"
              disabled={loading}
              className="message-textarea"
            />
            <p className="form-hint">
              Sugerencia predeterminada: "¿Sigue disponible?"
            </p>
          </div>

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
              className="btn-send"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInitiator;
