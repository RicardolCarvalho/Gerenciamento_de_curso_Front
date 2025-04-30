import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import { BookOpen } from "lucide-react";

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to CourseHub</h1>
          <p className="text-muted-foreground">
            Please log in to access your courses
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;