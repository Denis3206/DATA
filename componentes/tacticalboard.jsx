import React, { useState } from 'react'; 
import Formation from './formation.jsx';
import '../style/tacticalboard.css'

const Tactics = () => {
  const [formationTeam1, setFormationTeam1] = useState("4-5-1");
  const [formationTeam2, setFormationTeam2] = useState("4-4-2");
  
  const [mainPlayersTeam1, setMainPlayersTeam1] = useState(Array(11).fill(null));
  const [mainPlayersTeam2, setMainPlayersTeam2] = useState(Array(11).fill(null));
  
  const [substitutesTeam1, setSubstitutesTeam1] = useState([
    { id: 1, name: "Messi", team:"team1" },
    { id: 2, name: "Neymar", team:"team1" },
    { id: 3, name: "Mbappe", team:"team1" },
    { id: 4, name: "Ronaldo", team:"team1" },
    { id: 5, name: "Neuer", team:"team1" },
    { id: 6, name: "Marquinhos", team:"team1" },
    { id: 7, name: "Rudiguer", team:"team1" },
    { id: 8, name: "Di Maria", team:"team1" },
    { id: 9, name: "Cafu", team:"team1" },
    { id: 10, name: "Zidane", team:"team1" },
    { id: 11, name: "Ramos", team:"team1" },
    { id: 12, name: "Pepe", team:"team1" }
    // Añadir más suplentes con ids únicos aquí
  ]);

  const [substitutesTeam2, setSubstitutesTeam2] = useState([
    { id: 1, name: "Aquino", team:"team2" },
    { id: 2, name: "De Bruyne", team:"team2" },
    { id: 3, name: "Vinicius Jr", team:"team2" },
    { id: 4, name: "Donnarumma", team:"team2" },
    { id: 5, name: "Haaland", team:"team2" },
    { id: 6, name: "Van Dijk", team:"team2" },
    { id: 7, name: "Otamendi", team:"team2" },
    { id: 8, name: "C.Romero", team:"team2" },
    { id: 9, name: "Saka", team:"team2" },
    { id: 10, name: "Benzema", team:"team2" },
    { id: 11, name: "Pirlo", team:"team2" },
    { id: 12, name: "Maldini", team:"team2" }
    // Añadir más suplentes con ids únicos aquí
  ]);

  const [newPlayerName, setNewPlayerName] = useState("");


 /*   const handleAddPlayer = () => {
    if (newPlayerName.trim() === "") return;

    const newPlayer = {
      id: Date.now(), 
      name: newPlayerName.trim(),
    };

    if (team === 'team1') {
      setSubstitutesTeam1([...substitutesTeam1, newPlayer]);
    } else if (team === 'team2') {
      setSubstitutesTeam2([...substitutesTeam2, newPlayer]);
    }

    setNewPlayerName("");
  };  */
 
   
  const [selectedPlayer, setSelectedPlayer] = useState(null);
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