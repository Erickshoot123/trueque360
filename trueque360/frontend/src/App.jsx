import React from 'react';
// 1. IMPORTAMOS TODO de react-router-dom
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// --- Importación de Layouts y Páginas ---
import AuthLayout from './components/AuthLayout/AuthLayout';
import Login from './components/Login/login'; 
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CreateArticle from './components/CreateArticle/CreateArticle';
import MessageTab from './components/MessageTab/MessageTab';
import TradesTab from './components/TradesTab/TradesTab';

// --- 2. IMPORTAMOS LA NUEVA PÁGINA DE DETALLES Y SU CSS ---
import ArticleDetail from './components/ArticleDetail/ArticleDetail';
import './components/ArticleDetail/ArticleDetail.css';
import EditArticle from './components/ArticleDetail/EditArticle';

// --- Importamos el CSS del formulario (que faltaba) ---
import './components/CreateArticle/CreateArticle.css';

// --- 3. DEFINIMOS EL 'PRIVATE ROUTE' ---
// Este componente revisa si el usuario tiene un token
// (Usamos sessionStorage como acordamos)
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  // Si hay token, muestra el componente (children). Si no, redirige a /login.
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          {/* --- Rutas Públicas (Login / Registro) --- */}
          <Route 
            path="/" 
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } 
          />
          <Route 
            path="/login" 
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } 
          />
          <Route 
            path="/registro" 
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            } 
          />
          
          {/* --- Rutas Privadas (Protegidas) --- */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/publicar" 
            element={
              <PrivateRoute>
                <CreateArticle />
              </PrivateRoute>
            } 
          />
          
          {/* --- Ruta de Mensajes --- */}
          <Route 
            path="/messages" 
            element={
              <PrivateRoute>
                <MessageTab />
              </PrivateRoute>
            } 
          />
          
          {/* --- Ruta de Trueques --- */}
          <Route 
            path="/trueques" 
            element={
              <PrivateRoute>
                <TradesTab />
              </PrivateRoute>
            } 
          />
          
          {/* --- 4. AÑADIMOS LA RUTA QUE FALTABA --- */}
          {/* Esta ruta es pública (para que cualquiera vea artículos) */}
          {/* pero si quieres que sea privada, envuélvela en <PrivateRoute> */}
          <Route 
            path="/articulo/:id" 
            element={<ArticleDetail />} 
          />
          {/* Ruta para editar un artículo */}
          <Route 
            path="/articulo/editar/:id"
            element={
              <PrivateRoute>
                <EditArticle />
              </PrivateRoute>
            }
          />

          {/* --- Ruta 404 (Wildcard) --- */}
          {/* Si no encuentra ninguna ruta, muestra esto */}
          <Route 
            path="*"
            element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Error 404 - Página no encontrada</h2>
                <p>La página que buscas no existe.</p>
                <Link to="/dashboard">Volver al inicio</Link>
              </div>
            }
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;