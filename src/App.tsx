import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import CourseListPage from "@/pages/CourseListPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import CourseFormPage from "@/pages/CourseFormPage";
import UserEvaluationsPage from "@/pages/UserEvaluationsPage";

// Componente de rota protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Componente de rota administrativa
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<AppLayout />}>
            {/* Rotas protegidas */}
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CourseListPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetailPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/my-evaluations"
              element={
                <ProtectedRoute>
                  <UserEvaluationsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Rotas administrativas */}
            <Route
              path="/courses/new"
              element={
                <AdminRoute>
                  <CourseFormPage />
                </AdminRoute>
              }
            />
            
            <Route
              path="/courses/edit/:id"
              element={
                <AdminRoute>
                  <CourseFormPage />
                </AdminRoute>
              }
            />
            
            {/* Redireciona para home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
      
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;