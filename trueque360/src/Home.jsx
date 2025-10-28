import React from 'react';
import './Home.css'; 

function Home({ onGoToLogin }) {
  return (
    <div className="home-container">
      <h1>¡Bienvenido a Mi Aplicación!</h1>
      <p>Esta es la página de inicio. El login está oculto.</p>
      
     
      <button onClick={onGoToLogin} className="go-login-btn">
        Ir a Iniciar Sesión
      </button>
    </div>
  );
}

export default Home;