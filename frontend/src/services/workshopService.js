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
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // 🛡️ LECTURA SEGURA: Primero lo leemos como texto bruto
      const responseText = await response.text();
      console.log("Respuesta bruta del servidor:", responseText);

      // Si el backend no devuelve nada, avisamos claramente
      if (!responseText) {
         throw new Error("El backend devolvió vacío. ¡Spring Boot sigue devolviendo void!");
      }

      // Si hay texto, lo convertimos a JSON
      return JSON.parse(responseText);

    } catch (error) {
      console.error("Error creando taller:", error);
      throw error; 
    }
  }
};

export default workshopService;