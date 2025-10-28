import React from 'react';
import { Link } from 'react-router-dom'; // <-- ¡AÑADE ESTA LÍNEA!
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* 1. Barra Lateral (Sidebar) */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span role="img" aria-label="logo">📊</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <a href="#overview">
                <span role="img" aria-label="overview">🖼️</span>
                <span>Overview</span>
              </a>
            </li>
            <li>
              <a href="#notes">
                <span role="img" aria-label="notes">📝</span>
                <span>Notes</span>
              </a>
            </li>
            <li>
              <a href="#tasks">
                <span role="img" aria-label="tasks">🗄️</span>
                <span>Tasks</span>
              </a>
            </li>
            <li>
              <a href="#activity">
                <span role="img" aria-label="activity">⏱️</span>
                <span>Activity</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 2. Contenido Principal */}
      <main className="main-content">
        {/* 2.1. Encabezado (Header) */}
        <header className="main-header">
          <div className="header-search">
            <input type="text" placeholder="Search..." />
            <span role="img" aria-label="search">🔍</span>
          </div>
          <div className="header-nav">
            <button className="header-profile">
              <span role="img" aria-label="profile">👤</span>
            </button>
            <button className="header-settings">
              <span role="img" aria-label="settings">⚙️</span>
            </button>
          </div>
        </header>

        {/* 2.2. Área de Widgets/Tarjetas */}
        <section className="widgets-grid">
          {/* Widget 1: La tarjeta grande y morada del ejemplo */}
          <div className="widget large-card primary-bg">
            <h3>Título del Widget</h3>
            <p>Este es un texto descriptivo para el widget principal. Lorem ipsum dolor sit amet.</p>
            <div className="widget-details">
              <span>02</span>
              <span>06</span>
              <span>10</span>
              <span>46</span>
            </div>
            <div className="widget-action">
              <span role="img" aria-label="pointer">☝️</span> {/* Simula el cursor de la imagen */}
            </div>
          </div>

          {/* Widget 2: La tarjeta de imagen/texto */}
          <div className="widget small-card secondary-bg">
            <div className="card-image">
              <span role="img" aria-label="picture">🏞️</span>
            </div>
            <div className="card-content">
              <h4>Imagen y Texto</h4>
              <p>Breve descripción aquí.</p>
            </div>
          </div>
          
          {/* Widget 3: La tarjeta de texto simple */}
          <div className="widget small-card tertiary-bg">
            <h4>Solo Texto</h4>
            <p>Otra descripción más corta.</p>
          </div>

          {/* Aquí puedes añadir más widgets o componentes */}
        </section>

        {/* Botón de Cerrar Sesión (como lo teníamos antes) */}
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