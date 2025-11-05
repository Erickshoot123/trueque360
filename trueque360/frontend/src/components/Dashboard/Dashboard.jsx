import React, { useState } from 'react';
// Importamos 'Link' y 'useNavigate' para la navegación
import { Link, useNavigate } from 'react-router-dom'; 
import './Dashboard.css';

// Importamos el Grid de Productos y su CSS
import ProductGrid from '../ProductGrid/ProductGrid.jsx'; 
// --- ¡CSS QUE FALTABA! ---
import '../ProductGrid/ProductGrid.css'; 

// --- COMPONENTE WIDGET DE EJEMPLO ---
const SmallWidget = ({ title, value, icon, className }) => (
    <div className={`widget small-card ${className}`}>
        <div className="card-image">{icon}</div>
        <h4>{title}</h4>
        <p className="widget-value">{value}</p>
    </div>
);
// ------------------------------------

function Dashboard() {
    // Estado para controlar la visibilidad del menú desplegable del perfil
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir
    
    // --- Lógica de Logout (Actualizada) ---
    const handleLogout = () => {
        console.log("Cerrando sesión...");
        // Borramos el token y el ID de la sesión
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        // Redirigimos al login
        navigate('/login');
    };

    // Datos de ejemplo para las tarjetas
    const kpis = [
        { title: "Publicaciones Pendientes", value: 7, icon: "⭐" },
        { title: "Trueques Completados", value: 42, icon: "✅" },
        { title: "Valor Total (Estimado)", value: "$15,200", icon: "💰" },
        { title: "Mensajes Sin Leer", value: 3, icon: "💬" },
    ];

    return (
        <div className="dashboard-layout">
            
            {/* 1. Barra Lateral (Sidebar) */}
            <aside className="sidebar">
                <div className="sidebar-logo">Trueque 360</div>
                <nav className="sidebar-nav">
                    <ul>
                        <li className="active"><Link to="/dashboard"><span className="fas fa-home">🏠</span> Dashboard</Link></li>
                        <li><Link to="/inventory"><span className="fas fa-box">📦</span> Inventario</Link></li>
                        <li><Link to="/trades"><span className="fas fa-exchange-alt">🔄</span> Trueques</Link></li>
                        
                        {/* --- ¡AQUÍ ESTÁ EL LINK! --- */}
                        <li className="link-publicar">
                            <Link to="/publicar">➕ Publicar Trueque</Link>
                        </li>
                        {/* -------------------------------------- */}

                        <li><Link to="/messages"><span className="fas fa-envelope">✉️</span> Mensajes</Link></li>
                        {/*<li><Link to="/settings"><span className="fas fa-cog">⚙️</span> Configuración</Link></li>*/}
                    </ul>
                </nav>
            </aside>

            {/* 2. Contenido Principal */}
            <main className="main-content">
                
                {/* 2.1. Encabezado (Header) */}
                <header className="main-header">
                    <h2>Dashboard General</h2>
                    <div className="header-search">
                        <span className="fas fa-search">🔍</span>
                        <input type="text" placeholder="Buscar Trueques, Artículos..." />
                    </div>
                    
                    {/* Sección del Menú de Perfil */}
                    <div className="header-nav">
                        {/* Notificaciones */}
                        <button title="Notificaciones" className="nav-button"><span className="fas fa-bell">🔔</span></button>
                        
                        {/* Contenedor del Perfil y Menú */}
                        <div className="profile-menu-container">
                            {/* Botón de Perfil (el icono de persona) */}
                            <button 
                                title="Perfil" 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                className="nav-button profile-toggle-button"
                            >
                                <span className="fas fa-user-circle">👤</span>
                            </button>

                            {/* Menú Desplegable (Condicional) */}
                            {isMenuOpen && (
                                <div className="profile-dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">Mi Perfil</Link>
                                    
                                    {/* Botón de Cerrar Sesión (ahora funcional) */}
                                    <button 
                                        className="logout-button-dropdown" 
                                        onClick={handleLogout}
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                
                {/* 2.2. Área de Widgets/Tarjetas */}
                <section className="widgets-grid">
                    {kpis.map((kpi, index) => (
                        <SmallWidget 
                            key={index} 
                            title={kpi.title} 
                            value={kpi.value} 
                            icon={kpi.icon}
                        />
                    ))}
                    {/* Tarjeta Grande */}
                    <div className="widget large-card">
                        <h3>Actividad Reciente</h3>
                        <p>Aquí se listarán los trueques y mensajes más recientes.</p>
                    </div>
                </section>
                
                {/* 2.3. Área de ProductGrid (Como lo teníamos) */}
                <ProductGrid />

            </main>
        </div>
    );
}

export default Dashboard;