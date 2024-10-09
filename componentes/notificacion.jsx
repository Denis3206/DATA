import React, { useEffect, useState } from 'react';
import { supabase } from '../componentes/config/client'; // Ajusta la ruta según tu estructura de archivos
import Navbar from './navbar';
import '../style/notificacion.css'

const Notificaciones = () => {
const [notificaciones, setNotificaciones] = useState([]);
const [role, setRole] = useState(null);
const [user, setUser] = useState(null);


useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedRole) setRole(storedRole);
    if (storedUser) setUser(storedUser);
  const fetchNotificaciones = async () => {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .order('created_at', { ascending: false }); // Ordenar por fecha, más recientes primero

    if (error) {
      console.error('Error al cargar notificaciones:', error);
    } else {
      setNotificaciones(data);
    }
  };

  fetchNotificaciones();
}, []);

return (
    <div>
    <Navbar user={user} />
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