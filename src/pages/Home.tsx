import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, User, Clock } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth();

  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Bem-vindo ao CursoHub
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Sua plataforma para descobrir, avaliar e gerenciar cursos de alta qualidade
        </p>
        
        {isAuthenticated ? (
          <Link 
            to="/cursos" 
            className="inline-block bg-black text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Ver Todos os Cursos
          </Link>
        ) : (
          <button 
            onClick={() => loginWithRedirect()} 
            className="inline-block bg-black text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Entrar para Começar
          </button>
        )}
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">O que oferecemos</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cursos de Qualidade</h3>
              <p className="text-gray-600">
                Acesse uma variedade de cursos com conteúdo de qualidade e instrutores experientes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Avaliações Detalhadas</h3>
              <p className="text-gray-600">
                Veja avaliações de outros alunos e compartilhe sua própria experiência.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                <User className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gerenciamento Completo</h3>
              <p className="text-gray-600">
                Para administradores, oferecemos ferramentas completas para gerenciar cursos e avaliações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center bg-black text-white">
        <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Junte-se à nossa comunidade e descubra os melhores cursos disponíveis.
        </p>
        
        {isAuthenticated ? (
          <Link 
            to="/cursos" 
            className="inline-block bg-white text-black px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Explorar Cursos
          </Link>
        ) : (
          <button 
            onClick={() => loginWithRedirect()} 
            className="inline-block bg-white text-black px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cadastre-se Agora
          </button>
        )}
      </section>
    </div>
  );
};

export default Home;