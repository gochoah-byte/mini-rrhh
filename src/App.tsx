// src/App.tsx

import type { ReactNode } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from 'react-router-dom';

import Header from './layouts/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import ProtectedRoute from './components/ProtectedRoute';
import type { User } from './types';

// Layout para páginas autenticadas
function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const role = localStorage.getItem('userRole') as User['role'] | null;
  const name = localStorage.getItem('userName') || '';

  const user = role
    ? ({
        id: 1,
        name,
        email: '',
        role,
        token: ''
      } as User)
    : undefined;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc'
      }}
    >
      <Header
        user={user}
        onLogout={handleLogout}
      />

      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Routes>

      {/* Ruta pública */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />

        {/* Empleados */}
        <Route
          path="/empleados"
          element={
            <AppLayout>
              <EmployeesPage />
            </AppLayout>
          }
        />

      </Route>

      {/* Redirigir página principal */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* Página 404 */}
      <Route
        path="*"
        element={
          <div
            style={{
              minHeight: '100vh',
              background: '#f8fafc',
              textAlign: 'center',
              padding: '80px'
            }}
          >
            <h2 style={{ color: '#1e293b' }}>
              404 — Página no encontrada
            </h2>

            <Link to="/dashboard">
              Volver al inicio
            </Link>
          </div>
        }
      />

    </Routes>
  );
}

export default App;