import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Tu CSS compartido

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      // 4. ¡ÉXITO!
      setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      
      // --- ¡NUEVO! Guardamos el Token y el ID del usuario ---
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      // --------------------------------------------------
      
      setTimeout(() => {
        navigate('/dashboard'); 
      }, 1500);

    } catch (error) {
      setMessage(error.message);
    }
  };

  // --- Tu JSX (Exactamente como estaba) ---
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
        
        <button type="submit" className="login-button">
          Iniciar sesión
        </button>

        {message && <p className="form-message">{message}</p>}

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
