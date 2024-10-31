import React, { useState, useEffect } from 'react'; 
import Formation from './formation.jsx';
import Navbar from './navbar.jsx';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from './config/client.js';
import '../style/tacticalboard.css'

const Tactics = () => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam2Name, setSelectedTeam2Name] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [substitutesTeam1, setSubstitutesTeam1] = useState([]);
  const [formationTeam1, setFormationTeam1] = useState("4-5-1");
  const [formationTeam2, setFormationTeam2] = useState("4-4-2");

  const [mainPlayersTeam1, setMainPlayersTeam1] = useState(Array(11).fill(null));
  const [mainPlayersTeam2, setMainPlayersTeam2] = useState(Array(11).fill(null));
  
  const [substitutesTeam2, setSubstitutesTeam2] = useState([]);
  const navigate = useNavigate();
  
  const [matchResult, setMatchResult] = useState(null);
  const [matchStats, setMatchStats] = useState(null); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  // Obtener equipos de la liga argentina para el equipo 2
  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch('https://v3.football.api-sports.io/teams?league=128&season=2022', {
        headers: {
          'x-apisports-key': '86380dbde2e27a014833a567ef568590',  // Coloca aquí tu API key
        },
      });
      const data = await response.json();
      setTeams(data.response.map(team => ({ id: team.team.id, name: team.team.name })));
    };

    fetchTeams();
  }, []);

  // Obtener jugadores de la tabla 'miequipo' de Supabase para el equipo 1
  const fetchPlayersFromSupabase = async () => {
    const { data, error } = await supabase
        .from('miequipo')
        .select('*'); 

    if (error) {
        console.error('Error fetching players from Supabase:', error);
        return [];
    }
    return data.map(player => ({
        id: player.id_mijugador, 
        name: player.name,
        position: player.position,
        photo: player.photo, 
        team: player.team,
        appearances: player.appearances, // Estadísticas del jugador
        goals: player.goals ,
        assists: player.assists ,
        yellowCards: player.yellow_cards,
        redCards: player.red_cards,
        passes: player.passes,
        passesAccuracy: player.passesAccuracy,
        shots: player.shots,
        shotsOnTarget: player.shotsOnTarget,
        tackles: player.tackles,
        duelsWon: player.duelsWon,
    }));
  };

  useEffect(() => {
    // Cargar los jugadores del equipo 1 al montar el componente
    const loadTeam1Players = async () => {
      const playersFromSupabase = await fetchPlayersFromSupabase();
      setSubstitutesTeam1(playersFromSupabase);
    };

    loadTeam1Players();
  }, []);

  // Manejar selección de equipo para el equipo 2
  const handleTeam2Selection = async (e) => {
    const teamId = e.target.value;
    setSelectedTeam2(teamId);
    
    // Llama a la API para obtener el nombre del equipo seleccionado y guárdalo en selectedTeam2Name
    if (teamId) {
      const response = await fetch(`https://v3.football.api-sports.io/teams?id=${teamId}`, {
        headers: {
          'x-apisports-key': '86380dbde2e27a014833a567ef568590',
        },
      });
      const data = await response.json();
      const teamName = data.response[0]?.team?.name || 'Equipo desconocido';
      setSelectedTeam2Name(teamName); // Actualiza el nombre del equipo 2
      fetchPlayersForTeam(teamId, setSubstitutesTeam2); // Usar la función para obtener jugadores del equipo 2
    }
  };

// Obtener jugadores para el equipo 2 y filtrar por nombre
const fetchPlayersForTeam = async (teamId, setSubstitutes) => {
  if (!teamId) return;

  try {
    const playersFromSupabase = await fetchPlayersFromSupabase();
    const playerNamesFromSupabase = playersFromSupabase.map(player => player.name);

    const response = await fetch(`https://v3.football.api-sports.io/players?team=${teamId}&season=2022`, {
      headers: {
        'x-apisports-key': '86380dbde2e27a014833a567ef568590',
      },
    });
    const data = await response.json();
    
    const filteredPlayers = data.response
      .filter(player => !playerNamesFromSupabase.includes(player.player.name))
      .map(player => {
        const stats = Array.isArray(player.player.statistics) && player.player.statistics.length > 0 ? player.player.statistics[0] : null;

        return {
          id: player.player.id,
          name: player.player.name,
          photo: player.player.photo,
          position: player.statistics[0].games.position,
          appearances: player.statistics[0].games.appearances || 0,
          goals: player.statistics[0].goals.total || 0,
          assists: player.statistics[0].goals.assists || 0,
          yellowCards: player.statistics[0].cards.yellow || 0,
          redCards: player.statistics[0].cards.red || 0,
          passes: player.statistics[0].passes.total || 0,
          passesAccuracy: player.statistics[0].passes.accuracy || 0,
          shots: player.statistics[0].shots.total || 0,
          shotsOnTarget: player.statistics[0].shots.on || 0,
          tackles: player.statistics[0].tackles.total || 0,
          duelsWon: player.statistics[0].duels.won || 0,
          team: player.statistics[0].team.name || 0,
        };
      });

    setSubstitutes(filteredPlayers);
  } catch (error) {
    console.error('Error fetching players for team:', error);
  }
};

const simulateMatch = () => {
  // Verifica si ambos equipos tienen 11 jugadores
  if (mainPlayersTeam1.filter(player => player).length !== 11 || mainPlayersTeam2.filter(player => player).length !== 11) {
    alert("Ambos equipos deben tener 11 jugadores en el campo para simular el partido.");
    return;
  }

  // Generar marcador y estadísticas agregadas
  const scoreTeam1 = Math.floor(Math.random() * 4); 
  const scoreTeam2 = Math.floor(Math.random() * 4); 

  // Calcular posesión
  const totalPassesTeam1 = mainPlayersTeam1.reduce((total, player) => total + (player?.passes || 0), 0);
  const totalPassesTeam2 = mainPlayersTeam2.reduce((total, player) => total + (player?.passes || 0), 0);
  const averagePassesTeam1 = (totalPassesTeam1 / mainPlayersTeam1.length).toFixed(2);
  const averagePassesTeam2 = (totalPassesTeam2 / mainPlayersTeam2.length).toFixed(2);
  
  const totalPossession = totalPassesTeam1 + totalPassesTeam2;
  const possessionTeam1 = totalPossession > 0 ? Math.round((totalPassesTeam1 / totalPossession) * 100) : 0;
  const possessionTeam2 = totalPossession > 0 ? Math.round((totalPassesTeam2 / totalPossession) * 100) : 0;

  const calculateTeamStats = (players, score) => {
    let totalShotsOnTarget = 0;
    let goalScorers = [];

    players.forEach(player => {
      totalShotsOnTarget += Math.floor(player.shotsOnTarget * (Math.random() + 0.5));
      if (Math.random() < 0.3 && goalScorers.length < score) {
        goalScorers.push(player.name);
      }
    });

    return {
      totalShotsOnTarget,
      goalScorers
    };
  };

  const team1Stats = calculateTeamStats(mainPlayersTeam1.filter(player => player), scoreTeam1);
  const team2Stats = calculateTeamStats(mainPlayersTeam2.filter(player => player), scoreTeam2);

  setMatchResult(`Resultado del partido: Argentinos Juniors ${scoreTeam1} - ${scoreTeam2} ${selectedTeam2Name}`);
  setMatchStats({
    team1: {
      score: scoreTeam1,
      possession: possessionTeam1,
      totalShotsOnTarget: team1Stats.totalShotsOnTarget,
      averagePasses: averagePassesTeam1,
      goalScorers: team1Stats.goalScorers
    },
    team2: {
      score: scoreTeam2,
      possession: possessionTeam2,
      totalShotsOnTarget: team2Stats.totalShotsOnTarget,
      averagePasses: averagePassesTeam2,
      goalScorers: team2Stats.goalScorers
    }
  });
};

  return (
    <div>
      <Navbar user={user} />
    <button className="back-button" onClick={() => navigate('/dashboard')}>
      <FaArrowLeft /> Regresar al Dashboard
    </button>
<div className="main-content">
  {/* Contenedor de los tableros */}
  <div className="two-formation-container">
    {/* Tablero para el equipo 1 */}
    <div>
      <h3>Argentinos Juniors</h3>
      <select 
        value={formationTeam1}
        onChange={(e) => setFormationTeam1(e.target.value)}
      >
        <option value="4-5-1">4-5-1</option>
        <option value="4-4-2">4-4-2</option>
        <option value="4-3-3">4-3-3</option>
      </select>
      <Formation
         formation={formationTeam1}
         team="Argentinos juniors"
         mainPlayers={mainPlayersTeam1}
         setMainPlayers={setMainPlayersTeam1}
         substitutes={substitutesTeam1}
         setSubstitutes={setSubstitutesTeam1}
      />
    </div>
    
    {/* Tablero para el equipo 2 */}
    <div>
      <h3>{selectedTeam2Name}</h3>
      <select 
        id="team2-select"
        value={selectedTeam2}
        onChange={handleTeam2Selection}
      >
        <option value="">Seleccionar equipo</option>
        {teams.map(team => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>

      <select 
        value={formationTeam2}
        onChange={(e) => setFormationTeam2(e.target.value)}
      >
        <option value="4-5-1">4-5-1</option>
        <option value="4-4-2">4-4-2</option>
        <option value="4-3-3">4-3-3</option>
      </select>

      <Formation
         formation={formationTeam2}
         team={selectedTeam2Name}
         mainPlayers={mainPlayersTeam2}
         setMainPlayers={setMainPlayersTeam2}
         substitutes={substitutesTeam2}
         setSubstitutes={setSubstitutesTeam2}
      />
    </div>
  </div>

  {/* Contenedor de resultados de simulación en el lado derecho */}
  <div className="right-container">
    <button onClick={simulateMatch} className="simulate-match-button">Simular Partido</button>
    
    {matchResult ? (
  <div className="match-result">
    <h3>{matchResult}</h3>
    <h4>Estadísticas del Partido:</h4>
    <div className="team-stats">
      <div className="team-info">
        <h5>Argentinos Juniors</h5>
        <p>Posesión: {matchStats?.team1.possession}%</p>
        <p>Tiros al arco: {matchStats?.team1.totalShotsOnTarget}</p>
        <p>Promedio de pases: {matchStats?.team1.averagePasses}</p>
        <p>Goleadores: {matchStats?.team1.goalScorers.length > 0 ? matchStats.team1.goalScorers.join(", ") : "Ninguno"}</p>
      </div>
      <div className="team-info">
        <h5>{selectedTeam2Name}</h5>
        <p>Posesión: {matchStats?.team2.possession}%</p>
        <p>Tiros al arco: {matchStats?.team2.totalShotsOnTarget}</p>
        <p>Promedio de pases: {matchStats?.team2.averagePasses}</p>
        <p>Goleadores: {matchStats?.team2.goalScorers.length > 0 ? matchStats.team2.goalScorers.join(", ") : "Ninguno"}</p>
      </div>
    </div>
  </div>
) : (
  <div className="empty-match-result">
    <h3>Estadísticas del Partido</h3>
    <div className="empty-stats">
      <div className="empty-team-info">
        <h4>Argentinos Juniors</h4>
        <p>Posesión: --%</p>
        <p>Tiros al arco: --</p>
        <p>Promedio de pases: --</p>
        <p>Goleadores: --</p>
      </div>
      <div className="empty-team-info">
        <h4>{selectedTeam2Name}</h4>
        <p>Posesión: --%</p>
        <p>Tiros al arco: --</p>
        <p>Promedio de pases: --</p>
        <p>Goleadores: --</p>
      </div>
    </div>
  </div>
)}

  </div>
</div>
</div>
  );
  
}
export default Tactics;
