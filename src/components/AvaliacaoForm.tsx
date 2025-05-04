import React, { useState } from 'react';
import { Avaliacao } from '../types';
import { useAuth } from '../auth/AuthContext';

interface AvaliacaoFormProps {
  cursoId: string;
  onSubmit: (avaliacao: Avaliacao) => Promise<void>;
}

const AvaliacaoForm: React.FC<AvaliacaoFormProps> = ({ cursoId, onSubmit }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Avaliacao>({
    emailAluno: user?.email || '',
    nota: 5,
    titulo: '',
    descricao: '',
    cursoId,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Avaliacao, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Avaliacao, string>> = {};
    
    if (!formData.emailAluno.trim() || !/\S+@\S+\.\S+/.test(formData.emailAluno)) {
      newErrors.emailAluno = 'E-mail inválido';
    }
    
    if (formData.nota < 1 || formData.nota > 5) {
      newErrors.nota = 'A nota deve ser entre 1 e 5';
    }
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'O título é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'A descrição é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nota' ? parseInt(value) : value,
    }));
    
    // Limpar o erro quando o usuário começa a digitar
    if (errors[name as keyof Avaliacao]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setShowForm(false);
      setFormData({
        emailAluno: user?.email || '',
        nota: 5,
        titulo: '',
        descricao: '',
        cursoId,
      });
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      alert('Ocorreu um erro ao salvar a avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none transition-colors duration-200"
        >
          Adicionar Avaliação
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Nova Avaliação</h3>
          
          <div className="mb-4">
            <label htmlFor="emailAluno" className="block text-sm font-medium text-gray-700 mb-1">
              Seu Email
            </label>
            <input
              type="email"
              id="emailAluno"
              name="emailAluno"
              value={formData.emailAluno}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.emailAluno ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="seu@email.com"
            />
            {errors.emailAluno && <p className="mt-1 text-sm text-red-500">{errors.emailAluno}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="nota" className="block text-sm font-medium text-gray-700 mb-1">
              Nota
            </label>
            <select
              id="nota"
              name="nota"
              value={formData.nota}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            >
              <option value={1}>1 - Muito ruim</option>
              <option value={2}>2 - Ruim</option>
              <option value={3}>3 - Regular</option>
              <option value={4}>4 - Bom</option>
              <option value={5}>5 - Excelente</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.titulo ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Título da avaliação"
            />
            {errors.titulo && <p className="mt-1 text-sm text-red-500">{errors.titulo}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Comentário
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              value={formData.descricao}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.descricao ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Descreva sua experiência com o curso"
            />
            {errors.descricao && <p className="mt-1 text-sm text-red-500">{errors.descricao}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AvaliacaoForm;