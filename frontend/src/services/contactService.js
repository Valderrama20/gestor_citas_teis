import api from '../config/api';

const contactService = {
  sendContactMessage: async ({ nombre, email, mensaje }) => {
    try {
      const response = await api.post('/contacto/enviar', {
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
      });
      return response.data;
    } catch (error) {
      console.error('Error enviando mensaje de contacto:', error);
      throw error;
    }
  },
};

export default contactService;
