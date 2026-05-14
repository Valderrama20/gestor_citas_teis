import api from "../config/api";
import availabilityService from "./availabilityService";
import workshopService from "./workshopService";

const STATUS_LABELS = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
};

function formatAppointmentStatus(status) {
  if (!status) return "Pendiente";
  const normalized = String(status).toUpperCase();
  return STATUS_LABELS[normalized] ?? status;
}

function normalizeBackendCita(cita) {
  const taller = cita.taller ?? {};
  const cliente = cita.cliente ?? {};

  const date = cita.fecha ?? "";  
  const time = cita.hora ? String(cita.hora).slice(0, 5) : "";
  const status = formatAppointmentStatus(cita.estado);

  return {
    id: cita.idCita,
    client: cliente.nombre || cliente.email || "Cliente desconocido",
    workshopTitle: taller.nombreTaller || "Taller no encontrado",
    date,
    time,
    status,
    // IMPORTANTE: Extraemos el idTaller del objeto taller que viene de Java
    workshopId: String(taller.idTaller || ""), 
    idTaller: String(taller.idTaller || ""),
    idCurso: String(taller.idCurso || cita.idCurso || ""),
    // Guardamos el objeto taller completo para que el Dashboard pueda leerlo
    taller: taller, 
    original: cita,
  };
}

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
  getAppointmentsByCourseId: async (idCurso) => {
    try {
      const { data } = await api.get(`/citas/curso/${idCurso}`);
      return (data ?? []).map(normalizeBackendCita);
    } catch (error) {
      const status = error?.response?.status;
      if (status) {
        console.error("Error cargando citas por curso:", status);
      } else {
        console.error("Error de conexión cargando citas por curso:", error);
      }
      return [];
    }
  },

  updateAppointmentStatus: async ({ courseId, appointment, appointmentId, estado }) => {
    const payload = appointment?.original
      ? { ...appointment.original, estado }
      : {
          idCita: appointmentId,
          estado,
          cliente: { email: appointment?.client ?? "" },
          taller: { idTaller: parseInt(appointment?.workshopId ?? "", 10) || null },
        };

    try {
      await api.put('/citas', payload);
    } catch (error) {
      const status = error?.response?.status;
      if (status) {
        console.error("Error actualizando estado de la cita, código HTTP:", status);
      } else {
        console.error("Error de conexión actualizando cita:", error);
      }
    }

    return appointmentService.getAppointmentsByCourseId(courseId);
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
      const horarioElegido = await availabilityService.getSlotById(datosCita.slotId);
      
      // Adaptación a formato SQL estricto (DATE y TIME)
      // MVP: Mandamos una fecha estática válida. En producción se calcularía el próximo día disponible.
      const fechaParaSQL = "2026-05-20";
      const horaParaSQL = horarioElegido ? `${horarioElegido.time}:00` : "09:00:00";

      const idTaller = datosCita.workshopId ?? (horarioElegido?.workshopId ?? "");

      const citaParaMariaDB = {
        estado: "PENDIENTE",
        fecha: fechaParaSQL,
        hora: horaParaSQL,
        cliente: {
          nombre: datosCita.client,
          email: datosCita.email,
          notasAlergias: datosCita.allergies,
        },
        taller: {
          idTaller: parseInt(idTaller, 10) || null,
        },
      };
      console.log("Enviando JSON al backend:", citaParaMariaDB);

      await api.post("/citas", citaParaMariaDB);
      console.log("✅ ¡Cita creada con éxito en la API real!");
    } catch (error) {
      const status = error?.response?.status;
      if (status) {
        console.error("Fallo al guardar la cita. Código HTTP:", status);
      } else {
        console.error("Error de conexión al servidor de Spring Boot:", error);
      }
    }

    // ==========================================
    // 2. MANTENIMIENTO DEL MOCK PARA EL PANEL ADMIN
    // ==========================================
    // Esto permite que el frontend siga funcionando visualmente hasta migrar los GET
    const horario = datosCita.slotId
      ? await availabilityService.getSlotById(datosCita.slotId)
      : null;
    const idTaller = datosCita.workshopId ?? horario?.workshopId ?? "";
    const taller = idTaller
      ? await workshopService.getWorkshopById(idTaller)
      : null;
    const idCurso = datosCita.idCurso ?? taller?.idCurso ?? "";
    const fecha = datosCita.date ?? horario?.date ?? "";
    const hora = datosCita.time ?? horario?.time ?? "";
    const nombreCliente = (datosCita.client ?? "").trim();

    const nuevaCitaMock = {
      id: getSiguienteIdCita(),
      idCurso: idCurso ? String(idCurso) : "",
      nombre: nombreCliente,
      email: datosCita.email?.trim() ?? "",
      idTaller,
      idHorario: horario?.id ?? datosCita.slotId ?? null,
      fecha,
      hora,
      estado: datosCita.estado ?? "PENDIENTE",
      idAlumno: datosCita.idAlumno ?? null,
      alergias: datosCita.allergies?.trim() ?? "",
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

  cancelAppointmentByToken: async (token) => {
    if (!token) {
      return { status: "TOKEN_INVALIDO", message: "Token de cancelacion no valido." };
    }

    const { data } = await api.post("/citas/cancelar", { token });
    return data;
  },
};

export default appointmentService;