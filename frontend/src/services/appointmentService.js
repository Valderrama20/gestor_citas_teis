import availabilityService from "./availabilityService";
import workshopService from "./workshopService";

// Tabla Mock para mantener funcionando el panel de administración temporalmente
let tablaCitas = [
  {
    id: 1,
    idCurso: "1",
    nombre: "Ana Garcia",
    idTaller: "1", 
    fecha: "Lunes",
    hora: "10:00",
    estado: "PENDIENTE",
    idAlumno: null,
  },
  {
    id: 2,
    idCurso: "1",
    nombre: "Pedro Sanchez",
    idTaller: "2",
    fecha: "Lunes",
    hora: "11:00",
    estado: "Confirmada",
    idAlumno: "alumno-3",
  },
  {
    id: 3,
    idCurso: "2",
    nombre: "Sonia Castro",
    idTaller: "3",
    fecha: "Martes",
    hora: "09:30",
    estado: "PENDIENTE",
    idAlumno: null,
  }
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function getSiguienteIdCita() {
  return (
    tablaCitas.reduce(
      (maxId, cita) => Math.max(maxId, cita.id),
      0,
    ) + 1
  );
}

// Añade el nombre del taller a la cita para el panel admin
async function enriquecerCitas(citas) {
  const todosLosTalleres = await workshopService.getAllWorkshops();

  return citas.map((cita) => {
    const taller = todosLosTalleres.find(
      (item) => String(item.idTaller) === String(cita.idTaller),
    );

    return {
      ...cloneData(cita),
      nombreTaller: taller?.nombreTaller ?? "Taller no encontrado",
    };
  });
}

const appointmentService = {
  getAppointmentsByCourseId: async (idCurso) =>
    enriquecerCitas(
      tablaCitas.filter(
        (cita) => String(cita.idCurso) === String(idCurso),
      ),
    ),

  updateAppointmentStatus: async ({ idCurso, idCita, estado }) => {
    tablaCitas = tablaCitas.map((cita) =>
      cita.id === idCita
        ? {
            ...cita,
            estado,
          }
        : cita,
    );

    return appointmentService.getAppointmentsByCourseId(idCurso);
  },

  getAvailableSlots: async (fecha) => {
    if (!fecha) {
      return [];
    }
    return availabilityService.getSlotsByDate(fecha);
  },

  createAppointment: async (datosCita) => {
    // ==========================================
    // 1. GUARDADO REAL EN SPRING BOOT (MARIADB)
    // ==========================================
    try {
      // Necesitamos la hora exacta obtenida del servicio de horarios
      const horarioElegido = await availabilityService.getSlotById(datosCita.idHorario);
      
      // Adaptación a formato SQL estricto (DATE y TIME)
      // MVP: Mandamos una fecha estática válida. En producción se calcularía el próximo día disponible.
      const fechaParaSQL = "2026-05-20"; 
      const horaParaSQL = horarioElegido ? `${horarioElegido.time}:00` : "09:00:00";

      // Payload con la estructura exacta que exige la API
   const citaParaMariaDB = {
        estado: "PENDIENTE",
        fecha: fechaParaSQL,
        hora: horaParaSQL,
        cliente: {
          nombre: datosCita.nombre,
          email: datosCita.email,
          notasAlergias: datosCita.alergias // 👈 ¡CAMBIADO AQUÍ!
        },
        taller: {
          idTaller: parseInt(datosCita.idTaller)
        }
      };
      console.log("Enviando JSON al backend:", citaParaMariaDB);

      const response = await fetch("http://localhost:9001/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(citaParaMariaDB),
      });

      if (!response.ok) {
        console.error("Fallo al guardar la cita. Código HTTP:", response.status);
      } else {
        console.log("✅ ¡Cita creada con éxito en la API real!");
      }
    } catch (error) {
      console.error("Error de conexión al servidor de Spring Boot:", error);
    }

    // ==========================================
    // 2. MANTENIMIENTO DEL MOCK PARA EL PANEL ADMIN
    // ==========================================
    // Esto permite que el frontend siga funcionando visualmente hasta migrar los GET
    const horario = datosCita.idHorario
      ? await availabilityService.getSlotById(datosCita.idHorario)
      : null;
    const idTaller = datosCita.idTaller ?? horario?.workshopId ?? "";
    const taller = idTaller
      ? await workshopService.getWorkshopById(idTaller)
      : null;
    const idCurso = datosCita.idCurso ?? taller?.idCurso ?? "";
    const fecha = datosCita.fecha ?? horario?.date ?? "";
    const hora = datosCita.hora ?? horario?.time ?? "";
    const nombreCliente = (datosCita.nombre ?? "").trim();

    const nuevaCitaMock = {
      id: getSiguienteIdCita(),
      idCurso: idCurso ? String(idCurso) : "",
      nombre: nombreCliente,
      email: datosCita.email?.trim() ?? "",
      idTaller,
      idHorario: horario?.id ?? datosCita.idHorario ?? null,
      fecha,
      hora,
      estado: datosCita.estado ?? "PENDIENTE",
      idAlumno: datosCita.idAlumno ?? null,
      alergias: datosCita.alergias?.trim() ?? "",
    };

    tablaCitas = [...tablaCitas, nuevaCitaMock];

    const [citaEnriquecida] = await enriquecerCitas([nuevaCitaMock]);
    return citaEnriquecida;
  },

  cancelAppointment: async (idCita) => {
    tablaCitas = tablaCitas.map((cita) =>
      cita.id === idCita
        ? {
            ...cita,
            estado: "Cancelada",
          }
        : cita,
    );

    return cloneData(
      tablaCitas.find((cita) => cita.id === idCita) ?? null,
    );
  },
};

export default appointmentService;