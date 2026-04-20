import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
import Talleres from "./pages/Talleres";

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
    path: "*",
    element: <h1>404 - Pagina no encontrada</h1>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
