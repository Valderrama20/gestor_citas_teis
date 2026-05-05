const API_BASE_URL = "http://localhost:9001";

const workshopService = {
  // Obtener todos los talleres
  getAllWorkshops: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/talleres`);
      if (!response.ok) throw new Error("Error HTTP al cargar talleres");
      
      // Spring Boot ya nos devuelve idTaller, nombreTaller, etc.
      return await response.json(); 
    } catch (error) {
      console.error("Error de conexión cargando talleres:", error);
      return [];
    }
  },

  // Obtener talleres por curso (lo usa el panel de administración)
  getWorkshopsByCourseId: async (idCurso) => {
    try {
      const response = await fetch(`${API_BASE_URL}/talleres/curso/${idCurso}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error cargando talleres del curso:", error);
      return [];
    }
  },

  // Obtener un solo taller por su ID
  getWorkshopById: async (idTaller) => {
    try {
      const response = await fetch(`${API_BASE_URL}/talleres/${idTaller}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  // (Opcional) Crear taller si el panel de admin lo necesita
  createWorkshop: async (datosTaller) => {
    try {
      const response = await fetch(`${API_BASE_URL}/talleres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosTaller),
      });
      return response.ok;
    } catch (error) {
      console.error("Error creando taller:", error);
      return false;
    }
  }
};

export default workshopService;