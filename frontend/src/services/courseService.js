import api from "../config/api";

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

const courseService = {
  getAllCourses: async () => cloneData(coursesTable),

  getPublicCourses: async () => (await api.get("/CursosController")).data,

getAdminCourses: async () => {
    const { data } = await api.get("/CursosController");
    return data.map(curso => ({
      id: curso.idCurso,
      name: curso.nombreCurso,
      level: curso.nivel,
      period: curso.cursoAcademico,
      studentCount: curso.alumnos
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
