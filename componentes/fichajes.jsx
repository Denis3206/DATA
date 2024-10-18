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
    setUser(storedUser);

    if (storedRole === '1') {
      // Si es administrador, solo cargamos jugadores favoritos desde la base de datos
      fetchFavoritos();
    } else if (storedRole === '2') {
      // Si es entrenador, cargamos jugadores desde la API y favoritos
      fetchJugadores();
    }
  }, []);

  const fetchJugadores = async () => {
    try {
      const data = await getJugadores(); // Traer jugadores desde la API
      setJugadores(data); // Guardamos jugadores en el estado
      await fetchFavoritos(); // Cargar los favoritos del entrenador
    } catch (error) {
      console.error('Error al cargar los jugadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoritos = async () => {
    // Consulta jugadores favoritos desde la tabla favoritos_jugadores
    const { data, error } = await supabase.from('favoritos_jugadores').select('*');
    if (error) {
      console.error('Error al cargar los favoritos:', error);
    } else {
      setFavoritos(data); // Guardar favoritos en el estado
    }
    setLoading(false);
  };

  const manejarFavorito = async (jugador) => {
    const isFavorito = favoritos.some((fav) => fav.player_id === jugador.player.id);

    if (isFavorito) {
      // Si ya está en favoritos, eliminarlo
      const { error } = await supabase
        .from('favoritos_jugadores')
        .delete()
        .eq('player_id', jugador.player.id);

      if (!error) {
        setFavoritos(favoritos.filter((fav) => fav.player_id !== jugador.player.id));
      }
    } else {
      // Agregar jugador a favoritos
      const { error } = await supabase.from('favoritos_jugadores').insert({
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
      }
    }
  };

  const manejarSugerencia = (jugador, accion) => {
    console.log(`${accion} sugerencia para el jugador:`, jugador);
    // Aquí se puede implementar la lógica para aceptar o rechazar las sugerencias
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

      <h2>Lista de Jugadores</h2>
      <table className="fichajes-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Posición</th>
            <th>Nacionalidad</th>
            <th>Equipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {role == 1 ? (
            // Si el usuario es administrador, mostrar jugadores favoritos
            favoritos.length > 0 ? (
              favoritos.map((jugador) => (
                <tr key={jugador.player_id}>
                  <td>
                    <img
                      src={jugador.photo}
                      alt={jugador.name}
                      style={{ width: '50px', height: '50px' }}
                    />
                  </td>
                  <td>{jugador.name}</td>
                  <td>{jugador.position}</td>
                  <td>{jugador.nationality}</td>
                  <td>{jugador.team}</td>
                  <td>
                    <button onClick={() => manejarSugerencia(jugador, 'Aceptar')}>Aceptar</button>
                    <button onClick={() => manejarSugerencia(jugador, 'Rechazar')}>Rechazar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay jugadores favoritos asignados.</td>
              </tr>
            )
          ) : (
            // Si es entrenador, mostrar jugadores de la API
            jugadores.map((jugador) => (
              <tr key={jugador.player.id}>
                <td>
                  <img
                    src={jugador.player.photo}
                    alt={jugador.player.name}
                    style={{ width: '50px', height: '50px' }}
                  />
                </td>
                <td>{jugador.player.name}</td>
                <td>{jugador.statistics[0].games.position}</td>
                <td>{jugador.player.nationality}</td>
                <td>{jugador.statistics[0].team.name}</td>
                <td>
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transfers;