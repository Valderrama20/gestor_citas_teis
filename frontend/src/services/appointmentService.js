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
    workshopId: String(taller.idTaller || ""), 
    idTaller: String(taller.idTaller || ""),
    idCurso: String(taller.idCurso || cita.idCurso || ""),
    taller: taller, 
    original: cita,
  };
}

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
      console.error("Error cargando citas por curso:", error);
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
      console.error("Error actualizando cita:", error);
    }

    return appointmentService.getAppointmentsByCourseId(courseId);
  },

  getAvailableSlots: async (fecha) => {
    if (!fecha) return [];
    return availabilityService.getSlotsByDate(fecha);
  },

  createAppointment: async (datosCita) => {
    let horarioElegido = null;
    if (datosCita.slotId) {
      horarioElegido = await availabilityService.getSlotById(datosCita.slotId);
    }
    
    // 1. LIMPIEZA EXTREMA DE FECHA (Prevenir que se envíe "Lunes")
    let fechaRaw = datosCita.date || datosCita.fecha || horarioElegido?.date || "";
    let fechaReal;
    // Comprobamos si tiene un formato válido YYYY-MM-DD. Si no, usamos la de hoy.
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaRaw)) {
      fechaReal = fechaRaw;
    } else {
      fechaReal = new Date().toISOString().split('T')[0]; 
    }

    // 2. LIMPIEZA EXTREMA DE HORA (Prevenir que se envíe "09:00 a 14:00")
    let horaRaw = String(datosCita.time || datosCita.hora || horarioElegido?.time || "09:00");
    // Cortamos solo los primeros 5 caracteres y le añadimos los segundos (HH:mm:ss)
    let horaReal = horaRaw.substring(0, 5) + ":00";

    const idTaller = datosCita.workshopId || datosCita.idTaller || horarioElegido?.workshopId || "";

    // 3. CONSTRUCCIÓN DEL JSON ESTRICTO
    const citaParaMariaDB = {
      estado: "PENDIENTE",
      fecha: fechaReal,
      hora: horaReal,
      cliente: {
        nombre: datosCita.client || datosCita.nombre || "Cliente Nuevo",
        email: datosCita.email || "sin-email@test.com",
        // ⚠️ He quitado "notasAlergias" temporalmente por si no existe en tu Usuario.java
      },
      taller: {
        idTaller: parseInt(idTaller, 10) || null,
      },
    };

    console.log("Enviando JSON al backend:", citaParaMariaDB);

    try {
      await api.post("/citas", citaParaMariaDB);
      console.log("✅ ¡Cita creada con éxito en la API real!");
    } catch (error) {
      // 4. CHIVATO DE ERRORES: Esto nos dirá qué campo exacto no le gusta a Java
      console.error("Fallo al guardar la cita en BD:", error);
      if (error.response && error.response.data) {
        console.error("🚨 MOTIVO EXACTO DEL RECHAZO (Spring Boot):", error.response.data);
      }
      throw error; 
    }

    // --- MANTENIMIENTO DEL MOCK ---
    const nuevaCitaMock = {
      id: getSiguienteIdCita(),
      idCurso: String(datosCita.idCurso || datosCita.courseId || ""),
      nombre: datosCita.client || "Cliente Nuevo",
      email: datosCita.email || "sin-email@test.com",
      idTaller,
      idHorario: datosCita.slotId || null,
      fecha: fechaReal,
      hora: horaReal,
      estado: "PENDIENTE",
      idAlumno: datosCita.idAlumno || null,
      alergias: datosCita.allergies || "",
    };

    tablaCitas = [...tablaCitas, nuevaCitaMock];
    const [citaEnriquecida] = await enriquecerCitas([nuevaCitaMock]);
    return citaEnriquecida;
  },

  cancelAppointment: async (idCita) => {
    tablaCitas = tablaCitas.map((cita) =>
      cita.id === idCita ? { ...cita, estado: "Cancelada" } : cita
    );
    return cloneData(tablaCitas.find((cita) => cita.id === idCita) ?? null);
  },

  cancelAppointmentByToken: async (token) => {
    if (!token) return { status: "TOKEN_INVALIDO", message: "Token de cancelacion no valido." };
    const { data } = await api.post("/citas/cancelar", { token });
    return data;
  },
};

export default appointmentService;