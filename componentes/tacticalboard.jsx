import React, { useState, useEffect } from 'react'; 
import { fetchPlayers } from '../src/services/apifootball.js';
import Formation from './formation.jsx';
import Navbar from './navbar.jsx';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../style/tacticalboard.css'

const Tactics = () => {
  const [user, setUser] = useState(null);
  const [formationTeam1, setFormationTeam1] = useState("4-5-1");
  const [formationTeam2, setFormationTeam2] = useState("4-4-2");
  
  const [mainPlayersTeam1, setMainPlayersTeam1] = useState(Array(11).fill(null));
  const [mainPlayersTeam2, setMainPlayersTeam2] = useState(Array(11).fill(null));

  const [substitutesTeam1, setSubstitutesTeam1] = useState([]);
  const [substitutesTeam2, setSubstitutesTeam2] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
    const fetchAllPlayers = async () => {
      const teamId1 = '458'; // ID del equipo 1
      const teamId2 = '438'; // ID del equipo 2
  
      try {
        const playersTeam1 = await fetchPlayers(teamId1);
        const playersTeam2 = await fetchPlayers(teamId2);
        
        // Suponiendo que los jugadores se traen en el formato correcto
        // Rellenar los jugadores en el campo principal o en el banco
        setMainPlayersTeam1(playersTeam1.slice(0, 11)); // Primeros 11 jugadores para el campo
        setSubstitutesTeam1(playersTeam1.slice(11)); // Restantes como suplentes
        
        setMainPlayersTeam2(playersTeam2.slice(0, 11)); // Primeros 11 jugadores para el campo
        setSubstitutesTeam2(playersTeam2.slice(11)); // Restantes como suplentes
  
      } catch (error) {
        console.error("Error fetching players", error);
      }
    };
  
    fetchAllPlayers();
  }, []);
   
  return (
    <div>
      <Navbar user={user} />
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Regresar al Dashboard
      </button>
    <h2>Pizarra Táctica</h2>

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
        />
      </div>
    </div>

    <div>
      <input 
        type="text" 
        value={selectedPlayer?.name || ""} 
        onChange={(e) => setSelectedPlayer({ ...selectedPlayer, name: e.target.value })} 
        placeholder="Nombre del nuevo jugador" 
      />
      <button 
        onClick={() => {
          if (selectedPlayer) {
            const team = selectedPlayer.team;
            const substitutes = team === "team1" ? substitutesTeam1 : substitutesTeam2;
            const setSubstitutes = team === "team1" ? setSubstitutesTeam1 : setSubstitutesTeam2;

            const newSubstitute = {
              id: substitutes.length + 1,
              name: selectedPlayer.name,
              team: team
            };

            setSubstitutes([...substitutes, newSubstitute]);
            setSelectedPlayer(null);
          }
        }}
      >
        Añadir Jugador
      </button>
    </div>
  </div>
  );
};

export default Tactics;