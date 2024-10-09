import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './config/client';
import '../style/navbar.css'; // Ruta al archivo CSS

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Inserta una notificación en la tabla de notificaciones
      const user = JSON.parse(localStorage.getItem('user')); // Obtiene el usuario actual desde localStorage
      await supabase.from('notificaciones').insert({
        event_type: 'logout',
        mensaje: `El usuario ${user.nombre} ha cerrado sesión.`,
        id_users: user.id_users,
        created_at: new Date(),
      });

      // Aquí, suponiendo que estés utilizando una función para cerrar sesión en Supabase
      await supabase.auth.signOut();
      localStorage.removeItem('user'); // Limpia el localStorage
      localStorage.removeItem('userRole');

      // Redirige al inicio de sesión o a donde prefieras
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  return (
    <nav className="navbar">
    <div className="navbar-logo">
    <img src="../img/LOGO.png" alt="Logo" className="logo-image" />
    </div>
    <div className="navbar-user-info">
    {user ? <p>Hola {user.nombre}</p> : <p>Cargando usuario...</p>}
    </div>
    <div className="navbar-actions">
      <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
    </div>
  </nav>
  );
};

export default Navbar;