import React from 'react';
import { Trash } from 'lucide-react';
import { Avaliacao } from '../types';
import { useAuth } from '../auth/AuthContext';

interface AvaliacaoCardProps {
  avaliacao: Avaliacao;
  onDelete?: (id: string) => void;
}

const AvaliacaoCard: React.FC<AvaliacaoCardProps> = ({ avaliacao, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  // Renderiza estrelas baseadas na nota
  const renderStars = (nota: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= nota;
      stars.push(
        <span key={i} className={`text-xl ${filled ? 'text-black' : 'text-gray-300'}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold mb-1">{avaliacao.titulo}</h4>
          <div className="flex items-center mb-2">
            {renderStars(avaliacao.nota)}
            <span className="ml-2 text-gray-600">({avaliacao.nota}/5)</span>
          </div>
        </div>
        
        {isAdmin && onDelete && avaliacao.id && (
          <button 
            onClick={() => onDelete(avaliacao.id!)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Excluir avaliação"
          >
            <Trash className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>
      
      <p className="text-gray-700 mb-3">{avaliacao.descricao}</p>
      
      <div className="text-sm text-gray-500">
        Avaliado por: {avaliacao.emailAluno}
      </div>
    </div>
  );
};

export default AvaliacaoCard;