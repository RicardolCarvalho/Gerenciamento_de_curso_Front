import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import CursoForm from '../components/CursoForm';
import { Curso } from '../types';
import { getCursoById, updateCurso } from '../services/cursoService';
import ProtectedRoute from '../components/ProtectedRoute';

const CursoEditar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurso = async () => {
      if (!id) return;
      
      try {
        const data = await getCursoById(id);
        setCurso(data);
      } catch (error) {
        console.error('Erro ao buscar curso:', error);
        setError('Não foi possível carregar os dados do curso. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurso();
  }, [id]);

  const handleSubmit = async (cursoAtualizado: Curso) => {
    if (!id) return;
    
    try {
      await updateCurso(id, cursoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader className="h-8 w-8 animate-spin text-gray-700" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !curso) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">{error || 'Curso não encontrado'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div>
        <h1 className="text-3xl font-bold mb-6">Editar Curso</h1>
        <CursoForm 
          initialData={curso} 
          onSubmit={handleSubmit}
          isEditing
        />
      </div>
    </ProtectedRoute>
  );
};

export default CursoEditar;