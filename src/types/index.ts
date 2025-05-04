export interface Curso {
  id?: string;
  titulo: string;
  descricao: string;
  cargaHoraria: number;
  instrutor: string;
  emailCriador: string;
}

export interface Avaliacao {
  id?: string;
  emailAluno: string;
  nota: number;
  titulo: string;
  descricao: string;
  cursoId: string;
}

export interface User {
  email: string;
  isAdmin: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  loginWithRedirect: () => void;
  logout: () => void;
}