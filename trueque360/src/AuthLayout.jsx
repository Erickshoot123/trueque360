import React from 'react';
import './AuthLayout.css'; 

function AuthLayout({ children }) {
  return (
    <div className="auth-layout-container">
      <div className="auth-layout-left">
        {/* Aquí puedes poner un placeholder para la imagen si quieres */}
        {/* <img src="https://via.placeholder.com/400x300?text=Placeholder+Image" alt="Placeholder" className="auth-branding-logo" /> */}
        <h2>TRUEQUE360</h2>
        <p>
          Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      <div className="auth-layout-right">
        {children} 
      </div>
    </div>
  );
}

export default AuthLayout;