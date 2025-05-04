import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, ArrowLeft, Clock, User, Mail, Edit, Trash } from 'lucide-react';
import { Curso, Avaliacao } from '../types';
import { getCursoById, deleteCurso } from '../services/cursoService';
import { getAvaliacoesByCurso, createAvaliacao, deleteAvaliacao } from '../services/avaliacaoService';
import AvaliacaoCard from '../components/AvaliacaoCard';
import AvaliacaoForm from '../components/AvaliacaoForm';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const CursoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.isAdmin;
  
  const [curso, setCurso] = useState<Curso | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCurso, setDeletingCurso] = useState(false);
  const [deletingAvaliacao, setDeletingAvaliacao] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const cursoData = await getCursoById(id);
        setCurso(cursoData);
        
        const avaliacoesData = await getAvaliacoesByCurso(id);
        setAvaliacoes(avaliacoesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar os detalhes do curso. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCreateAvaliacao = async (avaliacao: Avaliacao) => {
    try {
      const novaAvaliacao = await createAvaliacao(avaliacao);
      setAvaliacoes(prev => [...prev, novaAvaliacao]);
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  };

  const handleDeleteAvaliacao = async (avaliacaoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      setDeletingAvaliacao(avaliacaoId);
      try {
        await deleteAvaliacao(avaliacaoId);
        setAvaliacoes(prev => prev.filter(a => a.id !== avaliacaoId));
      } catch (error) {
        console.error('Erro ao excluir avaliação:', error);
        alert('Não foi possível excluir a avaliação.');
      } finally {
        setDeletingAvaliacao(null);
      }
    }
  };

  const handleDeleteCurso = async () => {
    if (!curso?.id) return;
    
    if (window.confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      setDeletingCurso(true);
      try {
        await deleteCurso(curso.id);
        navigate('/cursos');
      } catch (error) {
        console.error('Erro ao excluir curso:', error);
        alert('Não foi possível excluir o curso. Verifique se não há matrículas associadas.');
        setDeletingCurso(false);
      }
    }
  };

  // Calcula média das notas
  const mediaNotas = avaliacoes.length > 0
    ? (avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length).toFixed(1)
    : '-';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin text-gray-700" />
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">{error || 'Curso não encontrado'}</p>
        <Link 
          to="/cursos"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Voltar para Cursos
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Barra superior com navegação e ações */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/cursos"
          className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar para cursos
        </Link>
        
        {isAuthenticated && isAdmin && (
          <div className="flex space-x-2">
            <Link 
              to={`/cursos/editar/${curso.id}`}
              className="inline-flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Link>
            <button 
              onClick={handleDeleteCurso}
              disabled={deletingCurso}
              className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              {deletingCurso ? (
                <Loader className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Trash className="h-4 w-4 mr-1" />
              )}
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Detalhe do curso */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{curso.titulo}</h1>
          
          <div className="flex flex-wrap gap-y-2 gap-x-6 mb-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{curso.cargaHoraria} horas</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>Instrutor: {curso.instrutor}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              <span>Criado por: {curso.emailCriador}</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-xl mr-1">★</span>
                <span>
                  {mediaNotas} ({avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'})
                </span>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-line">{curso.descricao}</p>
          </div>
        </div>
      </div>

      {/* Seção de avaliações */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
        
        {isAuthenticated && (
          <AvaliacaoForm 
            cursoId={curso.id || ''} 
            onSubmit={handleCreateAvaliacao} 
          />
        )}
        
        {avaliacoes.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-600">Este curso ainda não possui avaliações.</p>
            {isAuthenticated && (
              <p className="mt-2 text-gray-600">Seja o primeiro a avaliar!</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {avaliacoes.map(avaliacao => (
              <div key={avaliacao.id} className="relative">
                {deletingAvaliacao === avaliacao.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                    <Loader className="h-6 w-6 animate-spin text-gray-700" />
                  </div>
                )}
                <AvaliacaoCard 
                  avaliacao={avaliacao}
                  onDelete={isAdmin ? handleDeleteAvaliacao : undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CursoDetalhe;