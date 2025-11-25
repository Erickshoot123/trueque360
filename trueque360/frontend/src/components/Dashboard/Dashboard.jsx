import React, { useState, useEffect, useRef } from 'react';
// Importamos 'Link' y 'useNavigate' para la navegación
import { Link, useNavigate } from 'react-router-dom'; 
import './Dashboard.css';

// Importamos el Grid de Productos y su CSS
import ProductGrid from '../ProductGrid/ProductGrid.jsx'; 
// --- ¡CSS QUE FALTABA! ---
import '../ProductGrid/ProductGrid.css'; 

const API_BASE = 'http://localhost:3000';

// --- COMPONENTE WIDGET DE EJEMPLO (SIN EMOJIS) ---
const SmallWidget = ({ title, value, onClick, className }) => (
    <div className={`widget small-card ${className}`} onClick={onClick} style={{ cursor: 'pointer' }}>
        <h4>{title}</h4>
        <p className="widget-value">{value}</p>
    </div>
);
// ------------------------------------

function Dashboard() {
    // Estado para controlar la visibilidad del menú desplegable del perfil
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos'); // Estado para la categoría seleccionada
    const [stats, setStats] = useState(null); // Estado para las estadísticas del usuario
    const [loadingStats, setLoadingStats] = useState(true); // Estado de carga de stats
    const navigate = useNavigate(); // Hook para redirigir
    const profileMenuRef = useRef(null); // Referencia para detectar clicks fuera
    
    // Categorías dis ponibles
    const categories = ['Todos', 'Electrónica', 'Libros', 'Servicios', 'Hogar', 'Otros'];
    
    // --- Cargar estadísticas del usuario al montar el componente ---
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    setLoadingStats(false);
                    return;
                }

                const response = await fetch(`${API_BASE}/api/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                
                if (data.success && data.data) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Error al obtener estadísticas:', error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);
    
    // --- Lógica para cerrar menú al click fuera ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el click no está dentro del contenedor del menú, cerrar el menú
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        // Solo añadir listener si el menú está abierto
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Limpiar el listener cuando el componente se desmonta o cuando isMenuOpen cambia
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);
    
    // --- Lógica de Logout (Actualizada) ---
    const handleLogout = () => {
        console.log("Cerrando sesión...");
        // Borramos el token y el ID de la sesión
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        // Redirigimos al login
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            
            {/* 1. Barra Lateral (Sidebar) */}
            <aside className="sidebar">
                <div className="sidebar-logo">Trueque 360</div>
                <nav className="sidebar-nav">
                    <ul>
                        <li className="active"><Link to="/dashboard"><span className="fas fa-home">🏠</span> Dashboard</Link></li>
                        <li><Link to="/inventory"><span className="fas fa-box">📦</span> Inventario</Link></li>
                        <li><Link to="/trueques"><span className="fas fa-exchange-alt">🤝</span> Trueques</Link></li>
                        
                        {/* --- ¡AQUÍ ESTÁ EL LINK! --- */}
                        <li className="link-publicar">
                            <Link to="/publicar">➕ Publicar articulo</Link>
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
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="category-select"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Sección del Menú de Perfil */}
                    <div className="header-nav">
                        {/* Notificaciones */}
                        <button title="Notificaciones" className="nav-button"><span className="fas fa-bell">🔔</span></button>
                        
                        {/* Contenedor del Perfil y Menú */}
                        <div className="profile-menu-container" ref={profileMenuRef}>
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
                                    <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Mi Perfil</Link>
                                    
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
                    {!loadingStats ? (
                        <>
                            <SmallWidget 
                                title="🗄️ Publicaciones Pendientes" 
                                value={stats?.articlesCount ?? 0}
                                onClick={() => navigate('/inventory')}
                            />
                            <SmallWidget 
                                title="✅ Trueques Completados" 
                                value={stats?.completedTradesCount ?? 0}
                                onClick={() => navigate('/trueques')}
                            />
                            <SmallWidget 
                                title="💬 Mensajes Totales" 
                                value={stats?.messagesCount ?? 0}
                                onClick={() => navigate('/messages')}
                            />
                            {/* Tarjeta Grande - Última actividad */}
                            <div className="widget large-card" onClick={() => navigate('/inventory')} style={{ cursor: 'pointer' }}>
                                <h3>📥 Actividad Reciente</h3>
                                <p>{stats?.lastArticleTitle ? `Último artículo: ${stats.lastArticleTitle}` : 'Sin artículos publicados aún'}</p>
                            </div>
                        </>
                    ) : (
                        <div className="widget">Cargando estadísticas...</div>
                    )}
                </section>
                
                {/* 2.3. Área de ProductGrid (Como lo teníamos) */}
                <ProductGrid selectedCategory={selectedCategory} />

            </main>
        </div>
    );
}

export default Dashboard;