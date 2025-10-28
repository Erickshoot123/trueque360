import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Registrando usuario:', { username, email, password });
    alert(`Usuario ${username} registrado con éxito.`);
    navigate('/login'); 
  };

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