import React from 'react';
import CursoForm from '../components/CursoForm';
import { Curso } from '../types';
import { createCurso } from '../services/cursoService';
import ProtectedRoute from '../components/ProtectedRoute';

const CursoNovo: React.FC = () => {
  const handleSubmit = async (curso: Curso) => {
    try {
      await createCurso(curso);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      throw error;
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div>
        <h1 className="text-3xl font-bold mb-6">Novo Curso</h1>
        <CursoForm onSubmit={handleSubmit} />
      </div>
    </ProtectedRoute>
  );
};

export default CursoNovo;