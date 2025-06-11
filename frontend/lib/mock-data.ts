// // Mock data for the university portal

// export type User = {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: "student" | "instructor" | "admin"
//   enrolledModules: string[] // Just module IDs, no sections
// }

// export type Course = {
//   id: string
//   code: string
//   title: string
//   description: string
//   department: string
//   credits: number
//   modules: Module[]
//   image: string
// }

// export type Module = {
//   id: string
//   courseId: string
//   code: string
//   title: string
//   description: string
//   instructor: string
//   startDate: string
//   endDate: string
//   capacity: number
//   enrolled: number
//   schedule: string
//   location: string
// }

// // Mock user data
// export const currentUser: User = {
//   id: "user1",
//   firstName: "John",
//   lastName: "Doe",
//   email: "student@university.edu",
//   role: "student",
//   enrolledModules: ["module1", "module3", "module5"],
// }

// // Mock courses data
// export const courses: Course[] = [
//   {
//     id: "course1",
//     code: "CS101",
//     title: "Introduction to Computer Science",
//     description:
//       "A foundational course covering the basic principles of computer science, including algorithms, data structures, and problem-solving techniques.",
//     department: "Computer Science",
//     credits: 4,
//     image: "/placeholder.svg?height=200&width=300",
//     modules: [
//       {
//         id: "module1",
//         courseId: "course1",
//         code: "CS101-A",
//         title: "Programming Fundamentals",
//         description:
//           "Introduction to programming concepts using Python, covering variables, control structures, functions, and basic data structures.",
//         instructor: "Dr. Alan Turing",
//         startDate: "2025-09-01",
//         endDate: "2025-12-15",
//         capacity: 30,
//         enrolled: 28,
//         schedule: "Mon, Wed 10:00-11:30",
//         location: "Tech Building, Room 101",
//       },
//       {
//         id: "module2",
//         courseId: "course1",
//         code: "CS101-B",
//         title: "Computer Systems",
//         description: "Overview of computer architecture, operating systems, and networks.",
//         instructor: "Dr. Grace Hopper",
//         startDate: "2025-09-02",
//         endDate: "2025-12-16",
//         capacity: 30,
//         enrolled: 25,
//         schedule: "Tue, Thu 13:00-14:30",
//         location: "Tech Building, Room 102",
//       },
//     ],
//   },
//   {
//     id: "course2",
//     code: "MATH201",
//     title: "Calculus I",
//     description: "Introduction to differential and integral calculus of functions of one variable, with applications.",
//     department: "Mathematics",
//     credits: 4,
//     image: "/placeholder.svg?height=200&width=300",
//     modules: [
//       {
//         id: "module3",
//         courseId: "course2",
//         code: "MATH201-A",
//         title: "Limits and Derivatives",
//         description: "Study of limits, continuity, and differentiation of algebraic and transcendental functions.",
//         instructor: "Dr. Katherine Johnson",
//         startDate: "2025-09-01",
//         endDate: "2025-12-15",
//         capacity: 35,
//         enrolled: 32,
//         schedule: "Mon, Wed, Fri 9:00-10:00",
//         location: "Science Building, Room 201",
//       },
//       {
//         id: "module4",
//         courseId: "course2",
//         code: "MATH201-B",
//         title: "Integration and Applications",
//         description: "Study of integration techniques and applications of the definite integral.",
//         instructor: "Dr. John Nash",
//         startDate: "2025-09-02",
//         endDate: "2025-12-16",
//         capacity: 35,
//         enrolled: 30,
//         schedule: "Tue, Thu 11:00-12:30",
//         location: "Science Building, Room 202",
//       },
//     ],
//   },
//   {
//     id: "course3",
//     code: "BIO150",
//     title: "Introduction to Biology",
//     description: "Survey of biological principles, including cell biology, genetics, evolution, and ecology.",
//     department: "Biology",
//     credits: 3,
//     image: "/placeholder.svg?height=200&width=300",
//     modules: [
//       {
//         id: "module5",
//         courseId: "course3",
//         code: "BIO150-A",
//         title: "Cell Biology and Genetics",
//         description: "Study of cell structure and function, and the principles of inheritance.",
//         instructor: "Dr. Rosalind Franklin",
//         startDate: "2025-09-01",
//         endDate: "2025-12-15",
//         capacity: 40,
//         enrolled: 38,
//         schedule: "Tue, Thu 9:00-10:30",
//         location: "Life Sciences Building, Room 101",
//       },
//       {
//         id: "module6",
//         courseId: "course3",
//         code: "BIO150-B",
//         title: "Evolution and Ecology",
//         description:
//           "Study of the mechanisms of evolution and the interactions between organisms and their environment.",
//         instructor: "Dr. Charles Darwin",
//         startDate: "2025-09-02",
//         endDate: "2025-12-16",
//         capacity: 40,
//         enrolled: 35,
//         schedule: "Tue, Thu 15:00-16:30",
//         location: "Life Sciences Building, Room 102",
//       },
//     ],
//   },
//   {
//     id: "course4",
//     code: "PSYCH110",
//     title: "Introduction to Psychology",
//     description:
//       "Survey of the major areas of psychology, including research methods, biological bases of behavior, cognition, and social psychology.",
//     department: "Psychology",
//     credits: 3,
//     image: "/placeholder.svg?height=200&width=300",
//     modules: [
//       {
//         id: "module7",
//         courseId: "course4",
//         code: "PSYCH110-A",
//         title: "Research Methods and Biological Bases",
//         description: "Introduction to research methods in psychology and the biological bases of behavior.",
//         instructor: "Dr. B.F. Skinner",
//         startDate: "2025-09-01",
//         endDate: "2025-12-15",
//         capacity: 45,
//         enrolled: 40,
//         schedule: "Mon, Wed 11:00-12:30",
//         location: "Social Sciences Building, Room 101",
//       },
//       {
//         id: "module8",
//         courseId: "course4",
//         code: "PSYCH110-B",
//         title: "Cognition and Social Psychology",
//         description: "Study of cognitive processes and social influences on behavior.",
//         instructor: "Dr. Jean Piaget",
//         startDate: "2025-09-02",
//         endDate: "2025-12-16",
//         capacity: 45,
//         enrolled: 42,
//         schedule: "Tue, Thu 9:00-10:30",
//         location: "Social Sciences Building, Room 102",
//       },
//     ],
//   },
// ]
