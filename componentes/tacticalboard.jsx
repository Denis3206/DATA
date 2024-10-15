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
    setSubstitutes(data.response.map(player => ({
      id: player.player.id,
      name: player.player.name,
      photo: player.player.photo,
      team: 'team1'  // Esto podría ajustarse según sea necesario
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
    if (team === 'team1') {
      if (mainPlayersTeam1.find(p => p && p.id === player.id)) {
        // Mover al banquillo
        setMainPlayersTeam1(mainPlayersTeam1.map(p => p && p.id === player.id ? null : p));
        setSubstitutesTeam1([...substitutesTeam1, player]);
      } else {
        // Mover al campo si hay un espacio vacío
        const emptySpot = mainPlayersTeam1.findIndex(p => p === null);
        if (emptySpot !== -1) {
          setMainPlayersTeam1(mainPlayersTeam1.map((p, index) => index === emptySpot ? player : p));
          setSubstitutesTeam1(substitutesTeam1.filter(p => p.id !== player.id));
        }
      }
    } else if (team === 'team2') {
      if (mainPlayersTeam2.find(p => p && p.id === player.id)) {
        // Mover al banquillo
        setMainPlayersTeam2(mainPlayersTeam2.map(p => p && p.id === player.id ? null : p));
        setSubstitutesTeam2([...substitutesTeam2, player]);
      } else {
        // Mover al campo si hay un espacio vacío
        const emptySpot = mainPlayersTeam2.findIndex(p => p === null);
        if (emptySpot !== -1) {
          setMainPlayersTeam2(mainPlayersTeam2.map((p, index) => index === emptySpot ? player : p));
          setSubstitutesTeam2(substitutesTeam2.filter(p => p.id !== player.id));
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
          <h3>Equipo 1</h3>
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
             team="team1"
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
          <h3>Equipo 2</h3>
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
             team="team2"
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

      {/* Mostrar jugadores en la banca */}
      {/* <div>
        <h3>Banca Equipo 1</h3>
        <div className="bench">
          {substitutesTeam1.length > 0 ? (
            substitutesTeam1.map(player => (
              <div key={player.id} className="player-token" onClick={() => handlePlayerMove(player, 'team1')}>
                <img src={player.photo} alt={player.name} />
                <p>{player.name}</p>
              </div>
            ))
          ) : (
            <p>No hay jugadores en la banca</p>
          )}
        </div>

        <h3>Banca Equipo 2</h3>
        <div className="bench">
          {substitutesTeam2.length > 0 ? (
            substitutesTeam2.map(player => (
              <div key={player.id} className="player-token" onClick={() => handlePlayerMove(player, 'team2')}>
                <img src={player.photo} alt={player.name} />
                <p>{player.name}</p>
              </div>
            ))
          ) : (
            <p>No hay jugadores en la banca</p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default Tactics;