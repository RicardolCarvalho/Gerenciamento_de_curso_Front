import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../auth/AuthContext';
import { Loader } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin mx-auto text-black" />
          <p className="mt-4 text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} CursoHub - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;