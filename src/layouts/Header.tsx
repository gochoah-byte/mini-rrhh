// src/layouts/Header.tsx

import type { User } from '../types';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}

function Header({ user, onLogout }: HeaderProps) {
  return (
    <header
      style={{
        background: '#1e40af',
        color: 'white',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Logo y nombre */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '24px' }}>👥</span>

        <h1
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
          }}
        >
          Mini RRHH
        </h1>
      </div>

      {/* Navegación */}
      <nav
        style={{
          display: 'flex',
          gap: '4px',
        }}
      >
        {[
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/empleados', label: 'Empleados' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background =
                'rgba(255,255,255,0.15)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Usuario */}
      {user && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '14px' }}>
            Bienvenido, <strong>{user.name}</strong>
          </span>

          <span
            style={{
              background: '#3b82f6',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              textTransform: 'uppercase',
            }}
          >
            {user.role}
          </span>

          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.5)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;