import axios from 'axios';

// Creamos la instancia base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos antes de cancelar la petición
});

// Interceptores: El "peaje" por donde pasan todas las peticiones
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí centralizas el manejo de errores (ej. si el servidor cae)
    const message = error.response?.data?.message || 'Ocurrió un error inesperado';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;