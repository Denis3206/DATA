import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/navbar.css'; // Ruta al archivo CSS

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
    <div className="navbar-logo">
    <img src="../img/LOGO.png" alt="Logo" className="logo-image" />
    </div>
    <div className="navbar-user-info">
    {user ? <p>Hola {user.name}</p> : <p>Cargando usuario...</p>}
    </div>
    <div className="navbar-actions">
      <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
    </div>
  </nav>
  );
};

export default Navbar;