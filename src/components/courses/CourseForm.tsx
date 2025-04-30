import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  hours: z.coerce.number().min(1, "Course hours must be at least 1"),
  instructor: z.string().min(3, "Instructor name must be at least 3 characters"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  onSubmit: (data: CourseFormValues) => void;
  defaultValues?: Partial<Course>;
  isSubmitting: boolean;
  submitText?: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting,
  submitText = "Create Course",
}) => {
  const { user } = useAuth();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      hours: defaultValues?.hours || 0,
      instructor: defaultValues?.instructor || "",
    },
  });

  const handleSubmit = (data: CourseFormValues) => {
    if (!user) return;
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to Web Development" {...field} />
              </FormControl>
              <FormDescription>Enter a descriptive title for your course.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A comprehensive introduction to web development covering HTML, CSS, and JavaScript."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Provide a detailed description of what the course covers.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="40"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Total duration of the course in hours.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormDescription>Name of the course instructor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitText}
        </Button>
      </form>
    </Form>
  );
};

export default CourseForm;