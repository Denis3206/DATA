import React, { useEffect, useState } from 'react';
import { getJugadores } from '../src/services/apifootball'; // Importamos la función getJugadores
import Navbar from './navbar';
import { supabase } from './config/client';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../style/fichajes.css';

const Transfers = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const navigate = useNavigate();

  

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
    const storedUser = JSON.parse(localStorage.getItem('user'));
     console.log('Usuario almacenado:', storedUser);
    setUser(storedUser);
    const fetchJugadores = async () => {
      try {
        const data = await getJugadores(); // Llamamos a la función que ya maneja el API
        setJugadores(data); // Guardamos los jugadores en el estado
        await fetchFavoritos();
      } catch (error) {
        console.error('Error al cargar los jugadores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJugadores();
  }, []);
  

  const fetchFavoritos = async () => {
    // Consulta los jugadores favoritos desde la base de datos
    const { data, error } = await supabase.from('favoritos_jugadores').select('*');

    if (error) {
      console.error('Error al cargar los favoritos:', error);
    } else {
      setFavoritos(data); // Guardar los favoritos en el estado
    }
  };

  const manejarFavorito = async (jugador) => {
    const isFavorito = favoritos.some((fav) => fav.player_id === jugador.player.id);
  
    if (isFavorito) {
      // Si ya está en favoritos, eliminarlo de la base de datos
      const { error } = await supabase
        .from('favoritos_jugadores')
        .delete()
        .eq('player_id', jugador.player.id);
        await supabase.from('notificaciones').insert({
          event_type: 'favorito',
          mensaje: `El entrenador ${user.nombre} ha eliminado a ${jugador.player.name} de favoritos.`,
          id_users: user.id_users,
          created_at: new Date(),
        });
  
      if (!error) {
        setFavoritos(favoritos.filter((fav) => fav.player_id !== jugador.player.id));
      }
    } else {
      // Si no está en favoritos, agregarlo a la base de datos
      const { error } = await supabase
        .from('favoritos_jugadores')
        .insert({
          player_id: jugador.player.id,
          name: jugador.player.name,
          team: jugador.statistics[0].team.name,
          nationality: jugador.player.nationality,
          photo: jugador.player.photo,
          position: jugador.statistics[0].games.position,
        });
  
      if (!error) {
        setFavoritos([
          ...favoritos,
          {
            player_id: jugador.player.id,
            name: jugador.player.name,
            team: jugador.statistics[0].team.name,
            nationality: jugador.player.nationality,
            photo: jugador.player.photo,
            position: jugador.statistics[0].games.position,
          },
        ]);
  
        await supabase.from('notificaciones').insert({
          event_type: 'favorito',
          mensaje: `El entrenador ${user.nombre} ha agregado a ${jugador.player.name} a favoritos.`,
          id_users: user.id_users, // Ajusta según tu implementación
          created_at: new Date(),
        });
      }
    }
  };
  

  // Función para aceptar/rechazar sugerencia (solo para administradores)
  const manejarSugerencia = (jugador, accion) => {
    console.log(`${accion} sugerencia para el jugador:`, jugador);
    // Lógica adicional para manejar la sugerencia según la acción
  };

  if (loading) {
    return <p>Cargando jugadores...</p>;
  }

  return (
    <div>
      <Navbar user={user} />

      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Regresar al Dashboard
      </button>


      <button onClick={() => setMostrarSugerencias(!mostrarSugerencias)}>
        {mostrarSugerencias ? 'Ocultar Sugerencias' : 'Mostrar Sugerencias'}
      </button>
      <h2>Lista de Jugadores</h2>
      <table className="fichajes-table">
        {/* Aplicar clase para la tabla */}
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Posición</th>
            <th>Nacionalidad</th>
            <th>Equipo</th>
            <th>Favoritos</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.map((jugador) => (
            <tr key={jugador.player.id}>
              <td>
                <img
                  src={jugador.player.photo}
                  alt={jugador.player.name}
                  style={{ width: '50px', height: '50px' }} // Estilo inline para la imagen del jugador
                />
              </td>
              <td>{jugador.player.name}</td>
              <td>{jugador.statistics[0].games.position}</td>
              <td>{jugador.player.nationality}</td>
              <td>{jugador.statistics[0].team.name}</td>
              <td>
                {/* Estrella para marcar como favorito */}
                {role == 2 ? (
                  <span
                    style={{
                      cursor: 'pointer',
                      color: favoritos.some((fav) => fav.player_id === jugador.player.id)
                        ? 'gold'
                        : 'gray',
                    }}
                    onClick={() => manejarFavorito(jugador)}
                  >
                    ★
                  </span>
                ) : (
                  favoritos.some((fav) => fav.player_id === jugador.player.id) && (
                    <>
                      <button onClick={() => manejarSugerencia(jugador, 'Aceptar')}>Aceptar</button>
                      <button onClick={() => manejarSugerencia(jugador, 'Rechazar')}>Rechazar</button>
                    </>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sección de sugerencias (jugadores marcados como favoritos) */}
      {mostrarSugerencias && (
        <div className="modal-sugerencias">
          <div className="modal-content">
            <h3>Sugerencias</h3>
            <button className="close-modal" onClick={() => setMostrarSugerencias(false)}>
              <FaArrowLeft /> {/* Icono de retroceso */}
            </button>
            <ul>
              {favoritos.length > 0 ? (
                favoritos.map((jugador) => (
                  <li key={jugador.player_id}>
                    {jugador.name} - {jugador.team}
                  </li>
                ))
              ) : (
                <p>No hay sugerencias.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;