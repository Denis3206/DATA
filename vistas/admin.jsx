import React from 'react';
import Navbar from '../componentes/navbar';

const AdminPanel = () => {
  return (
    <div>
      <Navbar />
      <h2>Panel de Administrador</h2>
      <p>Bienvenido al panel de administración. Aquí puedes gestionar usuarios y más.</p>
      {/* Aquí puedes agregar funcionalidades para agregar, modificar y eliminar usuarios */}
    </div>
  );
};

export default AdminPanel;