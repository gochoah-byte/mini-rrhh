// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de login (en clase 3 conectaremos JWT real)
    if (email === 'admin@empresa.com' && password === 'admin123') {
      localStorage.setItem('token', 'mock-token-admin');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', 'Gabriel Ochoa');
      navigate('/dashboard');
    } else if (email === 'rrhh@empresa.com' && password === 'rrhh123') {
      localStorage.setItem('token', 'mock-token-hr');
      localStorage.setItem('userRole', 'hr');
      localStorage.setItem('userName', 'Carlos Martinez');
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas. Prueba: admin@empresa.com / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50
                      to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">👥</span>
            <h1 className="text-2xl font-bold text-slate-900">Mini RRHH</h1>
            <p className="text-slate-500 mt-1">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@empresa.com"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700
                              px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-800 hover:bg-brand-700 text-white
                         font-semibold rounded-lg transition-colors"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Demo: admin@empresa.com / admin123
          </p>
        </div>
      </div>
  );
}

export default LoginPage;