import api from '../config/api';

const workshopService = {
  // Obtener todos los talleres
  getAllWorkshops: async () => {
    try {
      const response = await api.get('/talleres');
      return response.data; 
    } catch (error) {
      console.error("Error de conexión cargando talleres:", error);
      return [];
    }
  },

  // Obtener talleres por curso
  getWorkshopsByCourseId: async (idCurso) => {
    try {
      const response = await api.get(`/talleres/curso/${idCurso}`);
      return response.data;
    } catch (error) {
      console.error("Error cargando talleres del curso:", error);
      return [];
    }
  },

  // Obtener un solo taller por su ID
  getWorkshopById: async (idTaller) => {
    try {
      const response = await api.get(`/talleres/${idTaller}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  createWorkshop: async (datosTaller) => {
    try {
      const response = await api.post('/talleres', datosTaller);

      if (response.data === '') {
         throw new Error("El backend devolvió vacío. ¡Spring Boot sigue devolviendo void!");
      }

      return response.data;
    } catch (error) {
      console.error("Error creando taller:", error);
      throw error; 
    }
  }
};

export default workshopService;