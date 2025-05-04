import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://54.232.22.180:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Função para definir o token de autenticação
export const setAuthToken = (token: string | null) => {
  if (token) {
    console.log('Token definido:', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;