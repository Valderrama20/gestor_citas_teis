export const adminCourses = [
  {
    id: "1",
    name: "Peluqueria",
    level: "Grado Medio",
    period: "2025/2026",
    studentCount: 15,
  },
  {
    id: "2",
    name: "Estetica Integral",
    level: "Grado Superior",
    period: "2025/2026",
    studentCount: 12,
  },
  {
    id: "3",
    name: "Barberia y Estilismo",
    level: "Grado Medio",
    period: "2025/2026",
    studentCount: 10,
  },
];

export const appointmentsByCourse = {
  "1": [
    {
      id: 1,
      client: "Ana Garcia",
      workshop: "Corte y peinado",
      date: "2026-04-22",
      time: "10:00",
      status: "Pendiente",
      student: "",
    },
    {
      id: 2,
      client: "Pedro Sanchez",
      workshop: "Coloracion",
      date: "2026-04-22",
      time: "11:00",
      status: "Asignada",
      student: "Lucia Gomez",
    },
  ],
  "2": [
    {
      id: 3,
      client: "Sonia Castro",
      workshop: "Limpieza facial",
      date: "2026-04-23",
      time: "09:30",
      status: "Pendiente",
      student: "",
    },
    {
      id: 4,
      client: "Mario Alonso",
      workshop: "Maquillaje social",
      date: "2026-04-23",
      time: "12:30",
      status: "Asignada",
      student: "Paula Rey",
    },
  ],
  "3": [
    {
      id: 5,
      client: "Rocio Vidal",
      workshop: "Arreglo de barba",
      date: "2026-04-24",
      time: "10:30",
      status: "Pendiente",
      student: "",
    },
    {
      id: 6,
      client: "Diego Nunez",
      workshop: "Perfilado y degradado",
      date: "2026-04-24",
      time: "13:00",
      status: "Asignada",
      student: "Adrian Lopez",
    },
  ],
};

export const studentsByCourse = {
  "1": ["Maria Fernandez", "Carlos Ruiz", "Lucia Gomez"],
  "2": ["Paula Rey", "Noelia Pena", "Dario Perez"],
  "3": ["Adrian Lopez", "Martin Lago", "Hugo Castro"],
};

export function getCourseById(courseId) {
  return adminCourses.find((course) => course.id === courseId) ?? null;
}
