import React, { useEffect, useState } from 'react';
import { supabase } from './config/client';
import { getTeamStats,getTeamPlayers } from '../src/services/apifootball';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { FaArrowLeft } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '../style/graficos.module.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Graficos = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamStats, setShowTeamStats] = useState(true); // Estado para controlar qué estadísticas mostrar
  const navigate = useNavigate();

  const fetchPlayersFromDatabase = async () => {
    try {
      const { data: players, error } = await supabase
        .from('miequipo')
        .select('*'); // Trae todas las columnas de la tabla 'players'

      if (error) {
        throw error;
      }
      setPlayers(players);
      console.log('Jugadores obtenidos de la base de datos:', players);
    } catch (error) {
      console.error('Error al obtener jugadores de la base de datos:', error);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const fetchData = async () => {
      const stats = await getTeamStats();
      setTeamStats(stats);
      await fetchPlayersFromDatabase(); // Llama a la función para obtener jugadores desde la base de datos
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (!teamStats || players.length === 0) {
    return <div>No se pudieron cargar las estadísticas o los jugadores.</div>;
  }

  // Datos para los gráficos de estadísticas del equipo
  const fixtureData = {
    labels: ['Home', 'Away', 'Total'],
    datasets: [
      {
        label: 'Partidos Jugados',
        data: [
          teamStats.fixtures.played.home,
          teamStats.fixtures.played.away,
          teamStats.fixtures.played.total,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Partidos Ganados',
        data: [
          teamStats.fixtures.wins.home,
          teamStats.fixtures.wins.away,
          teamStats.fixtures.wins.total,
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Partidos Perdidos',
        data: [
          teamStats.fixtures.loses.home,
          teamStats.fixtures.loses.away,
          teamStats.fixtures.loses.total,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const goalsForData = {
    labels: ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '91-105', '106-120'],
    datasets: [
      {
        label: 'Goles a Favor',
        data: [
          teamStats.goals.for.minute['0-15'].total,
          teamStats.goals.for.minute['16-30'].total,
          teamStats.goals.for.minute['31-45'].total,
          teamStats.goals.for.minute['46-60'].total,
          teamStats.goals.for.minute['61-75'].total,
          teamStats.goals.for.minute['76-90'].total,
          teamStats.goals.for.minute['91-105'].total,
          teamStats.goals.for.minute['106-120'].total,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const goalsAgainstData = {
    labels: ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '91-105', '106-120'],
    datasets: [
      {
        label: 'Goles en Contra',
        data: [
          teamStats.goals.against.minute['0-15'].total,
          teamStats.goals.against.minute['16-30'].total,
          teamStats.goals.against.minute['31-45'].total,
          teamStats.goals.against.minute['46-60'].total,
          teamStats.goals.against.minute['61-75'].total,
          teamStats.goals.against.minute['76-90'].total,
          teamStats.goals.against.minute['91-105'].total,
          teamStats.goals.against.minute['106-120'].total,
        ],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <div className={styles.container}>
      <Navbar user={user} />
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Regresar al Dashboard
      </button>
      <h2 className={styles.title}>Estadísticas de Argentinos Juniors</h2>

      {/* Mostrar el escudo del equipo */}
      <div className={styles.logoContainer}>
        <img src={teamStats.team.logo} alt="Escudo de Argentinos Juniors" className={styles.logo} />
      </div>

      {/* Botones para alternar entre las estadísticas del equipo y estadísticas individuales */}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => setShowTeamStats(true)}>
          {showTeamStats ? 'Estadísticas Equipo en General' : 'Mostrar Estadísticas del Equipo'}
        </button>
        <button className={styles.button} onClick={() => setShowTeamStats(false)}>
          {showTeamStats ? 'Mostrar Estadísticas Individuales' : 'Estadísticas Individuales'}
        </button>
      </div>

      {/* Condicional para mostrar las estadísticas */}
      {showTeamStats ? (
        <div className={styles.chartContainer}>
          <h3>Partidos Jugados</h3>
          <Bar className={styles.chart} data={fixtureData} />

          <h3>Goles a Favor por Minuto</h3>
          <Bar className={styles.chart} data={goalsForData} />

          <h3>Goles en Contra por Minuto</h3>
          <Bar className={styles.chart} data={goalsAgainstData} />
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <h3>Jugadores de Argentinos Juniors</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Posición</th>
                <th>Edad</th>
                <th>Partidos Jugados</th>
                <th>Goles</th>
                <th>Asistencias</th>
                <th>Tarjetas Amarillas</th>
                <th>Tarjetas Rojas</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id_mijugador}>
                  <td>{player.name}</td>
                  <td>{player.position}</td>
                  <td>{player.age}</td>
                  <td>{player.appearances}</td>
                  <td>{player.goals}</td>
                  <td>{player.assists}</td>
                  <td>{player.yellow_cards}</td>
                  <td>{player.red_cards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Graficos;