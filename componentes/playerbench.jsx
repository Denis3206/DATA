import React from 'react';
import '../style/playerbench.css'; // Importa el archivo CSS

const PlayerBench = ({ players, onSelectPlayer, selectedPlayer }) => (
  <div className="bench-container">
    {players.map((player) => (
      <div 
        key={player.id} 
        onClick={() => onSelectPlayer(player)}
        className={`bench-player ${selectedPlayer && selectedPlayer.id === player.id ? 'selected' : ''}`}
      >
        {player.name}
      </div>
    ))}
  </div>
);

export default PlayerBench;
