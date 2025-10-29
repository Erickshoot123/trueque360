import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Tu CSS compartido

function Login() {
  // --- Estados (Tu código ya los tenía) ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // --- ¡NUEVO ESTADO! ---
  // Para mostrar mensajes de error (ej: "Credenciales incorrectas") o éxito
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); 

  // --- ¡FUNCIÓN handleSubmit ACTUALIZADA! ---
  // Reemplazamos el 'alert' por la lógica real de 'fetch'
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setMessage(''); // Limpiamos mensajes anteriores

    try {
      // 1. Llamamos a tu API de backend
      const response = await fetch('http://localhost:3000/api/login', { // Revisa que sea el puerto de tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      // 2. Obtenemos la respuesta
      const data = await response.json();

      // 3. Manejamos la respuesta
      if (!response.ok || data.success === false) {
        // Si el backend dice "Credenciales incorrectas" (error 401)
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      // 4. ¡ÉXITO!
      setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      
      // (En un futuro, aquí guardas el token JWT: localStorage.setItem('token', data.token);)
      
      // Redirigimos al dashboard
      setTimeout(() => {
        navigate('/dashboard'); // O a la ruta que quieras
      }, 1500);

    } catch (error) {
      // 5. Si hay un error (de red o del 'throw Error'), lo mostramos
      setMessage(error.message);
    }
  };

  // --- Tu JSX (SIN CAMBIOS, solo se agrega el mensaje) ---
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

        {/* --- ¡NUEVO! --- Mostramos el mensaje de error o éxito aquí */}
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
