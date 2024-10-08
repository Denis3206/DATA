import React, { useState, useEffect } from 'react'; 
import { fetchPlayers } from '../src/services/apifootball.js';
import Formation from './formation.jsx';
import '../style/tacticalboard.css'

const Tactics = () => {
  const [formationTeam1, setFormationTeam1] = useState("4-5-1");
  const [formationTeam2, setFormationTeam2] = useState("4-4-2");
  
  const [mainPlayersTeam1, setMainPlayersTeam1] = useState(Array(11).fill(null));
  const [mainPlayersTeam2, setMainPlayersTeam2] = useState(Array(11).fill(null));

  const [substitutesTeam1, setSubstitutesTeam1] = useState([]);
  const [substitutesTeam2, setSubstitutesTeam2] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  useEffect(() => {
    const fetchAllPlayers = async () => {
      const teamId1 = '458'; // Reemplaza con el ID del equipo 1
      const teamId2 = '438'; // Reemplaza con el ID del equipo 2

      try {
        const playersTeam1 = await fetchPlayers(teamId1);
        const playersTeam2 = await fetchPlayers(teamId2);
        
        setSubstitutesTeam1(playersTeam1);
        setSubstitutesTeam2(playersTeam2);
      } catch (error) {
        console.error("Error fetching players", error);
      }
    };

    fetchAllPlayers();
  }, []);
   
  return (
    <div>
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