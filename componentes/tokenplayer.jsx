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
    <div className="player-token">
      {player ? player.name : "Vacío"}
    </div>
  );
};

export default PlayerToken;
