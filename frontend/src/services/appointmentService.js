import api from '../config/api';

const appointmentService = {
  // Obtener horas con parámetros de búsqueda (query params)
  getAvailableSlots: async (date) => {
    const response = await api.get('/appointments/available', {
      params: { date } // Axios construye automáticamente: ?date=2024-10-10
    });
    return response.data; // Axios guarda la respuesta del servidor en .data
  },

  // Crear reserva (POST)
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Cancelar cita (DELETE)
  cancelAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

export default appointmentService;