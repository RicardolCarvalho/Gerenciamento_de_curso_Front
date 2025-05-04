import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Curso } from '../types';
import { useAuth } from '../auth/AuthContext';

interface CursoFormProps {
  initialData?: Curso;
  onSubmit: (curso: Curso) => Promise<void>;
  isEditing?: boolean;
}

const CursoForm: React.FC<CursoFormProps> = ({ 
  initialData, 
  onSubmit,
  isEditing = false
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Curso>({
    titulo: '',
    descricao: '',
    cargaHoraria: 0,
    instrutor: '',
    emailCriador: user?.email || '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Curso, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        emailCriador: user.email || '',
      }));
    }
  }, [initialData, user]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Curso, string>> = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'O título é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'A descrição é obrigatória';
    }
    
    if (!formData.cargaHoraria || formData.cargaHoraria <= 0) {
      newErrors.cargaHoraria = 'A carga horária deve ser maior que zero';
    }
    
    if (!formData.instrutor.trim()) {
      newErrors.instrutor = 'O nome do instrutor é obrigatório';
    }
    
    if (!formData.emailCriador.trim() || !/\S+@\S+\.\S+/.test(formData.emailCriador)) {
      newErrors.emailCriador = 'E-mail inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cargaHoraria' ? parseInt(value) || 0 : value,
    }));
    
    // Limpar o erro quando o usuário começa a digitar
    if (errors[name as keyof Curso]) {
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
      navigate('/cursos');
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      alert('Ocorreu um erro ao salvar o curso. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        {isEditing ? 'Editar Curso' : 'Novo Curso'}
      </h2>
      
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
          placeholder="Título do curso"
        />
        {errors.titulo && <p className="mt-1 text-sm text-red-500">{errors.titulo}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={4}
          value={formData.descricao}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${errors.descricao ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Descrição detalhada do curso"
        />
        {errors.descricao && <p className="mt-1 text-sm text-red-500">{errors.descricao}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="cargaHoraria" className="block text-sm font-medium text-gray-700 mb-1">
          Carga Horária (horas)
        </label>
        <input
          type="number"
          id="cargaHoraria"
          name="cargaHoraria"
          value={formData.cargaHoraria}
          onChange={handleChange}
          min="1"
          className={`w-full p-2 border rounded-md ${errors.cargaHoraria ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.cargaHoraria && <p className="mt-1 text-sm text-red-500">{errors.cargaHoraria}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="instrutor" className="block text-sm font-medium text-gray-700 mb-1">
          Instrutor
        </label>
        <input
          type="text"
          id="instrutor"
          name="instrutor"
          value={formData.instrutor}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${errors.instrutor ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Nome do instrutor"
        />
        {errors.instrutor && <p className="mt-1 text-sm text-red-500">{errors.instrutor}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="emailCriador" className="block text-sm font-medium text-gray-700 mb-1">
          E-mail do Criador
        </label>
        <input
          type="email"
          id="emailCriador"
          name="emailCriador"
          value={formData.emailCriador}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${errors.emailCriador ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="seu@email.com"
        />
        {errors.emailCriador && <p className="mt-1 text-sm text-red-500">{errors.emailCriador}</p>}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/cursos')}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default CursoForm;