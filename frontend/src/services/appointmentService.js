import availabilityService from "./availabilityService";
import workshopService from "./workshopService";
import api from "../config/api";

let appointmentsTable = [
  {
    id: 1,
    courseId: "1",
    client: "Ana Garcia",
    workshopId: "corte",
    date: "2026-04-22",
    time: "10:00",
    status: "Pendiente",
    studentId: null,
  },
  {
    id: 2,
    courseId: "1",
    client: "Pedro Sanchez",
    workshopId: "color",
    date: "2026-04-22",
    time: "11:00",
    status: "Confirmada",
    studentId: "student-3",
  },
  {
    id: 3,
    courseId: "2",
    client: "Sonia Castro",
    workshopId: "limpieza-facial",
    date: "2026-04-23",
    time: "09:30",
    status: "Pendiente",
    studentId: null,
  },
  {
    id: 4,
    courseId: "2",
    client: "Mario Alonso",
    workshopId: "maquillaje-social",
    date: "2026-04-23",
    time: "12:30",
    status: "Completada",
    studentId: "student-4",
  },
  {
    id: 5,
    courseId: "3",
    client: "Rocio Vidal",
    workshopId: "masaje-relajante",
    date: "2026-04-24",
    time: "10:30",
    status: "Pendiente",
    studentId: null,
  },
  {
    id: 6,
    courseId: "3",
    client: "Diego Nunez",
    workshopId: "exfoliacion-corporal",
    date: "2026-04-24",
    time: "13:00",
    status: "Confirmada",
    studentId: "student-7",
  },
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function getNextAppointmentId() {
  return (
    appointmentsTable.reduce(
      (maxId, appointment) => Math.max(maxId, appointment.id),
      0,
    ) + 1
  );
}

async function enrichAppointments(appointments) {
  const allWorkshops = await workshopService.getAllWorkshops();

  return appointments.map((appointment) => {
    const workshop = allWorkshops.find(
      (item) => item.id === appointment.workshopId,
    );

    return {
      ...cloneData(appointment),
      workshopTitle: workshop?.title ?? "Taller no encontrado",
    };
  });
}

const appointmentService = {
  getAppointmentsByCourseId: async (courseId) => {
    const { data } = await api.get(`/cita/curso/${courseId}`);
    return data;
  },

  updateAppointmentStatus: async ({ courseId, appointmentId, status }) => {
    await api.put(`/cita/${appointmentId}`, { estado: status });
    return appointmentService.getAppointmentsByCourseId(courseId);
  },

  getAvailableSlots: async (date) => {
    if (!date) {
      return [];
    }

    return availabilityService.getSlotsByDate(date);
  },

  // createAppointment: async (appointmentData) => {
  //   const slot = appointmentData.slotId
  //     ? await availabilityService.getSlotById(appointmentData.slotId)
  //     : null;
  //   const workshopId = appointmentData.workshopId ?? slot?.workshopId ?? "";
  //   const workshop = workshopId
  //     ? await workshopService.getWorkshopById(workshopId)
  //     : null;
  //   const courseId = appointmentData.courseId ?? workshop?.courseId ?? "";
  //   const date = appointmentData.date ?? slot?.date ?? "";
  //   const time = appointmentData.time ?? slot?.time ?? "";
  //   const clientName = (appointmentData.client ?? appointmentData.name ?? "").trim();

  //   const newAppointment = {
  //     id: getNextAppointmentId(),
  //     courseId: courseId ? String(courseId) : "",
  //     client: clientName,
  //     email: appointmentData.email?.trim() ?? "",
  //     workshopId,
  //     slotId: slot?.id ?? appointmentData.slotId ?? null,
  //     date,
  //     time,
  //     status: appointmentData.status ?? "Pendiente",
  //     studentId: appointmentData.studentId ?? null,
  //     allergies: appointmentData.allergies?.trim() ?? "",
  //   };

  //   appointmentsTable = [...appointmentsTable, newAppointment];

  //   const [enrichedAppointment] = await enrichAppointments([newAppointment]);
  //   return enrichedAppointment;
  // },

  createAppointment: async (appointmentData) => {
    // Obtenemos el slot para extraer hora y fecha si existen
    const slot = appointmentData.slotId
      ? await availabilityService.getSlotById(appointmentData.slotId)
      : null;

    const workshopId = appointmentData.workshopId ?? slot?.workshopId ?? "";
    const date = appointmentData.date ?? slot?.date ?? "";
    const time = appointmentData.time ?? slot?.time ?? "";
    const clientName = (appointmentData.client ?? appointmentData.name ?? "").trim();

    const payload = {
      fecha: date,
      hora: time.length === 5 ? `${time}:00` : time, // El backend espera formato HH:mm:ss o HH:mm
      estado: "PENDIENTE",
      cliente: {
        nombre: clientName,
        email: appointmentData.email?.trim() ?? "",
        notasAlergias: appointmentData.allergies?.trim() ?? ""
      },
      taller: {
        idTaller: parseInt(workshopId)
      }
    };

    const { data } = await api.post('/cita', payload);
    return data;
  },

  cancelAppointment: async (appointmentId) => {
    appointmentsTable = appointmentsTable.map((appointment) =>
      appointment.id === appointmentId
        ? {
            ...appointment,
            status: "Cancelada",
          }
        : appointment,
    );

    return cloneData(
      appointmentsTable.find((appointment) => appointment.id === appointmentId) ?? null,
    );
  },

  getAppointmentsByWorkshopId: async (workshopId) => {
    const { data } = await api.get(`/cita/taller/${workshopId}`);
    return data;
  },
};

export default appointmentService;
