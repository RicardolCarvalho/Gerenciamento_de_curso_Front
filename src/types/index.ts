// Define types for the course management system

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
};

export type Course = {
  id: string;
  title: string;
  description: string;
  hours: number; // workload/course hours
  instructor: string;
  creatorEmail: string;
  createdAt: string;
  updatedAt: string;
};

export type Evaluation = {
  id: string;
  courseId: string;
  studentEmail: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  createdAt: string;
};

export type CourseWithEvaluations = Course & {
  evaluations: Evaluation[];
  averageRating: number;
  totalEvaluations: number;
};