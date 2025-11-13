import React, { useState, useEffect, useRef } from 'react';
import './MessageTab.css';

function MessageTab() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  // Cargar conversaciones del usuario
  useEffect(() => {
    if (!token) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar conversaciones');
        }

        const data = await response.json();
        setConversations(data.data || []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (!selectedConversation || !token) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages/conversation/${selectedConversation._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Error al cargar mensajes');
        }

        const data = await response.json();
        setMessages(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedConversation, token]);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // Encontrar el otro participante
      const otherParticipant = selectedConversation.participants.find(
        p => p._id.toString() !== userId
      );

      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          receiverId: otherParticipant._id,
          content: newMessage
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }

      const data = await response.json();
      
      // Agregar el mensaje a la lista
      setMessages([...messages, data.data]);
      setNewMessage('');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  // Obtener el nombre del otro participante
  const getOtherParticipantName = (conversation) => {
    const other = conversation.participants.find(p => p._id.toString() !== userId);
    return other ? other.username : 'Usuario';
  };

  if (loading && conversations.length === 0) {
    return <div className="message-tab loading">Cargando mensajes...</div>;
  }

  return (
    <div className="message-tab-container">
      {/* Sidebar de conversaciones */}
      <div className="conversations-list-section">
        <h3>Conversaciones</h3>
        {conversations.length === 0 ? (
          <p className="empty-state">No tienes conversaciones aún</p>
        ) : (
          <ul className="conversations-list">
            {conversations.map((conv) => (
              <li
                key={conv._id}
                className={`conversation-item ${
                  selectedConversation?._id === conv._id ? 'active' : ''
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="conversation-left">
                  {conv.article && conv.article.images && conv.article.images[0] ? (
                    <img src={conv.article.images[0]} alt={conv.article.title || 'Artículo'} className="conv-article-thumb" />
                  ) : (
                    <div className="conv-article-placeholder" />
                  )}
                </div>
                <div className="conversation-info">
                  <div className="participant-name">
                    {getOtherParticipantName(conv)}
                  </div>
                  {conv.article && (
                    <div className="conversation-article">Artículo: {conv.article.title}</div>
                  )}
                  {conv.lastMessage && (
                    <div className="last-message">
                      {conv.lastMessage.content.substring(0, 50)}
                      {conv.lastMessage.content.length > 50 ? '...' : ''}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Área de chat */}
      <div className="chat-area">
        {selectedConversation ? (
          <>
            {/* Header del chat */}
            <div className="chat-header">
              <h3>
                {getOtherParticipantName(selectedConversation)}
                {selectedConversation.article && (
                  <>
                    {selectedConversation.article.images && selectedConversation.article.images[0] && (
                      <img src={selectedConversation.article.images[0]} alt={selectedConversation.article.title} className="chat-article-thumb" />
                    )}
                    <span className="chat-article"> — {selectedConversation.article.title}</span>
                  </>
                )}
              </h3>
              <div className="chat-header-actions">
                <button
                  type="button"
                  className="delete-conv-btn"
                  onClick={async () => {
                    const confirmDelete = window.confirm('¿Eliminar esta conversación y todos sus mensajes?');
                    if (!confirmDelete) return;

                    try {
                      const response = await fetch(`http://localhost:3000/api/conversations/${selectedConversation._id}`, {
                        method: 'DELETE',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });

                      const result = await response.json();
                      if (!response.ok) {
                        throw new Error(result.message || 'Error al eliminar la conversación');
                      }

                      // Quitar la conversación del listado y limpiar la vista
                      setConversations(conversations.filter(c => c._id !== selectedConversation._id));
                      setSelectedConversation(null);
                      setMessages([]);
                      alert(result.message || 'Conversación eliminada');
                    } catch (err) {
                      console.error(err);
                      setError(err.message || 'Error al eliminar la conversación');
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="messages-area">
              {messages.length === 0 ? (
                <div className="empty-messages">
                  <p>Inicia la conversación con un mensaje</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMyMessage = msg.sender._id === userId;
                  const senderName = isMyMessage ? 'Tú' : msg.sender.username;
                  
                  return (
                    <div
                      key={msg._id}
                      className={`message-wrapper ${
                        isMyMessage ? 'my-message-wrapper' : 'other-message-wrapper'
                      }`}
                    >
                      <div
                        className={`message-bubble ${
                          isMyMessage ? 'my-message' : 'other-message'
                        }`}
                      >
                        {!isMyMessage && (
                          <span className="message-sender">{senderName}</span>
                        )}
                        <p className="message-content">{msg.content}</p>
                        <span className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="message-input"
              />
              <button type="submit" className="send-btn">Enviar</button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <p>Selecciona una conversación para comenzar</p>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default MessageTab;
