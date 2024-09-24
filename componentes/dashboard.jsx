import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../style/dashboard.css';

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {user.name}</h1>
        <nav>
          <NavLink to="/dashboard/training">Entrenamiento</NavLink>
          <NavLink to="/dashboard/tactics">Pizarra</NavLink>
          <NavLink to="/dashboard/team">Equipo</NavLink>
          <NavLink to="/dashboard/transfers">Fichajes</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
