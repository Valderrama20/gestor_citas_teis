import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Booking from './pages/Booking';
import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/reservar", element: <Booking /> },
    ],
  },
  {
    path: "*", // Ruta para manejar errores 404
    element: <h1>404 - Página no encontrada</h1>,
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}