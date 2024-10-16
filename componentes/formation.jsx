import React, { useState } from 'react';
import PlayerToken from './tokenplayer.jsx';
import PlayerBench from './playerbench.jsx';
import '../style/formation.css';


// Posiciones para diferentes formaciones
const formationMapping = {
  "4-5-1": [
    { position: "ARQ", top: '46%', left: '10%' },
    { position: "DFC", top: '55%', left: '24%' },
    { position: "DFC", top: '33%', left: '24%' },
    { position: "LI", top: '17%', left: '30%' },
    { position: "LD", top: '75%', left: '30%' },
    { position: "MC", top: '46%', left: '40%' },
    { position: "MI", top: '17%', left: '50%' },
    { position: "MD", top: '75%', left: '50%' },
    { position: "MCO", top: '33%', left: '60%' },
    { position: 'MCO', top: '57%', left: '60%' },
    { position: "DL", top: '46%', left: '70%' },
  ],
  "4-4-2": [
    { position: "ARQ", top: '46%', left: '10%' },
    { position: "DFC", top: '55%', left: '24%' },
    { position: "DFC", top: '33%', left: '24%' },
    { position: "LI", top: '17%', left: '30%' },
    { position: "LD", top: '75%', left: '30%' },
    { position: "MC", top: '46%', left: '40%' },
    { position: "MI", top: '17%', left: '50%' },
    { position: "MD", top: '75%', left: '50%' },
    { position: 'MCO', top: '45%', left: '60%' },
    { position: "DL", top: '33%', left: '70%' },
    { position: "DL", top: '57%', left: '70%' },
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
  const [selectedPosition, setSelectedPosition] = useState(null);

  const positions = formationMapping[formation] || [];

  const handleRemoveClick = () => {
    if (selectedPosition !== null && mainPlayers[selectedPosition] !== null) {
      const playerToRemove = mainPlayers[selectedPosition];
      const newMainPlayers = [...mainPlayers];
      newMainPlayers[selectedPosition] = null;

      // Agregar el jugador al banco
      const filteredSubstitutes = substitutes.filter(sub => sub.id !== playerToRemove.id);
      filteredSubstitutes.push(playerToRemove);
      setSubstitutes(filteredSubstitutes);

      setMainPlayers(newMainPlayers);
      setSelectedPlayer(null);
      setSelectedPosition(null);
    }
  };

  const handlePositionClick = (index) => {
    if (selectedPlayer) {
      if (selectedPlayer.team !== team) {
        // Mostrar alerta si se intenta mover un jugador de otro equipo
        alert("No puedes mover un jugador del otro equipo.");
        return;
      }
      // Solo intercambiar si el jugador seleccionado es un suplente del mismo equipo
      if (mainPlayers[index] === null) {
        // Si la posición está vacía, asignamos el jugador seleccionado desde la banca
        const newMainPlayers = [...mainPlayers];
        newMainPlayers[index] = selectedPlayer;

        if (selectedPosition !== null) {
          newMainPlayers[selectedPosition] = null;
        }
        // Remover al jugador de la banca si venía de ahí
        const filteredSubstitutes = substitutes.filter(sub => sub.id !== selectedPlayer.id);
        setSubstitutes(filteredSubstitutes);

        setMainPlayers(newMainPlayers);
        setSelectedPlayer(null);
        setSelectedPosition(null);
      } else {
        // Intercambiar entre jugadores del campo
        const currentFieldPlayer = mainPlayers[index];
        const newMainPlayers = [...mainPlayers];
        if (selectedPosition === null) {
          const filteredSubstitutes = substitutes.filter(sub => sub.id !== selectedPlayer.id);
          filteredSubstitutes.push(currentFieldPlayer); // El jugador del campo va a la banca
          setSubstitutes(filteredSubstitutes);
          newMainPlayers[index] = selectedPlayer;
          setMainPlayers(newMainPlayers);
        }

        newMainPlayers[selectedPosition] = currentFieldPlayer;
        newMainPlayers[index] = selectedPlayer;

        setMainPlayers(newMainPlayers);
        setSelectedPlayer(null);
        setSelectedPosition(null);
      }
    } else if (mainPlayers[index] !== null) {
      // Seleccionar un jugador en el campo para moverlo
      setSelectedPlayer(mainPlayers[index]);
      setSelectedPosition(index);
    }
  };

  const handleSubstituteClick = (substitute) => {
    if (selectedPlayer) {
      if (substitute.team !== team) {
        // Mostrar alerta si se intenta seleccionar un suplente de otro equipo
        alert("No puedes seleccionar un suplente del otro equipo.");
        return;
      }

      // Seleccionar un suplente del equipo
      setSelectedPlayer(substitute);
      setSelectedPosition(null);
    } else {
      // Seleccionar un suplente del equipo
      setSelectedPlayer(substitute);
    }
  };

  const handleBenchClick = (index) => {
    if (selectedPlayer) {
      if (mainPlayers[index] === null) {
        // Si la posición en el campo está vacía, movemos el jugador a esa posición
        const newMainPlayers = [...mainPlayers];
        newMainPlayers[index] = selectedPlayer;

        // Removemos al jugador de la banca si venía de ahí
        const filteredSubstitutes = substitutes.filter(sub => sub.id !== selectedPlayer.id);
        setSubstitutes(filteredSubstitutes);

        setMainPlayers(newMainPlayers);
        setSelectedPlayer(null);
      }
    }
  };
  const isRemoveButtonEnabled = selectedPosition !== null && mainPlayers[selectedPosition] !== null;

  return (
    <div className="field-and-bench-container">
      <div className="formation-container">
      {positions.map((pos, index) => (
  <div
    key={index}
    onClick={() => handlePositionClick(index)}
    className={`player-position ${mainPlayers[index] ? 'filled' : 'empty'} ${index === selectedPosition ? 'selected-position' : ''}`}
    style={{ top: pos.top, left: pos.left, position: 'absolute' }}
  >
    {/* Pasar el jugador a PlayerToken */}
    <PlayerToken player={mainPlayers[index]} />
  </div>
))}
      </div>
      <div className="remove-button-container">
        <button
          onClick={handleRemoveClick}
          className="remove-button"
          disabled={!isRemoveButtonEnabled}
        >
          Retirar Jugador
        </button>
      </div>

      <PlayerBench 
        players={substitutes} 
        onSelectPlayer={handleSubstituteClick} // Pasar el manejador de clics
        selectedPlayer={selectedPlayer} 
      />

      {selectedPlayer && (
        <div className="info">
          <p>Jugador Seleccionado: {selectedPlayer.name}</p>
        </div>
      )}
    </div>
  );
};

export default Formation;
