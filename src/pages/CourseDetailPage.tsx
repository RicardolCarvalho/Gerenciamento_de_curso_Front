import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseService, evaluationService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { CourseWithEvaluations, Evaluation } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/evaluations/StarRating";
import EvaluationCard from "@/components/evaluations/EvaluationCard";
import EvaluationForm from "@/components/evaluations/EvaluationForm";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Clock,
  Edit,
  Loader2,
  MessageSquarePlus,
  Star,
  Trash2,
  User,
} from "lucide-react";

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [course, setCourse] = useState<CourseWithEvaluations | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmittingEvaluation, setIsSubmittingEvaluation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingEvaluationId, setDeletingEvaluationId] = useState<string | null>(null);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course details");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleDeleteCourse = async () => {
    if (!id || !course) return;
    
    setIsDeleting(true);
    try {
      await courseService.deleteCourse(id);
      toast.success("Course deleted successfully");
      navigate("/courses");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete course";
      toast.error(errorMessage);
      setIsDeleting(false);
    }
  };

  const handleSubmitEvaluation = async (data: any) => {
    if (!id || !user) return;
    
    setIsSubmittingEvaluation(true);
    try {
      const evaluationData = {
        courseId: id,
        studentEmail: user.email,
        rating: data.rating,
        title: data.title,
        description: data.description,
      };
      
      await evaluationService.createEvaluation(evaluationData);
      
      // Refresh course data to show the new evaluation
      const updatedCourse = await courseService.getCourseById(id);
      setCourse(updatedCourse);
      
      toast.success("Evaluation submitted successfully");
      setEvaluationDialogOpen(false);
    } catch (error) {
      toast.error("Failed to submit evaluation");
    } finally {
      setIsSubmittingEvaluation(false);
    }
  };

  const handleDeleteEvaluation = async (evaluationId: string) => {
    setDeletingEvaluationId(evaluationId);
    try {
      await evaluationService.deleteEvaluation(evaluationId);
      
      // Update local state to remove the deleted evaluation
      if (course) {
        const updatedEvaluations = course.evaluations.filter(
          (e) => e.id !== evaluationId
        );
        
        const totalEvaluations = updatedEvaluations.length;
        const averageRating = totalEvaluations > 0
          ? updatedEvaluations.reduce((sum, ev) => sum + ev.rating, 0) / totalEvaluations
          : 0;
        
        setCourse({
          ...course,
          evaluations: updatedEvaluations,
          totalEvaluations,
          averageRating,
        });
      }
      
      toast.success("Evaluation deleted successfully");
    } catch (error) {
      toast.error("Failed to delete evaluation");
    } finally {
      setDeletingEvaluationId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-36 md:col-span-2" />
          <div className="space-y-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
        <div>
          <Skeleton className="h-7 w-40 mb-4" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Course not found</h3>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/courses")}
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">
            Created on {format(new Date(course.createdAt), "PPP")}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/edit/${course.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the course and all associated evaluations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDeleteCourse}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{course.hours} hours</div>
                  <div className="text-sm text-muted-foreground">
                    Course Duration
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{course.instructor}</div>
                  <div className="text-sm text-muted-foreground">
                    Instructor
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {course.averageRating > 0 ? (
                      <>
                        {course.averageRating.toFixed(1)}
                        <span className="text-sm text-muted-foreground">
                          ({course.totalEvaluations} reviews)
                        </span>
                      </>
                    ) : (
                      "No ratings yet"
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Dialog
            open={evaluationDialogOpen}
            onOpenChange={setEvaluationDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full">
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Review this Course</DialogTitle>
                <DialogDescription>
                  Share your experience with this course to help others.
                </DialogDescription>
              </DialogHeader>
              <EvaluationForm
                courseId={course.id}
                onSubmit={handleSubmitEvaluation}
                isSubmitting={isSubmittingEvaluation}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Reviews {course.totalEvaluations > 0 && `(${course.totalEvaluations})`}
        </h2>
        
        {course.evaluations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {course.evaluations.map((evaluation) => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                onDelete={handleDeleteEvaluation}
                isDeleting={deletingEvaluationId === evaluation.id}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Star className="h-16 w-16 text-muted mb-2" />
              <CardTitle className="mb-2">No Reviews Yet</CardTitle>
              <CardDescription>
                Be the first to review this course!
              </CardDescription>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <MessageSquarePlus className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Review this Course</DialogTitle>
                    <DialogDescription>
                      Share your experience with this course to help others.
                    </DialogDescription>
                  </DialogHeader>
                  <EvaluationForm
                    courseId={course.id}
                    onSubmit={handleSubmitEvaluation}
                    isSubmitting={isSubmittingEvaluation}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;