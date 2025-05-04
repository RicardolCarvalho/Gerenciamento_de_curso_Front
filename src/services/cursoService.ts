import api from './api';
import { Curso } from '../types';

export const getCursos = async (): Promise<Curso[]> => {
  const response = await api.get('/cursos');
  return response.data;
};

export const getCursoById = async (id: string): Promise<Curso> => {
  const response = await api.get(`/cursos/${id}`);
  return response.data;
};

export const createCurso = async (curso: Curso): Promise<Curso> => {
  const response = await api.post('/cursos', curso);
  return response.data;
};

export const updateCurso = async (id: string, curso: Curso): Promise<Curso> => {
  const response = await api.put(`/cursos/${id}`, curso);
  return response.data;
};

export const deleteCurso = async (id: string): Promise<void> => {
  await api.delete(`/cursos/${id}`);
};