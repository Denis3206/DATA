import React,{useState} from 'react';
import PlayerToken from './tokenplayer.jsx';
import PlayerBench from './playerbench.jsx';
import '../style/formation.css';

const formationMapping = {
  "4-5-1": [
    { position: 'Goalkeeper', top: '46%', left: '10%' },
    { position: 'Defender', top: '55%', left: '24%' },
    { position: 'Defender', top: '33%', left: '24%' },
    { position: 'Defender', top: '17%', left: '30%' },
    { position: 'Defender', top: '75%', left: '30%' },
    { position: 'Midfielder', top: '46%', left: '40%' },
    { position: 'Midfielder', top: '17%', left: '50%' },
    { position: 'Midfielder', top: '75%', left: '50%' },
    { position: 'Midfielder', top: '33%', left: '60%' },
    { position: 'Midfielder', top: '57%', left: '60%' },
    { position: 'Attacker', top: '46%', left: '70%' },
  ],
  "4-4-2": [
    { position: 'Goalkeeper', top: '46%', left: '10%' },
    { position: 'Defender', top: '55%', left: '24%' },
    { position: 'Defender', top: '33%', left: '24%' },
    { position: 'Defender', top: '17%', left: '30%' },
    { position: 'Defender', top: '75%', left: '30%' },
    { position: 'Midfielder', top: '42%', left: '40%' },
    { position: 'Midfielder', top: '17%', left: '50%' },
    { position: 'Midfielder', top: '75%', left: '50%' },
    { position: 'Midfielder', top: '45%', left: '60%' },
    { position: 'Attacker', top: '33%', left: '70%' },
    { position: 'Attacker', top: '57%', left: '70%' },
  ],
  "4-3-3": [
    { position: 'Goalkeeper', top: '46%', left: '10%' },
    { position: 'Defender', top: '55%', left: '24%' },
    { position: 'Defender', top: '33%', left: '24%' },
    { position: 'Defender', top: '17%', left: '30%' },
    { position: 'Defender', top: '75%', left: '30%' },
    { position: 'Midfielder', top: '44%', left: '40%' },
    { position: 'Midfielder', top: '17%', left: '50%' },
    { position: 'Midfielder', top: '75%', left: '50%' },
    { position: 'Attacker', top: '17%', left: '70%' },
    { position: 'Attacker', top: '44%', left: '70%' },
    { position: 'Attacker', top: '75%', left: '70%' },
  ]
};

const Formation = ({ 
  formation, 
  team, 
  mainPlayers, 
  setMainPlayers, 
  substitutes, 
  setSubstitutes, 
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const currentFormation = formationMapping[formation];

  const isPositionAndTeamMatching = (tokenPosition, player) => {
    return player && tokenPosition === player.position && player.team === team;
};

const handlePositionClick = (index) => {
  const currentPlayer = mainPlayers[index];
  const tokenPosition = currentFormation[index]?.position;

  // Si hay un jugador seleccionado de la banca
  if (selectedPlayer) {
    // Caso 1: Colocar un jugador de la banca en una posición ocupada en el campo
    if (currentPlayer) {
      // Verifica si el jugador seleccionado ya está en el campo
      if (mainPlayers.includes(selectedPlayer)) {
        alert('No se puede realizar el intercambio: el jugador ya está en el campo.');
        resetSelection();
        return;
      }

      // Intercambio entre un jugador del campo y uno de la banca
      if (isPositionAndTeamMatching(tokenPosition, selectedPlayer)) {
        const updatedPlayers = [...mainPlayers];
        const updatedSubstitutes = [...substitutes];

        // Realiza el intercambio
        updatedPlayers[index] = selectedPlayer; // Coloca el jugador de la banca en la posición
        updatedSubstitutes.push(currentPlayer); // Devuelve el jugador del campo a la banca

        // Elimina el jugador de la banca que se está colocando
        const benchIndex = updatedSubstitutes.indexOf(selectedPlayer);
        if (benchIndex > -1) {
          updatedSubstitutes.splice(benchIndex, 1);
        }

        setMainPlayers(updatedPlayers);
        setSubstitutes(updatedSubstitutes);
        resetSelection();
      } else {
        alert('El jugador de la banca no puede ocupar esa posición en el campo.');
      }
    } else {
      // Caso 2: Colocar un jugador de la banca en una posición vacía en el campo
      if (isPositionAndTeamMatching(tokenPosition, selectedPlayer)) {
        const updatedPlayers = [...mainPlayers];
        const updatedSubstitutes = [...substitutes];

        // Verifica si el jugador seleccionado ya está en el campo
        if (mainPlayers.includes(selectedPlayer)) {
          alert('No se puede realizar el intercambio: el jugador ya está en el campo.');
          resetSelection();
          return;
        }

        updatedPlayers[index] = selectedPlayer;

        // Elimina el jugador de la banca
        const benchIndex = updatedSubstitutes.indexOf(selectedPlayer);
        if (benchIndex > -1) {
          updatedSubstitutes.splice(benchIndex, 1);
        }

        setMainPlayers(updatedPlayers);
        setSubstitutes(updatedSubstitutes);
        resetSelection();
      } else {
        alert('El jugador no puede ocupar esa posición en el campo.');
      }
    }
  } else {
    // Si no hay jugador de la banca seleccionado, selecciona el jugador del campo
    if (currentPlayer) {
      setSelectedPlayer(currentPlayer);
      setSelectedPosition(index);
    }
  }
};

// Función para manejar clics en los jugadores de la banca
const handleBenchPlayerClick = (benchPlayer) => {
  // Selecciona un jugador de la banca
  setSelectedPlayer(benchPlayer);
  setSelectedPosition(null); // Resetea la posición seleccionada ya que es un jugador de la banca
};

// Función para restablecer la selección
const resetSelection = () => {
  setSelectedPlayer(null);
  setSelectedPosition(null);
};


  return (
    <div className="field-and-bench-container">
      <div className="formation-container">
        {currentFormation.map((pos, index) => (
          <div
            key={index}
            onClick={() => handlePositionClick(index)}
            className={`player-position ${mainPlayers[index] ? 'filled' : 'empty'}`}
            style={{ top: pos.top, left: pos.left, position: 'absolute' }}
          >
            {mainPlayers[index] ? (
              <div>
                <PlayerToken player={mainPlayers[index]} onClick={() => handlePositionClick(index)} /> 
              </div>
            ) : (
              <div className="empty-token" /> 
            )}
          </div>
        ))}
      </div>

      <PlayerBench 
        players={substitutes} 
        onSelectPlayer={handleBenchPlayerClick} 
        selectedPlayer={selectedPlayer} 
      />
    </div>
  );
};

export default Formation;