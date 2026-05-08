import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      // Acción para iniciar sesión (recibe el JSON devuelto por la API /auth/login)
      login: (data) =>
        set({
          token: data.token,
          usuario: data.usuario,
          isAuthenticated: true,
        }),

      // Acción para cerrar sesión
      logout: () =>
        set({
          token: null,
          usuario: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // Nombre bajo el cual se guardará en localStorage
    }
  )
);
