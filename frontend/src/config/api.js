import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Creamos la instancia base. Apuntamos al 8080 (puerto estándar de Spring Boot)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos antes de cancelar la petición
});

// Interceptor de Peticiones: Añade el Token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    // Obtenemos el token directamente del estado sin usar hooks
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptores: El "peaje" por donde pasan todas las peticiones
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Si el token expiró o es inválido, forzamos cierre de sesión
      useAuthStore.getState().logout();
    }
    // Aquí centralizas el manejo de errores
    const message = error.response?.data?.message || 'Ocurrió un error inesperado';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
