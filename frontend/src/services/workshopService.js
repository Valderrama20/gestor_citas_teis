const workshopsTable = [
  {
    id: "corte",
    courseId: "1",
    title: "Corte y peinado",
    description: "Cortes clasicos, brushing y acabados para el dia a dia.",
    iconKey: "scissors",
  },
  {
    id: "color",
    courseId: "1",
    title: "Coloracion",
    description: "Tintes, matices y retoque de raiz con asesoria previa.",
    iconKey: "sparkles",
  },
  {
    id: "tratamiento-capilar",
    courseId: "1",
    title: "Tratamiento capilar",
    description: "Hidratacion profunda, mascarillas y cuidado del cuero cabelludo.",
    iconKey: "droplets",
  },
  {
    id: "recogidos",
    courseId: "1",
    title: "Recogidos",
    description: "Peinados para eventos, ondas y recogidos de practica.",
    iconKey: "waves",
  },
  {
    id: "limpieza-facial",
    courseId: "2",
    title: "Limpieza facial",
    description: "Rutina completa con exfoliacion, vapor y extraccion suave.",
    iconKey: "sparkles",
  },
  {
    id: "maquillaje-social",
    courseId: "2",
    title: "Maquillaje social",
    description: "Pruebas de maquillaje de dia, tarde y eventos sencillos.",
    iconKey: "brush",
  },
  {
    id: "hidratacion-intensiva",
    courseId: "2",
    title: "Hidratacion intensiva",
    description: "Mascarillas y activos adaptados a cada tipo de piel.",
    iconKey: "droplets",
  },
  {
    id: "diseno-cejas",
    courseId: "2",
    title: "Diseno de cejas",
    description: "Perfilado basico y armonizacion del rostro.",
    iconKey: "flower",
  },
  {
    id: "masaje-relajante",
    courseId: "3",
    title: "Masaje relajante",
    description: "Sesiones enfocadas en bienestar, descarga y relajacion.",
    iconKey: "flower",
  },
  {
    id: "exfoliacion-corporal",
    courseId: "3",
    title: "Exfoliacion corporal",
    description: "Preparacion de la piel con productos y maniobras suaves.",
    iconKey: "droplets",
  },
  {
    id: "depilacion-basica",
    courseId: "3",
    title: "Depilacion basica",
    description: "Practicas guiadas por zonas con protocolo higienico.",
    iconKey: "sparkles",
  },
  {
    id: "ritual-spa",
    courseId: "3",
    title: "Ritual spa",
    description: "Experiencia combinada con envoltura y masaje final.",
    iconKey: "waves",
  },
  {
    id: "manicura-basica",
    courseId: "4",
    title: "Manicura basica",
    description: "Limpieza, limado, cuticulas y esmaltado tradicional.",
    iconKey: "hand",
  },
  {
    id: "pedicura",
    courseId: "4",
    title: "Pedicura",
    description: "Cuidado integral del pie con acabado estetico.",
    iconKey: "flower",
  },
  {
    id: "semipermanente",
    courseId: "4",
    title: "Semipermanente",
    description: "Aplicacion de color de larga duracion y retirada segura.",
    iconKey: "sparkles",
  },
  {
    id: "nail-art",
    courseId: "4",
    title: "Nail art",
    description: "Disenos sencillos para practicas creativas del alumnado.",
    iconKey: "brush",
  },
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

const workshopService = {
  getAllWorkshops: async () => cloneData(workshopsTable),

  getWorkshopsByCourseId: async (courseId) =>
    cloneData(
      workshopsTable.filter((workshop) => workshop.courseId === String(courseId)),
    ),

  getWorkshopById: async (workshopId) =>
    cloneData(workshopsTable.find((workshop) => workshop.id === workshopId) ?? null),
};

export default workshopService;
