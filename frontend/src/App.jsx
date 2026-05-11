import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminCourses from "./pages/AdminCourses";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Talleres from "./pages/Talleres";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "reservar", element: <Booking /> },
      { path: "curso/:courseId/talleres", element: <Talleres /> },
    ],
  },
  {
    path: "/admin",
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    // Agrupamos las rutas protegidas bajo nuestro componente de seguridad
    element: <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_PROFESOR"]} />,
    children: [
      {
        path: "/admin/cursos",
        element: <AdminCourses />,
      },
      {
        path: "/admin/cursos/:courseId",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
