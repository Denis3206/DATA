/* // PlayerToken.jsx
import React from 'react';
import '../style/estilos.css'

const PlayerToken = ({ player, position }) => (
  <div className="player-token">
    {player ? player.name : position}
  </div>
);

export default PlayerToken;
 */
// PlayerToken.jsx
import React from 'react';
import '../style/playertoken.css';

const PlayerToken = ({ player }) => {
  return (
    <div className="player-token-container">
      {player ? (
        <>
          <div className="player-token">
            <img src={player.photo} alt={player.name} className="player-photo" />
          </div>
          <div className="player-name">{player.name}</div>
        </>
      ) : (
        <div className="empty-token">Vacío</div>
      )}
    </div>
  );
};

export default PlayerToken;