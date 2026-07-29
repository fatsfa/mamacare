import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setShowMenu(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  if (!token) return null;
  if (location.pathname === '/dashboard') return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-pink-600">
            MamaCare
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex gap-4">
            <Link
              to="/dashboard"
              className={`font-semibold px-4 py-2 rounded-lg transition ${
                isActive('/dashboard')
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-700 hover:bg-pink-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/logs"
              className={`font-semibold px-4 py-2 rounded-lg transition ${
                isActive('/logs') ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-pink-100'
              }`}
            >
              Logs
            </Link>
            <Link
              to="/vaccines"
              className={`font-semibold px-4 py-2 rounded-lg transition ${
                isActive('/vaccines')
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-700 hover:bg-pink-100'
              }`}
            >
              Vaccines
            </Link>
            <Link
              to="/articles"
              className={`font-semibold px-4 py-2 rounded-lg transition ${
                isActive('/articles')
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-700 hover:bg-pink-100'
              }`}
            >
              Articles
            </Link>
            <button
              onClick={logout}
              className="font-semibold px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="sm:hidden text-2xl text-gray-700"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="sm:hidden mt-4 space-y-2 border-t pt-4">
            <Link
              to="/dashboard"
              onClick={() => setShowMenu(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              to="/logs"
              onClick={() => setShowMenu(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-lg"
            >
              Logs
            </Link>
            <Link
              to="/vaccines"
              onClick={() => setShowMenu(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-lg"
            >
              Vaccines
            </Link>
            <Link
              to="/articles"
              onClick={() => setShowMenu(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-lg"
            >
              Articles
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
