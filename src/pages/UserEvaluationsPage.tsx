import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseService, evaluationService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Course, Evaluation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EvaluationCard from "@/components/evaluations/EvaluationCard";
import { toast } from "sonner";
import { ExternalLink, MessageSquarePlus } from "lucide-react";

const UserEvaluationsPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [coursesMap, setCoursesMap] = useState<Map<string, Course>>(new Map());
  const [loading, setLoading] = useState(true);
  const [deletingEvaluationId, setDeletingEvaluationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch all courses
        const coursesData = await courseService.getAllCourses();
        setCourses(coursesData);
        
        // Create a map for quick course lookups
        const courseMap = new Map<string, Course>();
        coursesData.forEach((course) => {
          courseMap.set(course.id, course);
        });
        setCoursesMap(courseMap);
        
        // Collect all evaluations by the current user
        const userEvaluations: Evaluation[] = [];
        for (const course of coursesData) {
          const evaluationsData = await evaluationService.getEvaluationsByCourse(course.id);
          const currentUserEvaluations = evaluationsData.filter(
            (evaluation) => evaluation.studentEmail === user.email
          );
          userEvaluations.push(...currentUserEvaluations);
        }
        
        setEvaluations(userEvaluations);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load evaluations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteEvaluation = async (evaluationId: string) => {
    setDeletingEvaluationId(evaluationId);
    try {
      await evaluationService.deleteEvaluation(evaluationId);
      
      // Update local state
      setEvaluations(evaluations.filter((e) => e.id !== evaluationId));
      
      toast.success("Evaluation deleted successfully");
    } catch (error) {
      toast.error("Failed to delete evaluation");
    } finally {
      setDeletingEvaluationId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Evaluations</h1>
        <p className="text-muted-foreground">
          View and manage your course evaluations
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : evaluations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {evaluations.map((evaluation) => (
            <Card key={evaluation.id} className="overflow-hidden">
              <CardHeader className="pb-2 border-b">
                <Link
                  to={`/courses/${evaluation.courseId}`}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <span>
                    {coursesMap.get(evaluation.courseId)?.title || "Unknown Course"}
                  </span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </CardHeader>
              <CardContent className="pt-4 pb-0">
                <EvaluationCard
                  evaluation={evaluation}
                  onDelete={handleDeleteEvaluation}
                  isDeleting={deletingEvaluationId === evaluation.id}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CardTitle className="mb-2">No Evaluations Yet</CardTitle>
            <p className="text-muted-foreground mb-6">
              You haven't submitted any course evaluations yet.
            </p>
            <Link to="/courses">
              <Button>
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Browse Courses to Review
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserEvaluationsPage;