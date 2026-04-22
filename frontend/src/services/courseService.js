const coursesTable = [
  {
    id: "1",
    name: "Peluqueria",
    level: "Grado Medio",
    period: "2025/2026",
    studentCount: 15,
    iconKey: "scissors",
    specialtyDescription: "Corte, colorimetria y tratamientos capilares.",
    workshopPageDescription:
      "Selecciona un taller de ejemplo para ver como podriamos organizar los servicios disponibles.",
  },
  {
    id: "2",
    name: "Cuidado Facial",
    level: "Grado Superior",
    period: "2025/2026",
    studentCount: 12,
    iconKey: "sparkles",
    specialtyDescription: "Higiene, hidratacion y maquillaje profesional.",
    workshopPageDescription:
      "Estos bloques sirven como placeholder para futuras fichas de tratamientos faciales.",
  },
  {
    id: "3",
    name: "Tratamiento Corporal",
    level: "Grado Superior",
    period: "2025/2026",
    studentCount: 10,
    iconKey: "flower",
    specialtyDescription: "Masajes, exfoliaciones y depilacion.",
    workshopPageDescription:
      "Aqui puedes mostrar mas adelante cada servicio corporal con sus horarios y plazas.",
  },
  {
    id: "4",
    name: "Manicura",
    level: "Grado Medio",
    period: "2025/2026",
    studentCount: 9,
    iconKey: "hand",
    specialtyDescription: "Cuidado de unas, esmaltado y pedicura.",
    workshopPageDescription:
      "Estos ejemplos mantienen la misma presentacion del inicio y ayudan a visualizar el flujo.",
  },
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

const courseService = {
  getAllCourses: async () => cloneData(coursesTable),

  getPublicCourses: async () =>
    cloneData(
      coursesTable.map((course) => ({
        id: course.id,
        title: course.name,
        description: course.specialtyDescription,
        iconKey: course.iconKey,
      })),
    ),

  getAdminCourses: async () =>
    cloneData(
      coursesTable.map((course) => ({
        id: course.id,
        name: course.name,
        level: course.level,
        period: course.period,
        studentCount: course.studentCount,
      })),
    ),

  getCourseById: async (courseId) =>
    cloneData(coursesTable.find((course) => course.id === String(courseId)) ?? null),
};

export default courseService;
