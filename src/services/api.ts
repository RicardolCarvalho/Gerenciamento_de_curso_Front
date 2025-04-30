import { Course, CourseWithEvaluations, Evaluation } from "@/types";
import { mockCourses, mockEvaluations, getCourseWithEvaluations } from "@/lib/mock-data";

// Course API services
export const courseService = {
  // Get all courses
  getAllCourses: async (): Promise<Course[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockCourses]);
      }, 500);
    });
  },

  // Get course by ID with evaluations
  getCourseById: async (id: string): Promise<CourseWithEvaluations> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const courseWithEvaluations = getCourseWithEvaluations(id);
          resolve(courseWithEvaluations);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  // Create new course
  createCourse: async (courseData: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCourse: Course = {
          id: `${mockCourses.length + 1}`,
          ...courseData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // In a real app, this would update the database
        mockCourses.push(newCourse);
        
        resolve(newCourse);
      }, 500);
    });
  },

  // Update course
  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const courseIndex = mockCourses.findIndex((c) => c.id === id);
        if (courseIndex === -1) {
          reject(new Error("Course not found"));
          return;
        }
        
        // Update course
        const updatedCourse = {
          ...mockCourses[courseIndex],
          ...courseData,
          updatedAt: new Date().toISOString(),
        };
        
        mockCourses[courseIndex] = updatedCourse;
        
        resolve(updatedCourse);
      }, 500);
    });
  },

  // Delete course
  deleteCourse: async (id: string): Promise<boolean> => {
    // Simulate API call and check with enrollment service
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check mock enrollment (in real app, this would call Group 2's API)
        const hasEnrollments = Math.random() > 0.7; // 30% chance of having enrollments
        
        if (hasEnrollments) {
          reject(new Error("Cannot delete course with active enrollments"));
          return;
        }
        
        const courseIndex = mockCourses.findIndex((c) => c.id === id);
        if (courseIndex === -1) {
          reject(new Error("Course not found"));
          return;
        }
        
        // Remove course
        mockCourses.splice(courseIndex, 1);
        
        resolve(true);
      }, 500);
    });
  },
};

// Evaluation API services
export const evaluationService = {
  // Get evaluations by course ID
  getEvaluationsByCourse: async (courseId: string): Promise<Evaluation[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const evaluations = mockEvaluations.filter((e) => e.courseId === courseId);
        resolve([...evaluations]);
      }, 500);
    });
  },

  // Create new evaluation
  createEvaluation: async (evaluationData: Omit<Evaluation, "id" | "createdAt">): Promise<Evaluation> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvaluation: Evaluation = {
          id: `${mockEvaluations.length + 1}`,
          ...evaluationData,
          createdAt: new Date().toISOString(),
        };
        
        // In a real app, this would update the database
        mockEvaluations.push(newEvaluation);
        
        resolve(newEvaluation);
      }, 500);
    });
  },

  // Delete evaluation
  deleteEvaluation: async (id: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const evaluationIndex = mockEvaluations.findIndex((e) => e.id === id);
        if (evaluationIndex === -1) {
          reject(new Error("Evaluation not found"));
          return;
        }
        
        // Remove evaluation
        mockEvaluations.splice(evaluationIndex, 1);
        
        resolve(true);
      }, 500);
    });
  },
};