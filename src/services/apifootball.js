import axios from 'axios';

const API_KEY = '86380dbde2e27a014833a567ef568590';  // Reemplaza con tu clave API
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


  export const getTeamStats = async () => {
    try {
      const response = await apiFootball.get(`/teams/statistics`, {
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
    const response = await apiFootball.get(`/players?team=${teamId}&season=2022`);
    return response.data.response; // Asumiendo que los datos de jugadores vienen en response.data.response
  } catch (error) {
    console.error("Error fetching players", error);
    throw error; // Lanzar el error para que pueda ser manejado donde se llama
  }
};