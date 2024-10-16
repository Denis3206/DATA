import React from 'react';
import '../style/playerbench.css';
import PlayerToken from './tokenplayer';

const PlayerBench = ({ players, onSelectPlayer, selectedPlayer }) => (
  <div className="bench-container">
    {players.map((player) => (
      <div 
        key={player.id} 
        onClick={() => onSelectPlayer(player)}
        className={`bench-player ${selectedPlayer && selectedPlayer.id === player.id ? 'selected' : ''}`}
      >
        <PlayerToken player={player} />
      </div>
    ))}
  </div>
);

export default PlayerBench;