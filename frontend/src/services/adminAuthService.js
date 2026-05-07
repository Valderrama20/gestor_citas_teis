import api from '../config/api';

const adminAuthService = {
  login: async ({ email, password }) => {
    const normalizedEmail = String(email || "").trim();
    const normalizedPassword = String(password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error("Credenciales invalidas");
    }

    // Petición POST real al endpoint de login en Spring Boot
    
    console.log(normalizedEmail, normalizedPassword)

    const response = await api.post('/auth/login', {
      email: normalizedEmail,
      password: normalizedPassword,
    });
    
    // Retornamos toda la respuesta generada en el DTO (token + objeto usuario)
    return response.data;
  },
};

export default adminAuthService;
