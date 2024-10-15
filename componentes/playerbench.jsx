import React from 'react';
import '../style/playerbench.css';

const PlayerBench = ({ players, onSelectPlayer, selectedPlayer }) => (
  <div className="bench-container">
    {players.map((player) => (
      <div 
        key={player.id} 
        onClick={() => onSelectPlayer(player)}
        className={`bench-player ${selectedPlayer && selectedPlayer.id === player.id ? 'selected' : ''}`}
      >
        <img 
          src={player.photo} 
          alt={player.name} 
          className="player-photo" 
          style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
        />
        <div className="player-name">
          {player.name}
        </div>
      </div>
    ))}
  </div>
);

export default PlayerBench;