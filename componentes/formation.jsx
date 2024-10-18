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
  team, // El equipo actual al que pertenece esta formación (Field and Bench Container)
  containerId,
  mainPlayers, 
  setMainPlayers, 
  substitutes, 
  setSubstitutes, 
  selectedPlayer, 
  setSelectedPlayer 
}) => {


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

  const [selectedPosition, setSelectedPosition] = useState(null);

  const positions = formationMapping[formation] || [];

  const handlePositionClick = (index) => {
    const currentFieldPlayer = mainPlayers[index];

    if (selectedPlayer) {
      // Verificar que el jugador seleccionado pertenece al mismo contenedor
      if (currentFieldPlayer && currentFieldPlayer.containerId !== containerId) {
        alert("No puedes mover jugadores de otro contenedor.");
        return;
      }

      // Si la posición está vacía, asignamos el jugador seleccionado desde la banca
      if (currentFieldPlayer === null) {
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
        // Intercambio de jugadores del mismo contenedor en el campo
        const newMainPlayers = [...mainPlayers];
        newMainPlayers[selectedPosition] = currentFieldPlayer;
        newMainPlayers[index] = selectedPlayer;

        setMainPlayers(newMainPlayers);
        setSelectedPlayer(null);
        setSelectedPosition(null);
      }
    } else if (currentFieldPlayer) {
      // Seleccionar un jugador en el campo para moverlo
      setSelectedPlayer(currentFieldPlayer);
      setSelectedPosition(index);
    }
  };

  const handleSubstituteClick = (substitute) => {
    // Verificar que el suplente pertenece al mismo contenedor
    console.log(substitute);
    if (substitute.containerId !== containerId) {
      alert("Solo puedes seleccionar suplentes del mismo contenedor.");
      return;
    }

    // Seleccionar un suplente del mismo contenedor
    setSelectedPlayer(substitute);
    setSelectedPosition(null);
  };

  const handleBenchClick = (index) => {
    if (selectedPlayer) {
      // Verificar que el jugador pertenece al mismo contenedor
      if (selectedPlayer.containerId !== containerId) {
        alert("No puedes mover jugadores de otro contenedor.");
        return;
      }

      const newMainPlayers = [...mainPlayers];
      newMainPlayers[index] = selectedPlayer;

      // Remover de la banca si es necesario
      const filteredSubstitutes = substitutes.filter(sub => sub.id !== selectedPlayer.id);
      setSubstitutes(filteredSubstitutes);

      setMainPlayers(newMainPlayers);
      setSelectedPlayer(null);
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
        onSelectPlayer={handleSubstituteClick} 
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
