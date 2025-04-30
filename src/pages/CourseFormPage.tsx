import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/types";
import CourseForm from "@/components/courses/CourseForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const CourseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Fetch course data if editing
  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      if (id) {
        // Update existing course
        await courseService.updateCourse(id, data);
        toast.success("Course updated successfully");
      } else {
        // Create new course
        const courseData = {
          ...data,
          creatorEmail: user.email,
        };
        await courseService.createCourse(courseData);
        toast.success("Course created successfully");
      }
      navigate("/courses");
    } catch (error) {
      toast.error(id ? "Failed to update course" : "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48 mb-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/courses")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? "Edit Course" : "Add New Course"}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Update Course Details" : "Course Details"}</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm
            onSubmit={handleSubmit}
            defaultValues={course || undefined}
            isSubmitting={isSubmitting}
            submitText={id ? "Update Course" : "Create Course"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseFormPage;