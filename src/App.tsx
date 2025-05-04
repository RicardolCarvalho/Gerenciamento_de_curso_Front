import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import CursoDetalhe from './pages/CursoDetalhe';
import CursoNovo from './pages/CursoNovo';
import CursoEditar from './pages/CursoEditar';
import { setAuthToken } from './services/api';

// Configurações do Auth0
const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';

const AppContent: React.FC = () => {
  const { token } = useAuth();
  
  // Configurar o token para todas as requisições da API
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/cursos/:id" element={<CursoDetalhe />} />
        <Route path="/cursos/novo" element={<CursoNovo />} />
        <Route path="/cursos/editar/:id" element={<CursoEditar />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
    >
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </Auth0Provider>
  );
};

export default App;