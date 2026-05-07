const API_BASE_URL = "http://localhost:9001";

const availabilityService = {
  getSlotsByWorkshopId: async (workshopId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/horarios-talleres`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const allSlots = await response.json();

      // 1. Filtramos buscando el ID dentro del objeto idTaller
      const filteredSlots = allSlots.filter(
        (slot) => String(slot.idTaller?.idTaller) === String(workshopId)
      );

      // 2. Mapeamos los datos para que el desplegable de React los entienda
      return filteredSlots.map((slot) => {
        // Cortamos los segundos de la hora para que quede "09:00" en vez de "09:00:00"
        const horaInicio = slot.horaApertura.substring(0, 5);
        const horaFin = slot.horaCierre.substring(0, 5);

        return {
          id: String(slot.idHorario), // Usamos el ID correcto del horario
          workshopId: String(slot.idTaller.idTaller),
          label: `${slot.diaSemana} - de ${horaInicio} a ${horaFin}`, // Esto es lo que verá el usuario
          date: slot.diaSemana, // Guardamos "Lunes", "Martes", etc.
          time: horaInicio,
        };
      });

    } catch (error) {
      console.error("Error de conexión con la API de horarios:", error);
      return [];
    }
  },

  getSlotsByDate: async (date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/horarios-talleres`);
      if (!response.ok) throw new Error("Error en la API");
      const allSlots = await response.json();
      
      return allSlots
        .filter((slot) => slot.diaSemana === String(date))
        .map((slot) => ({
          id: String(slot.idHorario),
          workshopId: String(slot.idTaller.idTaller),
          label: `${slot.diaSemana} - de ${slot.horaApertura.substring(0, 5)} a ${slot.horaCierre.substring(0, 5)}`,
          date: slot.diaSemana,
          time: slot.horaApertura.substring(0, 5),
        }));
    } catch (error) {
      return [];
    }
  },

  getSlotById: async (slotId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/horarios-talleres/${slotId}`);
      if (!response.ok) return null;
      
      const slot = await response.json();
      return {
        id: String(slot.idHorario),
        workshopId: String(slot.idTaller.idTaller),
        label: `${slot.diaSemana} - de ${slot.horaApertura.substring(0, 5)} a ${slot.horaCierre.substring(0, 5)}`,
        date: slot.diaSemana,
        time: slot.horaApertura.substring(0, 5),
      };
    } catch (error) {
      return null;
    }
  },
};

export default availabilityService;