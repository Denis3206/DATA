import axios from 'axios';

const API_KEY = '86380dbde2e27a014833a567ef568590';  // Reemplaza con tu clave API  denis: 86380dbde2e27a014833a567ef568590// pesesinho: 804bf79de2847d26c1d85c5bc9f1f731
const BASE_URL = 'https://v3.football.api-sports.io';
const ligaArgentinaId = 128; // ID de la liga argentina
const season = 2022;
const argentinosJuniorsId=458;

export const apiFootball = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
});

// Función para obtener los equipos de la liga argentina
/* export const getTeamsInArgentinaLeague = async (season = 2022) => {
    const ARGENTINA_LEAGUE_ID = 128;  // Liga Profesional Argentina
    try {
      const response = await apiFootball.get(`/teams?league=${ARGENTINA_LEAGUE_ID}&season=${season}`);
      console.log("Respuesta completa de la API:", response);  // Mostrar la respuesta completa
      return response.data.response;
    } catch (error) {
      console.error('Error fetching teams:', error.response ? error.response.data : error.message);
      return null;
    }
}; */
export const getStandingsInArgentinaLeague = async (season = 2022) => {
    const ARGENTINA_LEAGUE_ID = 128; // Liga Profesional Argentina
    try {
      const response = await apiFootball.get(`/standings?league=${ARGENTINA_LEAGUE_ID}&season=${season}`);
      console.log("Respuesta completa de la API:", response); // Mostrar la respuesta completa
      return response.data.response;
    } catch (error) {
      console.error('Error fetching standings:', error.response ? error.response.data : error.message);
      return null;
    }
  };
  export const getJugadores = async () => {
    try {
      const response = await apiFootball.get('/players', {
        params: {
          league: ligaArgentinaId,
          season: season,
        },
      });
      return response.data.response; // Retornamos los jugadores
    } catch (error) {
      console.error('Error al obtener los jugadores:', error);
      throw error; // Lanza el error para manejarlo en el componente si es necesario
    }
  };


  export const getTeamStats = async (teamId) => { 
    try {
      // Cambia la URL al endpoint correcto de tu API para obtener las estadísticas del equipo
      const response = await fetch(`https://v3.football.api-sports.io/teams/${teamId}/stats`, {
        headers: {
          'x-apisports-key': API_KEY, // Asegúrate de incluir tu clave API
          'Content-Type': 'application/json' // Puede que necesites este encabezado
        }
      });
  
      // Verifica que la respuesta sea exitosa
      if (!response.ok) {
        throw new Error(`Error al obtener estadísticas del equipo: ${response.statusText}`);
      }
  
      // Convierte la respuesta en JSON
      const data = await response.json();
      
      // Asegúrate de devolver los datos en la forma que necesitas
      return data; // Cambia esto si es necesario para acceder a la estructura de datos
    } catch (error) {
      console.error("Error al obtener estadísticas del equipo:", error);
      return null; // Devuelve null en caso de error
    }
  };

  export const getTeamPlayers = async () => {
    try {
      const response = await apiFootball.get(`/players`, {
        params: {
          league: ligaArgentinaId,
          season: season,
          team: argentinosJuniorsId,
        },
      });
      return response.data.response;
    } catch (error) {
      console.error('Error al obtener las estadísticas del equipo:', error);
      return null;
    }
  };

  export const fetchPlayers = async (teamId) => {
    try {
      const response = await fetch(`https://api.apifootball.com/v2/players?team_id=${teamId}&season=${season}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '86380dbde2e27a014833a567ef568590' // Asegúrate de usar tu clave API aquí
        }
      });
  
      // Verifica el estado de la respuesta
      if (!response.ok) {
        const errorMessage = await response.text(); // Captura el mensaje de error
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }
  
      const data = await response.json();
      return data.map(player => ({
        id: player.player_id,
        name: player.player_name,
        team: player.team_id // Asegúrate de que esto coincida con tu estructura
      }));
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error; // Lanza el error para manejarlo donde se llama a esta función
    }
  };