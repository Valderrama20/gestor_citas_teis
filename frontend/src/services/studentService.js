const studentsTable = [
  { id: "student-1", courseId: "1", name: "Maria Fernandez" },
  { id: "student-2", courseId: "1", name: "Carlos Ruiz" },
  { id: "student-3", courseId: "1", name: "Lucia Gomez" },
  { id: "student-4", courseId: "2", name: "Paula Rey" },
  { id: "student-5", courseId: "2", name: "Noelia Pena" },
  { id: "student-6", courseId: "2", name: "Dario Perez" },
  { id: "student-7", courseId: "3", name: "Adrian Lopez" },
  { id: "student-8", courseId: "3", name: "Martin Lago" },
  { id: "student-9", courseId: "3", name: "Hugo Castro" },
  { id: "student-10", courseId: "4", name: "Sara Lema" },
  { id: "student-11", courseId: "4", name: "Iria Costa" },
  { id: "student-12", courseId: "4", name: "Brais Mendez" },
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

const studentService = {
  getAllStudents: async () => cloneData(studentsTable),

  getStudentsByCourseId: async (courseId) =>
    cloneData(
      studentsTable.filter((student) => student.courseId === String(courseId)),
    ),

  getStudentById: async (studentId) =>
    cloneData(studentsTable.find((student) => student.id === studentId) ?? null),
};

export default studentService;
