import React from 'react';
import { useState, useEffect} from 'react';
import '../style/dashboard.css';
import { useNavigate} from 'react-router-dom';
import Navbar from './navbar';
import { FaChartBar, FaUserFriends, FaRegBell, FaClipboardList, FaClipboard } from 'react-icons/fa'; // Importa iconos
import { GiSoccerBall } from 'react-icons/gi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedRole) setRole(storedRole);
    if (storedUser) setUser(storedUser);

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  const renderAdminOptions = () => (
    <div>
      <h2>Dashboard de Administrador</h2>
      <hr />
      <div className="card-container">
        <div className="card" onClick={() => navigate('/fichajes')} role="button" aria-label="Fichajes">
          <FaClipboardList size={40} />
          <h3>Fichajes</h3>
          <p>Gestiona los fichajes de los jugadores.</p>
        </div>
        <div className="card" onCnpm install react-iconslick={() => navigate('/notificaciones')} role="button" aria-label="Notificaciones">
          <FaRegBell size={40} />
          <h3>Notificaciones</h3>
          <p>Revisa las notificaciones importantes.</p>
        </div>
        <div className="card" onClick={() => navigate('/usuarios')} role="button" aria-label="Usuarios">
          <FaUserFriends size={40} />
          <h3>Usuarios</h3>
          <p>Administra los usuarios del sistema.</p>
        </div>
        <div className="card" onClick={() => navigate('/graficos')} role="button" aria-label="Gráficos">
          <FaChartBar size={40} />
          <h3>Gráficos</h3>
          <p>Visualiza estadísticas y datos.</p>
        </div>
      </div>
    </div>
  );

  const renderClientOptions = () => (
    <div>
      <h2>Dashboard de Entrenador</h2>
      <hr />
      <div className="card-container">
        <div className="card" onClick={() => navigate('/entrenamiento')} role="button" aria-label="Entrenamiento">
          <FaClipboard size={40} />
          <h3>Entrenamiento</h3>
          <p>Accede a las sesiones de entrenamiento.</p>
        </div>
        <div className="card" onClick={() => navigate('/tacticalboard')} role="button" aria-label="Pizarra">
          <GiSoccerBall size={40} />
          <h3>Pizarra</h3>
          <p>Consulta la pizarra de tácticas.</p>
        </div>
        <div className="card" onClick={() => navigate('/equipos')} role="button" aria-label="Equipos">
          <FaUserFriends size={40} />
          <h3>Equipos</h3>
          <p>Gestiona la información de los equipos.</p>
        </div>
        <div className="card" onClick={() => navigate('/fichajes')} role="button" aria-label="Fichajes">
          <FaClipboardList size={40} />
          <h3>Fichajes</h3>
          <p>Revisa las opciones de fichajes.</p>
        </div>
        <div className="card" onClick={() => navigate('/notificaciones')} role="button" aria-label="Notificaciones">
          <FaRegBell size={40} />
          <h3>Notificaciones</h3>
          <p>Revisa las notificaciones importantes.</p>
        </div>
      </div>
    </div>
  );

  const renderUserOptions = () => (
    <div>
      <h2>Dashboard de Jugador</h2>
      <hr />
      <div className="card-container">
        <div className="card" onClick={() => navigate('/equipos')} role="button" aria-label="Equipos">
          <FaUserFriends size={40} />
          <h3>Equipos</h3>
          <p>Consulta la información de los equipos.</p>
        </div>
        <div className="card" onClick={() => navigate('/estado-entrenamientos')} role="button" aria-label="Estado Entrenamientos">
          <FaClipboard size={40} />
          <h3>Estado Entrenamientos</h3>
          <p>Revisa el estado de los entrenamientos.</p>
        </div>
        <div className="card" onClick={() => navigate('/notificaciones')} role="button" aria-label="Notificaciones">
          <FaRegBell size={40} />
          <h3>Notificaciones</h3>
          <p>Revisa las notificaciones importantes.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar user={user} />
      {role == 1 && renderAdminOptions()}
      {role == 2 && renderClientOptions()}
      {role == 3 && renderUserOptions()}
    </div>
  );
};

export default Dashboard;