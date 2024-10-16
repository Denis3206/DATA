import React, { useState, useEffect } from 'react'; 
import Formation from './formation.jsx';
import Navbar from './navbar.jsx';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../style/tacticalboard.css'

const Tactics = () => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [substitutesTeam1, setSubstitutesTeam1] = useState([]);
  const [formationTeam1, setFormationTeam1] = useState("4-5-1");
  const [formationTeam2, setFormationTeam2] = useState("4-4-2");

  const [mainPlayersTeam1, setMainPlayersTeam1] = useState(Array(11).fill(null));
  const [mainPlayersTeam2, setMainPlayersTeam2] = useState(Array(11).fill(null));
  
  const [substitutesTeam2, setSubstitutesTeam2] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  // Obtener equipos de la liga argentina
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

  // Obtener jugadores del equipo seleccionado
  const fetchPlayersForTeam = async (teamId, setSubstitutes) => {
    if (!teamId) return;
    const response = await fetch(`https://v3.football.api-sports.io/players?team=${teamId}&season=2022`, {
      headers: {
        'x-apisports-key': '86380dbde2e27a014833a567ef568590',  // Coloca aquí tu API key
      },
    });
    const data = await response.json();
    const teamName = teams.find(team => team.id === teamId)?.name; // Obtener el nombre del equipo

    setSubstitutes(data.response.map(player => ({
      id: player.player.id,
      name: player.player.name,
      photo: player.player.photo,
      team: teamName  // Usar el nombre del equipo en lugar de 'team1' o 'team2'
    })));
  };

  // Manejar selección de equipo para el equipo 1
  const handleTeam1Selection = (e) => {
    const teamId = e.target.value;
    setSelectedTeam1(teamId);
    fetchPlayersForTeam(teamId, setSubstitutesTeam1);
  };

  // Manejar selección de equipo para el equipo 2
  const handleTeam2Selection = (e) => {
    const teamId = e.target.value;
    setSelectedTeam2(teamId);
    fetchPlayersForTeam(teamId, setSubstitutesTeam2);
  };

  // Mover jugador de la banca al campo o viceversa
const handlePlayerMove = (player, team) => {
    const currentTeam = team === selectedTeam1 ? selectedTeam1 : selectedTeam2; // Obtener el ID del equipo seleccionado

    // Verificar si el jugador pertenece al equipo actual
    if (player.team !== teams.find(t => t.id === currentTeam)?.name) {
        alert("Este jugador no pertenece al equipo seleccionado");
        return;
    }

    if (team === selectedTeam1) {
        if (mainPlayersTeam1.find(p => p && p.id === player.id)) {
            // Mover al banquillo
            setMainPlayersTeam1(mainPlayersTeam1.map(p => p && p.id === player.id ? null : p));
            setSubstitutesTeam1([...substitutesTeam1, player]);
        } else {
            // Mover al campo si hay un espacio vacío
            const emptySpot = mainPlayersTeam1.findIndex(p => p === null);
            if (emptySpot !== -1) {
                // Verificar que el jugador se mueve desde el banquillo del equipo 1
                if (substitutesTeam1.find(p => p.id === player.id)) {
                    setMainPlayersTeam1(mainPlayersTeam1.map((p, index) => index === emptySpot ? player : p));
                    setSubstitutesTeam1(substitutesTeam1.filter(p => p.id !== player.id));
                } else {
                    alert("No puedes mover a este jugador desde el equipo contrario.");
                }
            }
        }
    } else if (team === selectedTeam2) {
        if (mainPlayersTeam2.find(p => p && p.id === player.id)) {
            // Mover al banquillo
            setMainPlayersTeam2(mainPlayersTeam2.map(p => p && p.id === player.id ? null : p));
            setSubstitutesTeam2([...substitutesTeam2, player]);
        } else {
            // Mover al campo si hay un espacio vacío
            const emptySpot = mainPlayersTeam2.findIndex(p => p === null);
            if (emptySpot !== -1) {
                // Verificar que el jugador se mueve desde el banquillo del equipo 2
                if (substitutesTeam2.find(p => p.id === player.id)) {
                    setMainPlayersTeam2(mainPlayersTeam2.map((p, index) => index === emptySpot ? player : p));
                    setSubstitutesTeam2(substitutesTeam2.filter(p => p.id !== player.id));
                } else {
                    alert("No puedes mover a este jugador desde el equipo contrario.");
                }
            }
        }
    }
};

const fetchPlayersWithStatsForTeam = async (teamId, setSubstitutes) => {
  if (!teamId) return;
  const response = await fetch(`https://v3.football.api-sports.io/players?team=${teamId}&season=2022`, {
      headers: {
          'x-apisports-key': '86380dbde2e27a014833a567ef568590',  // Coloca aquí tu API key
      },
  });
  const data = await response.json();

  const playersWithStats = await Promise.all(data.response.map(async (player) => {
      // Obtener estadísticas del jugador
      const statsResponse = await fetch(`https://v3.football.api-sports.io/players/statistics?player=${player.player.id}&season=2022`, {
          headers: {
              'x-apisports-key': '86380dbde2e27a014833a567ef568590',
          },
      });
      const statsData = await statsResponse.json();
      const stats = statsData.response[0]?.statistics || {};

      return {
          id: player.player.id,
          name: player.player.name,
          photo: player.player.photo,
          goals: stats.goals?.total || 0,
          assists: stats.goals?.assists || 0,
          yellowCards: stats.cards?.yellow || 0,
          redCards: stats.cards?.red || 0,
          team: teams.find(t => t.id === teamId)?.name // Usar el nombre del equipo en lugar de 'team1' o 'team2'
      };
  }));

  setSubstitutes(playersWithStats);
};

const [matchResult, setMatchResult] = useState(null);

// Función para simular el partido
const simulateMatch = () => {
  if (mainPlayersTeam1.includes(null) || mainPlayersTeam2.includes(null)) {
      alert("Ambos equipos deben tener 11 jugadores en el campo para simular el partido.");
      return;
  }

  // Lógica para simular el partido
  let scoreTeam1 = 0;
  let scoreTeam2 = 0;

  // Sumar goles de jugadores del primer equipo
  mainPlayersTeam1.forEach(player => {
      if (player && typeof player.goals === 'number') {
          scoreTeam1 += player.goals;  // Asegúrate de que 'goals' es un número
      }
  });

  // Sumar goles de jugadores del segundo equipo
  mainPlayersTeam2.forEach(player => {
      if (player && typeof player.goals === 'number') {
          scoreTeam2 += player.goals;  // Asegúrate de que 'goals' es un número
      }
  });

  // Obteniendo los nombres de los equipos de los jugadores
  const team1Name = mainPlayersTeam1[0]?.team || "Equipo 1"; // Asigna un nombre por defecto si no existe
  const team2Name = mainPlayersTeam2[0]?.team || "Equipo 2"; // Asigna un nombre por defecto si no existe

  console.log(mainPlayersTeam1);
console.log(mainPlayersTeam2);
console.log(scoreTeam1, scoreTeam2);
  // Mostrar el resultado del partido
  setMatchResult(`Resultado: ${team1Name} ${scoreTeam1} - ${scoreTeam2} ${team2Name}`);
};

  return (
    <div>
      <Navbar user={user} />
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Regresar al Dashboard
      </button>
      <h2>Pizarra Táctica</h2>

      <div className="team-selection-container">
        {/* Selección de equipo para el Equipo 1 */}
        <div>
          <label htmlFor="team1-select">Seleccionar Equipo 1:</label>
          <select 
            id="team1-select" 
            value={selectedTeam1}
            onChange={handleTeam1Selection}
          >
            <option value="">Seleccionar equipo</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        {/* Selección de equipo para el Equipo 2 */}
        <div>
          <label htmlFor="team2-select">Seleccionar Equipo 2:</label>
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
        </div>
      </div>

      <div className="two-formation-container">
        {/* Selección de formación para el Equipo 1 */}
        <div>
          <h3>{teams.find(t => t.id === selectedTeam1)?.name}</h3> {/* Mostrar el nombre del equipo 1 */}
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
             team={teams.find(t => t.id === selectedTeam1)?.name} // Usar el nombre del equipo
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

        {/* Selección de formación para el Equipo 2 */}
        <div>
          <h3>{teams.find(t => t.id === selectedTeam2)?.name}</h3> {/* Mostrar el nombre del equipo 2 */}
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
             team={teams.find(t => t.id === selectedTeam2)?.name} // Usar el nombre del equipo
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
      <button onClick={simulateMatch} disabled={mainPlayersTeam1.includes(null) || mainPlayersTeam2.includes(null)}>
            Simular Partido
        </button>

        {/* Mostrar resultado del partido */}
        {matchResult && <h3>{matchResult}</h3>}
    </div>
  );
};

export default Tactics;
