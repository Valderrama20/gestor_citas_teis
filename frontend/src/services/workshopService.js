const API_BASE_URL = "http://localhost:9001";

const workshopService = {
  // Obtener todos los talleres
  getAllWorkshops: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/talleres`);
      if (!response.ok) throw new Error("Error HTTP al cargar talleres");
      return await response.json(); 
    } catch (error) {
      console.error("Error de conexión cargando talleres:", error);
      return [];
    }
  },

  // Obtener talleres por curso
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

  createWorkshop: async (datosTaller) => {
    try {
      const response = await fetch(`${API_BASE_URL}/talleres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosTaller),
      });

      if (!response.ok) {
        // Si el backend da error (ej. 400 o 500), lanzamos el fallo
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // 🛡️ MAGIA AQUÍ: Si llegamos a esta línea, es que el status fue 200 OK.
      // Simplemente devolvemos true y no intentamos leer el "body" 
      // para evitar que JSON.parse explote con textos planos.
      return true;

    } catch (error) {
      console.error("Error creando taller:", error);
      throw error; 
    }
  }
};

export default workshopService;