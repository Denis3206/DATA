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
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [substitutesTeam1, setSubstitutesTeam1] = useState([]);
  const [formationTeam1, setFormationTeam1] = useState("4-5-1");
  const [formationTeam2, setFormationTeam2] = useState("4-4-2");

  const [mainPlayersTeam1, setMainPlayersTeam1] = useState(Array(11).fill(null));
  const [mainPlayersTeam2, setMainPlayersTeam2] = useState(Array(11).fill(null));
  
  const [substitutesTeam2, setSubstitutesTeam2] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const navigate = useNavigate();

  const containerIdTeam1 = 'team1-container'; // ID único para el equipo 1
  const containerIdTeam2 = 'team2-container'; // ID único para el equipo 2

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
        containerId: 'team1-container'
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
  const handleTeam2Selection = (e) => {
    const teamId = e.target.value;
    setSelectedTeam2(teamId);
    fetchPlayersForTeam(teamId, setSubstitutesTeam2); // Usar la función para obtener jugadores del equipo 2
  };

  const fetchPlayersForTeam = async (teamId, setSubstitutes) => {
    if (!teamId) return;
    const response = await fetch(`https://v3.football.api-sports.io/players?team=${teamId}&season=2022`, {
      headers: {
        'x-apisports-key': '86380dbde2e27a014833a567ef568590',  // Coloca aquí tu API key
      },
    });
    const data = await response.json();
    const teamName = teams.find(team => team.id === teamId)?.name; 
    console.log(data); 
    setSubstitutes(data.response.map(player => {
      // Verifica si statistics existe y es un arreglo
      const stats = Array.isArray(player.player.statistics) && player.player.statistics.length > 0 ? player.player.statistics[0] : null;
  
      return {
        id: player.player.id,
        name: player.player.name,
        photo: player.player.photo,
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
        containerId: 'team2-container',
      };
    }));
  };

  const simulateMatch = () => {
    // Verificar si hay 11 jugadores en ambos equipos
    if (mainPlayersTeam1.filter(player => player).length !== 11 || mainPlayersTeam2.filter(player => player).length !== 11) {
      alert("Ambos equipos deben tener 11 jugadores en el campo para simular el partido.");
      return;
    }

    // Simular un resultado realista
    const scoreTeam1 = Math.floor(Math.random() * 5); // Goles para el equipo 1 (0-4)
    const scoreTeam2 = Math.floor(Math.random() * 5); // Goles para el equipo 2 (0-4)

    // Calcular posesión
    const totalPassesTeam1 = mainPlayersTeam1.reduce((total, player) => total + (player?.passes || 0), 0);
    const totalPassesTeam2 = mainPlayersTeam2.reduce((total, player) => total + (player?.passes || 0), 0);
    const totalPossession = totalPassesTeam1 + totalPassesTeam2;
    const possessionTeam1 = totalPossession > 0 ? Math.round((totalPassesTeam1 / totalPossession) * 100) : 0;
    const possessionTeam2 = totalPossession > 0 ? Math.round((totalPassesTeam2 / totalPossession) * 100) : 0;

    // Almacenar estadísticas del partido
    setMatchResult(`Resultado del partido: Equipo 1 ${scoreTeam1} - ${scoreTeam2} Equipo 2`);
    setMatchStats({
      team1: {
        score: scoreTeam1,
        possession: possessionTeam1,
        players: mainPlayersTeam1.filter(player => player).map(player => ({ name: player.name, goals: player.goals, assists: player.assists })),
      },
      team2: {
        score: scoreTeam2,
        possession: possessionTeam2,
        players: mainPlayersTeam2.filter(player => player).map(player => ({ name: player.name, goals: player.goals, assists: player.assists })),
      }
    });
  };


  // Mover jugador de la banca al campo o viceversa (manteniendo la lógica)
  const handlePlayerMove = (player, team) => {
    const currentTeam = team === 'team1' ? 'team1' : selectedTeam2; 

    if (team === 'team1') {
        if (mainPlayersTeam1.find(p => p && p.id === player.id)) {
            setMainPlayersTeam1(mainPlayersTeam1.map(p => p && p.id === player.id ? null : p));
            setSubstitutesTeam1([...substitutesTeam1, player]);
        } else {
            const emptySpot = mainPlayersTeam1.findIndex(p => p === null);
            if (emptySpot !== -1 && substitutesTeam1.find(p => p.id === player.id)) {
                setMainPlayersTeam1(mainPlayersTeam1.map((p, index) => index === emptySpot ? player : p));
                setSubstitutesTeam1(substitutesTeam1.filter(p => p.id !== player.id));
            } else {
                alert("No puedes mover a este jugador desde el equipo contrario.");
            }
        }
    } else if (team === selectedTeam2) {
        if (mainPlayersTeam2.find(p => p && p.id === player.id)) {
            setMainPlayersTeam2(mainPlayersTeam2.map(p => p && p.id === player.id ? null : p));
            setSubstitutesTeam2([...substitutesTeam2, player]);
        } else {
            const emptySpot = mainPlayersTeam2.findIndex(p => p === null);
            if (emptySpot !== -1 && substitutesTeam2.find(p => p.id === player.id)) {
                setMainPlayersTeam2(mainPlayersTeam2.map((p, index) => index === emptySpot ? player : p));
                setSubstitutesTeam2(substitutesTeam2.filter(p => p.id !== player.id));
            } else {
                alert("No puedes mover a este jugador desde el equipo contrario.");
            }
        }
    }
  };
  return (
    <div>
      <Navbar user={user} />
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Regresar al Dashboard
      </button>
      
      <h2>Pizarra Táctica</h2>

      <div className="two-formation-container">
    
        {/* Equipo 1 (Jugadores cargados de Supabase) */}
        <div>
          
          <h3>Mi Equipo</h3>
         
          <select 
            value={formationTeam1}
            onChange={(e) => setFormationTeam1(e.target.value)}
          >
            <option value="4-5-1">4-5-1</option>
            <option value="4-4-2">4-4-2</option>
            <option value="3-4-3">3-4-3</option>
          </select>
          
          <Formation
             formation={formationTeam1}
             team="Mi Equipo"
             containerId={containerIdTeam1}
             mainPlayers={mainPlayersTeam1}
             setMainPlayers={setMainPlayersTeam1}
             substitutes={substitutesTeam1}
             setSubstitutes={setSubstitutesTeam1}
             onSelectPlayer={setSelectedPlayer}
             selectedPlayer={selectedPlayer}
             setSelectedPlayer={setSelectedPlayer}
             onPlayerMove={handlePlayerMove}
          />
        </div>
        <div className="simulate-button-container">
      <button onClick={simulateMatch} className="simulate-match-button">Simular Partido</button>
      </div>
        {/* Equipo 2 (Seleccionable) */}
        <div className="team2-container" >
          <h3>{teams.find(t => t.id === selectedTeam2)?.name || 'Equipo 2'}</h3> 
          <select 
            id="team2-select"
            value={selectedTeam2}
            onChange={handleTeam2Selection}
            className="team2-select"
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
            <option value="3-4-3">3-4-3</option>
          </select>

          <Formation
             formation={formationTeam2}
             team={teams.find(t => t.id === selectedTeam2)?.name}
             containerId={containerIdTeam2}
             mainPlayers={mainPlayersTeam2}
             setMainPlayers={setMainPlayersTeam2}
             substitutes={substitutesTeam2}
             setSubstitutes={setSubstitutesTeam2}
             onSelectPlayer={setSelectedPlayer}
             selectedPlayer={selectedPlayer}
             setSelectedPlayer={setSelectedPlayer}
             onPlayerMove={handlePlayerMove}
          />
        </div>
        
      </div>
      
      {matchResult && (
  <div className="match-result">
    <h3 className="result-title">{matchResult}</h3>
    <h4 className="stats-title">Estadísticas del Partido:</h4>
    <div className="team-stats">
      <div className="team-info">
        <h5 className="team-name">Equipo 1</h5>
        <p className="possession">Posesión: {matchStats?.team1.possession}%</p>
        <ul className="player-stats">
          {matchStats?.team1.players.map(player => (
            <li key={player.name} className="player">
              <span className="player-name">{player.name}</span>: 
              <span className="player-stats"> {player.goals} goles, {player.assists} asistencias</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="team-info">
        <h5 className="team-name">Equipo 2</h5>
        <p className="possession">Posesión: {matchStats?.team2.possession}%</p>
        <ul className="player-stats">
          {matchStats?.team2.players.map(player => (
            <li key={player.name} className="player">
              <span className="player-name">{player.name}</span>: 
              <span className="player-stats"> {player.goals} goles, {player.assists} asistencias</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)}
      </div>
  );
};

export default Tactics;
