import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Importamos Link y useNavigate
import './Login.css'; // Usaremos el CSS existente o lo ajustaremos

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para la navegación programática

  const handleSubmit = (event) => {
    event.preventDefault(); 
    console.log('Enviando datos:', { username, password });
    alert(`Iniciando sesión como: ${username}`);
    
    // --- ¡CAMBIO AÑADIDO AQUÍ! ---
    // Esto te redirigirá a la página /dashboard después del alert.
    navigate('/dashboard'); 
    // ---------------------------
  };

  return (
    
    <> 
  

      <h2>¡Le damos la bienvenida!</h2>
      <p className="login-intro-text">Inicie sesión en su cuenta</p>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario :</label> 
          <input
            type="text" 
            id="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder=" Nombre de usuario "
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder=" Contraseña"
          />
        </div>
{/*
        <div className="forgot-password-link">
          <Link to="/restablecer-contrasena">Configurar o restablecer la contraseña</Link>
        </div>
*/ }
        
        
        <button type="submit" className="login-button">
          Iniciar sesión
        </button>
        
      </form>
      
      <div className="register-prompt">
        <p>
          ¿No tiene cuenta? <Link to="/registro">Crear una</Link> 
        </p>
      </div>
    </>
  );
}

export default Login;