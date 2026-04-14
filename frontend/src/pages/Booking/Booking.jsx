import { useState } from "react";

export default function Booking() {
    const [loading, setLoading] = useState(false)


    const loadSlots = async (date) => {
        setLoading(true);
        try {
            // Ya no hay que verificar if(!response.ok),
            // Axios lanza una excepción automáticamente si hay error (4xx o 5xx)
            const data = await appointmentService.getAvailableSlots(date);
            setSlots(data);
        } catch (error) {
            // El error ya viene formateado por nuestro interceptor
            alert(
                error.response?.data?.message ||
                    "Error al conectar con la peluquería",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Reserva tu cita</h2>
            <p>Aquí irá el calendario y el formulario...</p>
        </div>
    );
}
