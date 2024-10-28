import React, { useEffect, useState } from 'react';
import { supabase } from '../componentes/config/client'; // Ajusta la ruta según tu estructura de archivos
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import '../style/notificacion.css'

const Notificaciones = () => {
const [notificaciones, setNotificaciones] = useState([]);
const [role, setRole] = useState(localStorage.getItem('userRole')); // Obtén role de localStorage directamente
const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); 
const navigate = useNavigate();

useEffect(() => {
  const fetchNotificaciones = async () => {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar notificaciones:', error);
    } else {
      // Filtrar las notificaciones según el rol y usuario
      const filteredNotifications = data.filter((notificacion) => {
        if (role == 1) {
          // Administrador: ve todas
          return true;
        } else if (role == 2) {
          // Entrenador: ve notificaciones relacionadas con sus jugadores o rutinas
          return notificacion.event_type === 'routine_completed' || notificacion.event_type === 'player_recommended';
        } else if (role == 3) {
          // Jugador: ve solo las notificaciones que le corresponden a él
          return (
            notificacion.id_users === user?.id_users && // Asegúrate de que la notificación sea para el jugador actual
            (notificacion.event_type === 'training_assigned' || notificacion.event_type === 'personal_change') // Tipos específicos para jugadores
          );
        }
        return false;
      });

      setNotificaciones(filteredNotifications);
    }
  };

  if (role && user) {
    fetchNotificaciones();
  }
}, [role, user]); // Dependencias correctas: role y user


return (
    <div>
    <Navbar user={user} />
    <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Regresar al Dashboard
      </button>

  <div className="notifications-container">
    <h2>Notificaciones</h2>
    {notificaciones.length === 0 ? (
      <p>No hay notificaciones disponibles.</p>
    ) : (
      <ul>
        {notificaciones.map((notificacion) => (
          <li key={notificacion.id}>
            <strong>{notificacion.event_type}</strong>: {notificacion.mensaje} <br />
            <small>{new Date(notificacion.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    )}
  </div>
  </div>
);
};
export default Notificaciones;