import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../login/login.css'; // Usando el mismo CSS (¡RUTA CORREGIDA!)

function Register() {
  // --- Estados (Tu código ya los tenía) ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- ¡NUEVO ESTADO! ---
  // Para mostrar mensajes de error (ej: "Usuario ya existe") o éxito
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // --- ¡FUNCIÓN handleSubmit ACTUALIZADA! ---
  // Reemplazamos el 'alert' por la lógica real de 'fetch'
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Limpiamos mensajes anteriores

    try {
      // 1. Llamamos a tu API de registro
      const response = await fetch('http://localhost:3000/api/register', { // Revisa el puerto
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

      // 2. Obtenemos la respuesta
      const data = await response.json();

      // 3. Manejamos la respuesta
      if (!response.ok) {
        // Si el backend dice "El email o nombre de usuario ya está en uso" (error 400)
        throw new Error(data.message || 'Error al registrarse');
      }

      // 4. ¡ÉXITO!
      setMessage('¡Usuario registrado con éxito! Redirigiendo al login...');

      // Redirigimos al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      // 5. Si hay un error, lo mostramos
      setMessage(error.message);
    }
  };

  // --- Tu JSX (SIN CAMBIOS, solo se agrega el mensaje) ---
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

        {/* --- ¡NUEVO! --- Mostramos el mensaje de error o éxito aquí */}
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
