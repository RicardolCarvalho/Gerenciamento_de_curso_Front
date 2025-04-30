import { Course, Evaluation, User } from "@/types";

// Mock users with different roles
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "USER",
  },
];

// Mock courses data
export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description:
      "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    hours: 40,
    instructor: "John Smith",
    creatorEmail: "admin@example.com",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description:
      "Explore advanced patterns and best practices for building scalable React applications.",
    hours: 30,
    instructor: "Jane Doe",
    creatorEmail: "admin@example.com",
    createdAt: "2025-04-02T14:30:00Z",
    updatedAt: "2025-04-02T14:30:00Z",
  },
  {
    id: "3",
    title: "Database Design Principles",
    description:
      "Learn how to design efficient and scalable database schemas for various applications.",
    hours: 35,
    instructor: "Robert Johnson",
    creatorEmail: "admin@example.com",
    createdAt: "2025-04-03T09:15:00Z",
    updatedAt: "2025-04-03T09:15:00Z",
  },
  {
    id: "4",
    title: "Mobile App Development with React Native",
    description:
      "Build cross-platform mobile applications using React Native and JavaScript.",
    hours: 45,
    instructor: "Sarah Williams",
    creatorEmail: "admin@example.com",
    createdAt: "2025-04-04T11:45:00Z",
    updatedAt: "2025-04-04T11:45:00Z",
  },
];

// Mock evaluations data
export const mockEvaluations: Evaluation[] = [
  {
    id: "1",
    courseId: "1",
    studentEmail: "user@example.com",
    rating: 5,
    title: "Excellent course!",
    description:
      "This course provided a solid foundation in web development. The instructor was very knowledgeable.",
    createdAt: "2025-04-10T15:20:00Z",
  },
  {
    id: "2",
    courseId: "1",
    studentEmail: "student1@example.com",
    rating: 4,
    title: "Very informative",
    description:
      "I learned a lot from this course, but some sections could have been more detailed.",
    createdAt: "2025-04-11T09:30:00Z",
  },
  {
    id: "3",
    courseId: "2",
    studentEmail: "user@example.com",
    rating: 5,
    title: "Highly recommended",
    description:
      "The advanced React patterns were exactly what I needed to improve my development skills.",
    createdAt: "2025-04-12T14:15:00Z",
  },
  {
    id: "4",
    courseId: "3",
    studentEmail: "student2@example.com",
    rating: 3,
    title: "Good but could be better",
    description:
      "The content was good, but the pace was a bit slow. More practical examples would be helpful.",
    createdAt: "2025-04-13T10:45:00Z",
  },
  {
    id: "5",
    courseId: "4",
    studentEmail: "user@example.com",
    rating: 4,
    title: "Great practical knowledge",
    description:
      "The hands-on approach was very effective. I'm now confident in building React Native apps.",
    createdAt: "2025-04-14T16:00:00Z",
  },
];

// Helper function to get course with evaluations
export const getCourseWithEvaluations = (
  courseId: string
): Course & { evaluations: Evaluation[]; averageRating: number; totalEvaluations: number } => {
  const course = mockCourses.find((c) => c.id === courseId);
  if (!course) throw new Error("Course not found");

  const evaluations = mockEvaluations.filter((e) => e.courseId === courseId);
  const totalEvaluations = evaluations.length;
  const averageRating = totalEvaluations > 0
    ? evaluations.reduce((sum, ev) => sum + ev.rating, 0) / totalEvaluations
    : 0;

  return {
    ...course,
    evaluations,
    averageRating,
    totalEvaluations,
  };
};