import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Evaluation } from "@/types";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { StarRating } from "./StarRating";
import { useAuth } from "@/contexts/AuthContext";

interface EvaluationCardProps {
  evaluation: Evaluation;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  onDelete,
  isDeleting = false,
}) => {
  const { isAdmin, user } = useAuth();
  const isOwner = user?.email === evaluation.studentEmail;
  const canDelete = isAdmin || isOwner;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{evaluation.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              By {evaluation.studentEmail}
            </p>
          </div>
          <StarRating rating={evaluation.rating} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{evaluation.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground">
          {format(new Date(evaluation.createdAt), "PPp")}
        </span>
        {canDelete && onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(evaluation.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EvaluationCard;