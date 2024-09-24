import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../style/dashboard.css';

const Dashboard = ({ user }) => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setScrollDirection('down'); // Ocultar navbar
      } else {
        setScrollDirection('up'); // Mostrar navbar
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="dashboard">
      <header style={{ top: scrollDirection === 'down' ? '-110px' : '0px' }}>
      <div className="menu-icon" onClick={toggleSidebar}>
          ☰
        </div>
        <div className="logo-container">
          <img src="../img/LOGO.png" alt="Logo" className="logo" />
        </div>
      <h1>Bienvenido, {user.name}</h1>
        
        </header>

        <aside className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <nav>
          <NavLink to="/dashboard/training" onClick={toggleSidebar}>Entrenamiento</NavLink>
          <NavLink to="/dashboard/tactics" onClick={toggleSidebar}>Pizarra</NavLink>
          <NavLink to="/dashboard/team" onClick={toggleSidebar}>Equipo</NavLink>
          <NavLink to="/dashboard/transfers" onClick={toggleSidebar}>Fichajes</NavLink>
        </nav>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
