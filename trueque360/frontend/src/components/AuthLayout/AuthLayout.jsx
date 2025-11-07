import React from 'react';
import './AuthLayout.css'; 

function AuthLayout({ children }) {
  return (
    <div className="auth-layout-container">
      <div className="auth-layout-left">
      
        <h2>✨ TRUEQUE360</h2>
        <p>
         Intercambia, renueva, evoluciona.
        Tu próximo gran hallazgo te espera.
        </p>
        <p>
        En Trueque360, creemos en el poder de la comunidad y la sostenibilidad. Ofrece esos artículos que ya no tienen lugar en tu vida 
        y descubre las oportunidades que otros tienen para ti. 
        Olvídate de las transacciones tradicionales y únete a un ciclo de consumo más consciente y humano.
        Registrate en un minuto y comienza a intercambiar hoy mismo.
        </p>
        
      </div>

      <div className="auth-layout-right">
        {children} 
      </div>
    </div>
  );
}

export default AuthLayout;




