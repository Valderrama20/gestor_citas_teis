import api from "../config/api";
import workshopService from "./workshopService";

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
  getAppointmentsByCourseId: async (courseId) =>
    enrichAppointments(
      appointmentsTable.filter(
        (appointment) => appointment.courseId === String(courseId),
      ),
    ),

  updateAppointmentStatus: async ({ courseId, appointmentId, status }) => {
    appointmentsTable = appointmentsTable.map((appointment) =>
      appointment.id === appointmentId
        ? {
            ...appointment,
            status,
          }
        : appointment,
    );

    return appointmentService.getAppointmentsByCourseId(courseId);
  },

  getAvailableSlots: async (date) => {
    const response = await api.get("/appointments/available", {
      params: { date },
    });
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const newAppointment = {
      id: getNextAppointmentId(),
      courseId: String(appointmentData.courseId),
      client: appointmentData.client.trim(),
      email: appointmentData.email?.trim() ?? "",
      workshopId: appointmentData.workshopId,
      date: appointmentData.date,
      time: appointmentData.time,
      status: appointmentData.status ?? "Pendiente",
      studentId: appointmentData.studentId ?? null,
      allergies: appointmentData.allergies?.trim() ?? "",
    };

    appointmentsTable = [...appointmentsTable, newAppointment];

    const [enrichedAppointment] = await enrichAppointments([newAppointment]);
    return enrichedAppointment;
  },

  cancelAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export default appointmentService;
