import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAdmin = false 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requireAdmin && !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Restrito</h2>
          <p className="mb-6 text-gray-700">
            Esta página está disponível apenas para administradores.
          </p>
          <a
            href="/"
            className="inline-block bg-black text-white px-4 py-2 rounded transition-colors hover:bg-gray-800"
          >
            Voltar para a página inicial
          </a>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;