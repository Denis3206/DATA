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
    { position: 'Midfielder', top: '46%', left: '40%' },
    { position: 'Midfielder', top: '17%', left: '50%' },
    { position: 'Midfielder', top: '75%', left: '50%' },
    { position: 'Midfielder', top: '45%', left: '60%' },
    { position: 'Attacker', top: '33%', left: '70%' },
    { position: 'Attacker', top: '57%', left: '70%' },
  ]
};

const Formation = ({ 
  formation, 
  team, 
  mainPlayers, 
  setMainPlayers, 
  substitutes, 
  setSubstitutes, 
  selectedPlayer, 
  setSelectedPlayer 
}) => {
  const [teamNames, setTeamNames] = useState(new Array(formation.length).fill(null));
  const [selectedPosition, setSelectedPosition] = useState(null);

  const currentFormation = formationMapping[formation];

  const isPositionAndTeamMatching = (tokenPosition, player) => {
    return tokenPosition === player.position && player.team === team;
  };

  const handlePositionClick = (index) => {
    const tokenPosition = currentFormation[index].position;

    if (mainPlayers[index]) {
      // Si el token ya está ocupado, seleccionamos el jugador
      const currentPlayer = mainPlayers[index];
      // Si hay un jugador seleccionado, intercambiamos
      if (selectedPlayer) {
        // Intercambiar entre dos jugadores en el campo
        if (selectedPosition !== null && selectedPosition !== index) {
          const updatedPlayers = [...mainPlayers];
          updatedPlayers[selectedPosition] = currentPlayer; // Mover el jugador actual a la posición anterior
          updatedPlayers[index] = selectedPlayer; // Mover el jugador seleccionado a la nueva posición
          setMainPlayers(updatedPlayers);

          // Limpiar selección
          setSelectedPlayer(null);
          setSelectedPosition(null);
        }
      } else {
        // Solo seleccionar el jugador del campo
        setSelectedPlayer(currentPlayer);
        setSelectedPosition(index);
      }
    } else {
      // Si el token está vacío y hay un jugador seleccionado
      if (selectedPlayer) {
        if (isPositionAndTeamMatching(tokenPosition, selectedPlayer)) {
          // Asignar el jugador al nuevo token
          const updatedPlayers = [...mainPlayers];
          const previousPosition = selectedPosition !== null ? selectedPosition : index;

          // Si hay una posición anterior ocupada, la vaciamos
          if (previousPosition !== index && mainPlayers[previousPosition]) {
            updatedPlayers[previousPosition] = null; // Hacer el token anterior vacío
          }

          updatedPlayers[index] = selectedPlayer; // Asignar el jugador al nuevo token
          setMainPlayers(updatedPlayers);

          // Eliminar el jugador del banco de suplentes
          const updatedSubstitutes = substitutes.filter(player => player !== selectedPlayer);
          setSubstitutes(updatedSubstitutes);

          // Actualizar el nombre del equipo
          const updatedTeamNames = [...teamNames];
          updatedTeamNames[index] = selectedPlayer.team;
          setTeamNames(updatedTeamNames);

          // Limpiar selección
          setSelectedPlayer(null);
          setSelectedPosition(null);
        } else {
          alert('El jugador no coincide en posición o no pertenece al mismo equipo.');
        }
      }
    }
  };

  const handleBenchPlayerClick = (benchIndex) => {
    const benchPlayer = substitutes[benchIndex];

    // Verifica si hay un jugador seleccionado del campo
    if (selectedPlayer) {
      // Intercambiar el jugador del banco con el seleccionado en el campo
      if (selectedPosition !== null) {
        const tokenPosition = currentFormation[selectedPosition].position;

        // Solo permitir el intercambio si la posición coincide
        if (isPositionAndTeamMatching(tokenPosition, benchPlayer)) {
          const updatedPlayers = [...mainPlayers];
          const updatedSubstitutes = [...substitutes];

          // Mover el jugador del banco al campo
          updatedPlayers[selectedPosition] = benchPlayer; // Mover el jugador del banco al campo
          updatedSubstitutes[benchIndex] = selectedPlayer; // Mover el jugador del campo al banco

          setMainPlayers(updatedPlayers);
          setSubstitutes(updatedSubstitutes);

          // Limpiar selección
          setSelectedPlayer(null);
          setSelectedPosition(null);
        } else {
          alert('El jugador del banco no puede entrar en esa posición.');
        }
      }
    } else {
      // Seleccionar el jugador del banco
      setSelectedPlayer(benchPlayer);
      setSelectedPosition(null);
    }
  };

  const handleRemoveClick = () => {
    if (selectedPosition !== null && mainPlayers[selectedPosition]) {
      const updatedPlayers = [...mainPlayers];
      const removedPlayer = updatedPlayers[selectedPosition];
      updatedPlayers[selectedPosition] = null;

      // Limpia el nombre del equipo al retirar el jugador
      const updatedTeamNames = [...teamNames];
      updatedTeamNames[selectedPosition] = null;
      setTeamNames(updatedTeamNames);

      setMainPlayers(updatedPlayers);
      
      // Añadir el jugador retirado al banco de suplentes
      setSubstitutes(prev => [...prev, removedPlayer]);
      setSelectedPosition(null);
    }
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
              <PlayerToken player={mainPlayers[index]} teamName={teamNames[index]} /> 
            ) : (
              <div className="empty-token" /> 
            )}
          </div>
        ))}
      </div>

      <div className="remove-button-container">
        <button
          onClick={handleRemoveClick}
          className="remove-button"
          disabled={!mainPlayers.some(player => player)}
        >
          Retirar Jugador
        </button>
      </div>

      <PlayerBench 
        players={substitutes} 
        onSelectPlayer={setSelectedPlayer} 
        selectedPlayer={selectedPlayer} 
        onBenchPlayerClick={handleBenchPlayerClick} // Agregar la función de click del banco
      />
    </div>
  );
};

export default Formation;