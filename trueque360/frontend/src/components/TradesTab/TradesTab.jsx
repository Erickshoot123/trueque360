import React, { useState, useEffect, useMemo } from 'react';
import './TradesTab.css';

function TradesTab() {
  const [trades, setTrades] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  // Cargar trueques al montar el componente
  useEffect(() => {
    if (!token) return;

    const fetchTrades = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/trades', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los trueques');
        }

        const data = await response.json();
        setTrades(data.data || { received: [], sent: [] });
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [token]);

  // Actualizar estado del trueque
  const handleUpdateStatus = async (tradeId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/trades/${tradeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el trueque');
      }

      const data = await response.json();

      // Para estados "Completed" y "Cancelled", eliminar de la pantalla
      if (status === 'Completed' || status === 'Cancelled') {
        setTrades(prev => ({
          received: prev.received.filter(t => t._id !== tradeId),
          sent: prev.sent.filter(t => t._id !== tradeId)
        }));
      } else {
        // Para otros estados, actualizar la tarjeta
        setTrades(prev => ({
          received: prev.received.map(t => t._id === tradeId ? data.data : t),
          sent: prev.sent.map(t => t._id === tradeId ? data.data : t)
        }));
      }

      // Mostrar mensaje según el estado
      let mensaje = '';
      if (status === 'Completed') {
        mensaje = '✅ ¡Trueque confirmado! La tarjeta ha sido eliminada.';
      } else if (status === 'Cancelled') {
        mensaje = '❌ Trueque cancelado. La tarjeta ha sido eliminada.';
      } else if (status === 'Accepted') {
        mensaje = '✅ Trueque aceptado correctamente';
      } else if (status === 'Rejected') {
        mensaje = '❌ Trueque rechazado correctamente';
      }
      
      alert(mensaje);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  // Build a list of available statuses from received+sent so the combobox shows
  // only actual statuses present for this user. Always include 'All'.
  const [selectedStatus, setSelectedStatus] = useState('All');
  const statusOptions = useMemo(() => {
    const s = new Set();
    (trades.received || []).forEach(t => t.status && s.add(t.status));
    (trades.sent || []).forEach(t => t.status && s.add(t.status));
    const arr = Array.from(s).sort();
    return ['All', ...arr];
  }, [trades]);

  const filterList = (list) => {
    if (!list) return [];
    if (selectedStatus === 'All') return list;
    return list.filter(t => t.status === selectedStatus);
  };

  if (loading) {
    return <div className="trades-tab loading">Cargando trueques...</div>;
  }

  return (
    <div className="trades-tab-container">
      {error && <div className="error-message">{error}</div>}

      {/* Filter control */}
      <div className="trades-filter">
        <label htmlFor="trade-status-filter">Filtrar por estado:</label>
        <select id="trade-status-filter" className="trades-status-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Trueques Recibidos */}
      <div className="trades-section">
        <h2>📥 Solicitudes de Trueque Recibidas</h2>
        {filterList(trades.received).length === 0 ? (
          <p className="empty-state">No tienes solicitudes de trueque recibidas</p>
        ) : (
          <div className="trades-list">
            {filterList(trades.received).map(trade => (
              <div key={trade._id} className={`trade-card trade-${trade.status.toLowerCase()}`}>
                <div className="trade-header">
                  <h3>🤝 Trueque de {trade.proposer.username}</h3>
                  <span className={`trade-status ${trade.status.toLowerCase()}`}>{trade.status}</span>
                </div>

                <div className="trade-body">
                  <div className="trade-column">
                    <h4>📦 Ofrece:</h4>
                    {trade.proposerArticle ? (
                      <div className="trade-article">
                        {trade.proposerArticle.images && trade.proposerArticle.images[0] && (
                          <img src={trade.proposerArticle.images[0]} alt={trade.proposerArticle.title} />
                        )}
                        <p>{trade.proposerArticle.title}</p>
                      </div>
                    ) : (
                      <div className="trade-description">
                        <p className="description-text">{trade.proposedItemDescription}</p>
                      </div>
                    )}
                  </div>

                  <div className="trade-separator">⟷</div>

                  <div className="trade-column">
                    <h4>🎁 Desea:</h4>
                    {trade.receiverArticle ? (
                      <div className="trade-article">
                        {trade.receiverArticle.images && trade.receiverArticle.images[0] && (
                          <img src={trade.receiverArticle.images[0]} alt={trade.receiverArticle.title} />
                        )}
                        <p>{trade.receiverArticle.title}</p>
                      </div>
                    ) : (
                      <div className="trade-description">
                        <p className="description-text">{trade.requestedItemDescription}</p>
                      </div>
                    )}
                  </div>
                </div>

                {trade.status === 'Pending' && (
                  <div className="trade-actions">
                    <button
                      className="btn-accept"
                      onClick={() => handleUpdateStatus(trade._id, 'Accepted')}
                    >
                      ✅ Aceptar
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleUpdateStatus(trade._id, 'Rejected')}
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                )}

                {trade.status === 'Accepted' && (
                  <div className="trade-actions">
                    <button
                      className="btn-confirm"
                      onClick={() => handleUpdateStatus(trade._id, 'Completed')}
                    >
                      ✅ Confirmar Trueque
                    </button>
                    <button
                      className="btn-cancel-trade"
                      onClick={() => handleUpdateStatus(trade._id, 'Cancelled')}
                    >
                      ❌ Cancelar Trueque
                    </button>
                  </div>
                )}

                {trade.status === 'Accepted' && (
                  <div className="trade-accepted-info">
                    <p>✅ Has aceptado este trueque. Coordina los detalles con {trade.proposer.username}</p>
                  </div>
                )}

                {trade.status === 'Rejected' && (
                  <div className="trade-rejected-info">
                    <p>❌ Has rechazado este trueque</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trueques Enviados */}
      <div className="trades-section">
        <h2>📤 Solicitudes de Trueque Enviadas</h2>
        {filterList(trades.sent).length === 0 ? (
          <p className="empty-state">No has enviado solicitudes de trueque</p>
        ) : (
          <div className="trades-list">
            {filterList(trades.sent).map(trade => (
              <div key={trade._id} className={`trade-card trade-${trade.status.toLowerCase()}`}>
                <div className="trade-header">
                  <h3>🤝 Trueque para {trade.receiver.username}</h3>
                  <span className={`trade-status ${trade.status.toLowerCase()}`}>{trade.status}</span>
                </div>

                <div className="trade-body">
                  <div className="trade-column">
                    <h4>📦 Ofreces:</h4>
                    {trade.proposerArticle ? (
                      <div className="trade-article">
                        {trade.proposerArticle.images && trade.proposerArticle.images[0] && (
                          <img src={trade.proposerArticle.images[0]} alt={trade.proposerArticle.title} />
                        )}
                        <p>{trade.proposerArticle.title}</p>
                      </div>
                    ) : (
                      <div className="trade-description">
                        <p className="description-text">{trade.proposedItemDescription}</p>
                      </div>
                    )}
                  </div>

                  <div className="trade-separator">⟷</div>

                  <div className="trade-column">
                    <h4>🎁 Deseas:</h4>
                    {trade.receiverArticle ? (
                      <div className="trade-article">
                        {trade.receiverArticle.images && trade.receiverArticle.images[0] && (
                          <img src={trade.receiverArticle.images[0]} alt={trade.receiverArticle.title} />
                        )}
                        <p>{trade.receiverArticle.title}</p>
                      </div>
                    ) : (
                      <div className="trade-description">
                        <p className="description-text">{trade.requestedItemDescription}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="trade-info">
                  {trade.status === 'Pending' && (
                    <p>⏳ Esperando respuesta de {trade.receiver.username}...</p>
                  )}
                  {trade.status === 'Accepted' && (
                    <p>✅ ¡{trade.receiver.username} aceptó tu solicitud! Coordina los detalles</p>
                  )}
                  {trade.status === 'Rejected' && (
                    <p>❌ {trade.receiver.username} rechazó tu solicitud</p>
                  )}
                </div>

                {trade.status === 'Accepted' && (
                  <div className="trade-actions">
                    <button
                      className="btn-confirm"
                      onClick={() => handleUpdateStatus(trade._id, 'Completed')}
                    >
                      ✅ Confirmar Trueque
                    </button>
                    <button
                      className="btn-cancel-trade"
                      onClick={() => handleUpdateStatus(trade._id, 'Cancelled')}
                    >
                      ❌ Cancelar Trueque
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TradesTab;
