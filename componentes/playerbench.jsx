import React from 'react';
import '../style/playerbench.css';
import PlayerToken from './tokenplayer';

const PlayerBench = ({ players, onSelectPlayer, selectedPlayer }) => {
  if (!Array.isArray(players)) {
    console.error("Players is not an array:", players);
    return null; // O manejar el error de otra manera
  }

  return (
    <div className="bench-container">
      {players.map((player) => (
        <div 
          key={player.id} 
          onClick={() => onSelectPlayer(player)} // Se pasa el jugador al click
          className={`bench-player ${selectedPlayer && selectedPlayer.id === player.id ? 'selected' : ''}`}
        >
          <PlayerToken player={player} />
        </div>
      ))}
    </div>
  );
};
export default PlayerBench;