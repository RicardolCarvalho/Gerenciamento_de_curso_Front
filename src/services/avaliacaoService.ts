import api from './api';
import { Avaliacao } from '../types';

export const getAvaliacoesByCurso = async (cursoId: string): Promise<Avaliacao[]> => {
  const response = await api.get(`/avaliacoes/curso/${cursoId}`);
  return response.data;
};

export const createAvaliacao = async (avaliacao: Avaliacao): Promise<Avaliacao> => {
  const response = await api.post('/avaliacoes', avaliacao);
  return response.data;
};

export const deleteAvaliacao = async (id: string): Promise<void> => {
  await api.delete(`/avaliacoes/${id}`);
};