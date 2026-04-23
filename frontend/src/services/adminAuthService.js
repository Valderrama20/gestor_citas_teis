function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

const adminAuthService = {
  login: async ({ email, password }) => {
    const normalizedEmail = String(email || "").trim();
    const normalizedPassword = String(password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error("Credenciales invalidas");
    }

    return cloneData({
      token: "demo-token",
      user: {
        id: "teacher-1",
        name: "Profesor",
        email: normalizedEmail,
        role: "admin",
      },
    });
  },
};

export default adminAuthService;
