import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, usuario } = useAuthStore();

  // Si no hay sesión iniciada, enviar al login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Opcional: Verificación de roles (si configuras allowedRoles al usar el componente)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = usuario?.roles || [];
    const hasRequiredRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      // Si no tiene permisos, lo devolvemos a la raíz o a un "No autorizado"
      return <Navigate to="/" replace />;
    }
  }

  // Si pasa todas las validaciones, renderizar los componentes hijos (Outlet)
  return <Outlet />;
}
