import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/*
 * --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
 * Las rutas de importación DEBEN apuntar a la carpeta /components/
*/
import AuthLayout from './components/AuthLayout/AuthLayout';
import Login from './components/Login/login'; // Pongo 'login' en minúscula porque así está tu archivo
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';

// import './App.css'; 

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
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;