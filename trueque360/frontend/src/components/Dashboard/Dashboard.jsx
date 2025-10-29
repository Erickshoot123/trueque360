import React from 'react';
import { Link } from 'react-router-dom'; // <-- ¡AÑADE ESTA LÍNEA QUE FALTABA!
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* 1. Barra Lateral (Sidebar) */}
      <aside className="sidebar">
        {/* ... (todo tu código de la sidebar) ... */}
      </aside>

      {/* 2. Contenido Principal */}
      <main className="main-content">
        {/* 2.1. Encabezado (Header) */}
        <header className="main-header">
          {/* ... (todo tu código del header) ... */}
        </header>

        {/* 2.2. Área de Widgets/Tarjetas */}
        <section className="widgets-grid">
          {/* ... (todas tus tarjetas/widgets) ... */}
        </section>

        {/* Botón de Cerrar Sesión (ahora funcionará) */}
        <div className="logout-section">
          <Link to="/login" className="logout-button">
            Cerrar Sesión
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;