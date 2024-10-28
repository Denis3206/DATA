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
  const [miEquipo, setMiEquipo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const navigate = useNavigate();

 
 
  useEffect(() => {
    const fetchData = async()=>{
      
      const storedRole = localStorage.getItem('userRole');
      setRole(storedRole);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
  
      try{
        if (storedRole === '1') {
          // Si es administrador, solo cargamos jugadores favoritos desde la base de datos
          fetchFavoritos();
        } else if (storedRole === '2') {
          // Si es entrenador, cargamos jugadores desde la API y favoritos
          fetchJugadores();
        }
      }
      catch(error){
        console.error('Error al cargar los datos: ', error)
      }
     
    };
    fetchData();
  }, []);
  
  const fetchJugadores = async () => {
    try {
      await fetchMiEquipo(); // Primero traemos los jugadores de 'miequipo'
      const data = await getJugadores(); // Luego traemos los jugadores desde la API
  
      // Filtrar jugadores de la API que ya están en 'miequipo'
      console.log(data);
      const jugadoresFiltrados = data.filter(
        jugador => !miEquipo.some(miJugador => miJugador.toLowerCase() === jugador.player.name.toLowerCase())
      );
  console.log(jugadoresFiltrados);
      setJugadores(jugadoresFiltrados); // Guardamos solo los que no están en 'miequipo'
      await fetchFavoritos(); // Cargar los favoritos del entrenador
    } catch (error) {
      console.error('Error al cargar los jugadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMiEquipo = async () => {
    const { data, error } = await supabase.from('miequipo').select('name');
    if (error) {
      console.error('Error al cargar los jugadores del equipo:', error);
    } else {
      setMiEquipo(data.map(jugador => jugador.name)); // Almacenamos solo los IDs de los jugadores en miEquipo
      console.log(miequipo);
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
        age: jugador.player.age,
        appearances: jugador.statistics[0].games.appearances,
        goals: jugador.statistics[0].goals.total,
        assists: jugador.statistics[0].goals.assists,
        yellow_cards: jugador.statistics[0].cards.yellow,
        red_cards: jugador.statistics[0].cards.red,
        passes: jugador.statistics[0].passes.total,
        passesAccuracy: jugador.statistics[0].passes.accuracy,
        shots: jugador.statistics[0].shots.total,
        shotsOnTarget: jugador.statistics[0].shots.on,
        tackles: jugador.statistics[0].tackles.total,
        duelsWon: jugador.statistics[0].duels.won

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
            age: jugador.player.age,
            appearances: jugador.statistics[0].games.appearances,
            goals: jugador.statistics[0].goals.total,
            assists: jugador.statistics[0].goals.assists,
            yellow_cards: jugador.statistics[0].cards.yellow,
            red_cards: jugador.statistics[0].cards.red,
            passes: jugador.statistics[0].passes.total,
            passesAccuracy: jugador.statistics[0].passes.accuracy,
            shots: jugador.statistics[0].shots.total,
            shotsOnTarget: jugador.statistics[0].shots.on,
            tackles: jugador.statistics[0].tackles.total,
            duelsWon: jugador.statistics[0].duels.won
          },
        ]);
        await supabase.from('notificaciones').insert({
          event_type: 'player_recommended', // Tipo de evento
          mensaje: `El entrenador ${user.nombre} ha recomendado al jugador ${jugador.player.name} como favorito.`, // Mensaje personalizado
          id_users: user.id_users, // ID del administrador que recibirá la notificación
          created_at: new Date() // Hora de creación
        });
      }
    }
  };

  const manejarSugerencia = async (jugador, accion) => {
    // Verificar que el objeto jugador contenga los datos necesarios
    if (!jugador || !jugador.player_id || !jugador.name || !jugador.position) {
      console.error('Datos de jugador inválidos:', jugador);
      return;
    }
  
    if (accion === 'Aceptar') {
      try {
        // Agregar jugador a la tabla miequipo
        const { error: insertError } = await supabase.from('miequipo').insert({
          id_mijugador: jugador.player_id,
          name: jugador.name,
          position: jugador.position || 'N/A',
          age: jugador.age || 'N/A',
          appearances: jugador.appearances || 0,
          goals: jugador.goals || 0,
          assists: jugador.assists || 0,
          yellow_cards: jugador.yellow_cards || 0,
          red_cards: jugador.red_cards || 0,
          passes: jugador.passes || 0,
          passesAccuracy: jugador.passesAccuracy || 0,
          shots: jugador.shots || 0,
          shotsOnTarget: jugador.shotsOnTarget || 0,
          tackles: jugador.tackles || 0,
          duelsWon: jugador.duelsWon || 0,
          photo: jugador.photo,
          team: 'Argentinos Juniors', // Siempre será 'Argentinos Juniors'
        });
  
        if (insertError) {
          console.error('Error al agregar jugador a miequipo:', insertError);
          return;
        }
  
        // Eliminar jugador de la tabla favoritos_jugadores
        const { error: deleteError } = await supabase
          .from('favoritos_jugadores')
          .delete()
          .eq('player_id', jugador.player_id);
  
        if (deleteError) {
          console.error('Error al eliminar jugador de favoritos:', deleteError);
        } else {
          // Actualizar el estado de los favoritos para que el jugador no se muestre más
          setFavoritos(favoritos.filter((fav) => fav.name !== jugador.name));


          await supabase.from('notificaciones').insert({
            event_type: 'player_accepted', // Tipo de evento
            mensaje: `El administrador ha aceptado al jugador ${jugador.name}.`, // Mensaje personalizado
            id_users: null, // ID del entrenador que recibirá la notificación
            created_at: new Date() // Hora de creación
          });
        }
      } catch (error) {
        console.error('Error al manejar sugerencia:', error);
      }
    } else if (accion === 'Rechazar') {
      try {
        // Eliminar jugador de la tabla favoritos_jugadores
        const { error } = await supabase
          .from('favoritos_jugadores')
          .delete()
          .eq('player_id', jugador.player_id);
  
        if (error) {
          console.error('Error al eliminar jugador de favoritos:', error);
        } else {
          // Actualizar el estado de los favoritos para que el jugador no se muestre más
          setFavoritos(favoritos.filter((fav) => fav.player_id !== jugador.player_id));
          await supabase.from('notificaciones').insert({
            event_type: 'player_rejected', // Tipo de evento
            mensaje: `El administrador ha rechazado al jugador ${jugador.name}.`, // Mensaje personalizado
            id_users: entrenadorId, // ID del entrenador que recibirá la notificación
            created_at: new Date() // Hora de creación
          });
        }
      } catch (error) {
        console.error('Error al manejar sugerencia:', error);
      }
    }
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


/*   const fetchJugadores = async () => {
    try {
      // Traer jugadores desde la API
      const data = await getJugadores();
      const { data: jugadoresMiequipo, error } = await supabase
        .from('miequipo')
        .select('id_mijugador'); // Obtener solo los IDs de los jugadores ya aceptados
  
      if (error) {
        console.error('Error al cargar jugadores de miequipo:', error);
        return;
      }
  
      // Filtrar los jugadores que ya han sido aceptados en miequipo
      const jugadoresFiltrados = data.filter(
        (jugador) => !jugadoresMiequipo.some((mijugador) => mijugador.player_id === jugador.player.id)
      );
  
      setJugadores(jugadoresFiltrados); // Guardar los jugadores no aceptados en el estado
      await fetchFavoritos(); // Cargar los favoritos del entrenador
    } catch (error) {
      console.error('Error al cargar los jugadores:', error);
    } finally {
      setLoading(false);
    }
  }; */
