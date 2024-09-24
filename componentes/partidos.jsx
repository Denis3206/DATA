import React, { useEffect, useState } from 'react';
import { getTeamsInArgentinaLeague} from '../src/services/apifootball.js';


function PartidosFutbol() {
  const [teams, setTeams] = useState([]);
  const [fetchError, setFetchError] = useState(null); // Para manejar errores

  useEffect(() => {
    const fetchTeams = async () => {
      const data = await getTeamsInArgentinaLeague(2022); // Cambia el año si es necesario
      if (data) {
        setTeams(data); // Almacena los equipos
        setFetchError(null);
        console.log("Datos recibidos:", data);
      } else {
        setFetchError("No se pudieron obtener los equipos"); // Maneja el error
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="App">
      <h1>Equipos de la Liga Profesional Argentina</h1>
      {fetchError && <p>{fetchError}</p>}
      <ul>
        {teams.length > 0 ? (
          teams.map(team => (
            <li key={team.team.id}>
              {team.team.name} - {team.team.country}
            </li>
          ))
        ) : (
          <p>Cargando equipos...</p>
          
        )}
      </ul>
    </div>
  );
}

export default PartidosFutbol;
