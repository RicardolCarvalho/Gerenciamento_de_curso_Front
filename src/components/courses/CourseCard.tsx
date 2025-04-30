import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types";
import { format } from "date-fns";
import { Clock, Star, User } from "lucide-react";

interface CourseCardProps {
  course: Course;
  averageRating?: number;
  totalEvaluations?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  averageRating = 0, 
  totalEvaluations = 0 
}) => {
  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <User className="h-4 w-4" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{course.hours} hours</span>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between border-t">
          <div className="flex items-center gap-1">
            <Star className={`h-4 w-4 ${averageRating > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            <span className="text-sm font-medium">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
            </span>
            {totalEvaluations > 0 && (
              <span className="text-xs text-muted-foreground ml-1">
                ({totalEvaluations})
              </span>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {format(new Date(course.createdAt), 'MMM yyyy')}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;