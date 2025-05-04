import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Star, Edit, Trash } from 'lucide-react';
import { Curso } from '../types';
import { useAuth } from '../auth/AuthContext';

interface CursoCardProps {
  curso: Curso;
  onDelete?: (id: string) => void;
}

const CursoCard: React.FC<CursoCardProps> = ({ curso, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-black">{curso.titulo}</h3>
        <p className="text-gray-700 mb-4 line-clamp-2">{curso.descricao}</p>
        
        <div className="flex flex-col space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{curso.cargaHoraria} horas</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{curso.instrutor}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Link 
            to={`/cursos/${curso.id}`}
            className="inline-flex items-center text-sm font-medium text-black border-b-2 border-black hover:border-gray-700 transition-colors"
          >
            Ver detalhes
            <Star className="ml-1 h-4 w-4" />
          </Link>
          
          {isAdmin && (
            <div className="flex space-x-2">
              <Link 
                to={`/cursos/editar/${curso.id}`}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Editar"
              >
                <Edit className="h-5 w-5 text-gray-600" />
              </Link>
              
              {onDelete && (
                <button 
                  onClick={() => curso.id && onDelete(curso.id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Excluir"
                >
                  <Trash className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CursoCard;