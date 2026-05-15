import api from "../config/api";

const courseService = {
  getAllCourses: async () => (await api.get("/CursosController")).data,

  getPublicCourses: async () => (await api.get("/CursosController")).data,

getAdminCourses: async () => {
    const { data } = await api.get("/CursosController");
    return data.map(curso => ({
      id: curso.idCurso,
      name: curso.nombreCurso,
      level: curso.nivel,
      period: curso.cursoAcademico,
      studentCount: curso.alumnos,
      icono: curso.icono,
      icon: curso.icono
    }));
  },

  getCourseById: async (courseId) => (await api.get(`/CursosController/${courseId}`)).data,

  createCourse: async (courseData) => (await api.post(`/CursosController`, courseData)).data,

  deleteCourse: async (courseId) => {
    await api.delete(`/CursosController/${courseId}`);
  },

  updateCourse: async (courseData) => {
    await api.put(`/CursosController`, courseData);
  },
};

export default courseService;
