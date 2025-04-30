import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const evaluationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please select a rating",
  }),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

interface EvaluationFormProps {
  courseId: string;
  onSubmit: (data: EvaluationFormValues) => void;
  isSubmitting: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
  courseId,
  onSubmit,
  isSubmitting,
}) => {
  const { user } = useAuth();

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      title: "",
      description: "",
      rating: "5",
    },
  });

  const handleSubmit = (data: EvaluationFormValues) => {
    if (!user) return;
    
    const formattedData = {
      ...data,
      rating: parseInt(data.rating) as 1 | 2 | 3 | 4 | 5,
    };
    
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input placeholder="Great course!" {...field} />
              </FormControl>
              <FormDescription>A brief title for your review.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this course..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell others what you thought about this course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-1"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <FormItem
                      key={rating}
                      className="flex items-center space-x-0 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`rating-${rating}`}
                          className="sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={`rating-${rating}`}
                        className={`px-3 py-2 rounded-md cursor-pointer ${
                          field.value === rating.toString()
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {rating}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Rate this course from 1 (poor) to 5 (excellent).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
};

export default EvaluationForm;