import axios from 'axios';

const API_KEY = '86380dbde2e27a014833a567ef568590';  // Reemplaza con tu clave API
const BASE_URL = 'https://v3.football.api-sports.io';

const apiFootball = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
});

// Función para obtener los equipos de la liga argentina
export const getTeamsInArgentinaLeague = async (season = 2022) => {
    const ARGENTINA_LEAGUE_ID = 128;  // Liga Profesional Argentina
    try {
      const response = await apiFootball.get(`/teams?league=${ARGENTINA_LEAGUE_ID}&season=${season}`);
      console.log("Respuesta completa de la API:", response);  // Mostrar la respuesta completa
      return response.data.response;
    } catch (error) {
      console.error('Error fetching teams:', error.response ? error.response.data : error.message);
      return null;
    }
};
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