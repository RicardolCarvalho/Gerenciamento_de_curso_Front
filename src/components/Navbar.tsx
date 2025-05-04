import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-xl">CursoHub</span>
            </Link>
          </div>

          {/* Links para telas maiores */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cursos" className="hover:text-gray-300 px-3 py-2 transition-colors duration-200">
              Cursos
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-400">
                  {user?.email} {user?.isAdmin ? '(Admin)' : ''}
                </span>
                <button 
                  onClick={() => logout()} 
                  className="flex items-center space-x-1 bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => loginWithRedirect()} 
                className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                Entrar
              </button>
            )}
          </div>

          {/* Menu para dispositivos móveis */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Menu móvel */}
        {menuOpen && (
          <div className="md:hidden py-2 space-y-2 pb-4">
            <Link 
              to="/cursos" 
              className="block px-4 py-2 hover:bg-gray-900 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Cursos
            </Link>
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-400">
                  {user?.email} {user?.isAdmin ? '(Admin)' : ''}
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-900 transition-colors duration-200"
                >
                  Sair
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  loginWithRedirect();
                  setMenuOpen(false);
                }} 
                className="block w-full text-left px-4 py-2 hover:bg-gray-900 transition-colors duration-200"
              >
                Entrar
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;