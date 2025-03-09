// src/stores/Auth/Api.ts
import axios from 'axios';

export const ApiBaseUrl = import.meta.env.VITE_CURRENT_ENV === 'dev'
  ? `http://${import.meta.env.VITE_API_BASE_URL}`
  : `https://${import.meta.env.VITE_API_BASE_URL}`;

const api = axios.create({
  baseURL: `${ApiBaseUrl}/api/v1/`,
});

export default api;
