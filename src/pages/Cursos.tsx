import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader, Search } from 'lucide-react';
import CursoCard from '../components/CursoCard';
import { Curso } from '../types';
import { getCursos, deleteCurso } from '../services/cursoService';
import { useAuth } from '../auth/AuthContext';

const Cursos: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await getCursos();
        setCursos(data);
        setFilteredCursos(data);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        setError('Não foi possível carregar os cursos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCursos(cursos);
    } else {
      const filtered = cursos.filter(curso => 
        curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.instrutor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCursos(filtered);
    }
  }, [searchTerm, cursos]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      setDeleting(id);
      try {
        await deleteCurso(id);
        setCursos(prevCursos => prevCursos.filter(curso => curso.id !== id));
      } catch (error) {
        console.error('Erro ao excluir curso:', error);
        alert('Não foi possível excluir o curso. Verifique se não há matrículas associadas.');
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-gray-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Cursos Disponíveis</h1>
        
        {isAuthenticated && isAdmin && (
          <Link 
            to="/cursos/novo"
            className="inline-flex items-center bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            Novo Curso
          </Link>
        )}
      </div>
      
      {/* Barra de pesquisa */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar cursos..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredCursos.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Nenhum curso encontrado.</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-black hover:underline"
            >
              Limpar pesquisa
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCursos.map(curso => (
            <div key={curso.id} className="relative">
              {deleting === curso.id && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                  <Loader className="h-8 w-8 animate-spin text-gray-700" />
                </div>
              )}
              <CursoCard 
                curso={curso} 
                onDelete={isAdmin ? handleDelete : undefined}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cursos;