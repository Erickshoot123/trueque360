import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './AuthLayout'; 
import Login from './login';
import Register from './Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              <AuthLayout> 
                <Login />
              </AuthLayout>
            } 
          />

          
          <Route 
            path="/registro" 
            element={
              <AuthLayout> 
                <Register />
              </AuthLayout>
            } 
          />

         
          <Route 
            path="/" 
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } 
          />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;