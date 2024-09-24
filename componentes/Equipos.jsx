import React, { useEffect, useState } from 'react';
import { getStandingsInArgentinaLeague } from '../src/services/apifootball.js';

import '../style/equipos.css'

const Team = () => {
  const [standings, setStandings] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      const data = await getStandingsInArgentinaLeague(2022); // Temporada 2022
      if (data) {
        setStandings(data[0].league.standings[0]); // Acceder a los datos de clasificación
        setFetchError(null);
        console.log("Datos de la tabla de posiciones recibidos:", data);
      } else {
        setFetchError("No se pudo obtener la tabla de posiciones");
      }
    };

    fetchStandings();
  }, []);

  return (
    <div className="tabla-posiciones">
      <h1>Tabla de Posiciones - Liga Profesional Argentina (2022)</h1>
      {fetchError && <p>{fetchError}</p>}
      {standings.length > 0 ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Equipo</th>
              <th>Puntos</th>
              <th>Partidos Jugados</th>
              <th>Ganados</th>
              <th>Empatados</th>
              <th>Perdidos</th>
              <th>Goles a Favor</th>
              <th>Goles en Contra</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.team.id}>
                <td>{index + 1}</td>
                <td>
                <img src={team.team.logo} alt={team.team.name} width="40" height="40" />
                </td>
                <td>{team.team.name}</td>
                <td>{team.points}</td>
                <td>{team.all.played}</td>
                <td>{team.all.win}</td>
                <td>{team.all.draw}</td>
                <td>{team.all.lose}</td>
                <td>{team.all.goals.for}</td>
                <td>{team.all.goals.against}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando tabla de posiciones...</p>
      )}
    </div>
  );
}

export default Team;
