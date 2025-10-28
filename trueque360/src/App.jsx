import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './AuthLayout'; 
import Login from './login';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
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

          {/* --- Rutas de la Aplicación (Protegidas) ---
            NO usan el AuthLayout. Es una página completa.
          */}
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          
          {/* Aquí podrías agregar más rutas como /perfil, /configuracion, etc. */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;