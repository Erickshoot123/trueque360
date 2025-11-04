import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../login/login.css'; // Usando el mismo CSS

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); 

    try {
      const response = await fetch('http://localhost:3000/api/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      // 4. ¡ÉXITO!
      setMessage('¡Usuario registrado con éxito! Iniciando sesión...');

      // --- ¡NUEVO! Guardamos el Token (Auto-login) ---
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      // ----------------------------------------------

      // Redirigimos al dashboard, ¡no al login!
      setTimeout(() => {
        navigate('/dashboard'); 
      }, 2000);

    } catch (error) {
      setMessage(error.message);
    }
  };

  // --- Tu JSX (Exactamente como estaba) ---
  return (
    <>
      <Link to="/login" className="back-button">
        &larr; Volver
      </Link>
      
      <h2>Crear una cuenta</h2>
      <p className="login-intro-text">Únete a nuestra comunidad</p>

      <form className="login-form" onSubmit={handleSubmit}> 
        <div className="form-group">
          <label htmlFor="regUsername">Nombre de usuario:</label>
          <input
            type="text"
            id="regUsername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder=" Nombre de usuario"
          />
        </div>
        <div className="form-group">
          <label htmlFor="regEmail">Correo electrónico:</label>
          <input
            type="email"
            id="regEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Introduce tu correo"
          />
        </div>
        <div className="form-group">
          <label htmlFor="regPassword">Contraseña:</label>
          <input
            type="password"
            id="regPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña "
          />
        </div>
        
        <button type="submit" className="login-button">
          Registrarse
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
      <div className="register-prompt"> 
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </>
  );
}

export default Register;