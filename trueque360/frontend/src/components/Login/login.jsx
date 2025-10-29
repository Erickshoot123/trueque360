import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Asumiendo que tu css se llama 'login.css' en minúscula

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault(); 
    console.log('Enviando datos:', { username, password });
    alert(`Iniciando sesión como: ${username}`);
    navigate('/dashboard'); 
  };

  return (
    <> 
      <h2>¡Le damos la bienvenida!</h2>
      <p className="login-intro-text">Inicie sesión en su cuenta</p>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario :</label> 
          <input
            /* --- ¡AQUÍ ESTÁ LA CORRECCIÓN! --- */
            type="text" /* Debe ser "text" o "email", no "username" */
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