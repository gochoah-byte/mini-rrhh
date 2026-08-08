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

    // Simulación de login
    if (email === 'admin@empresa.com' && password === 'admin123') {
      localStorage.setItem('token', 'mock-token-admin');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', 'Roberto Silva');

      navigate('/dashboard');
    } else if (
      email === 'rrhh@empresa.com' &&
      password === 'rrhh123'
    ) {
      localStorage.setItem('token', 'mock-token-hr');
      localStorage.setItem('userRole', 'hr');
      localStorage.setItem('userName', 'Carlos Martínez');

      navigate('/dashboard');
    } else {
      setError(
        'Credenciales incorrectas. Prueba: admin@empresa.com / admin123'
      );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        {/* Encabezado */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <span style={{ fontSize: '48px' }}>👤</span>

          <h1
            style={{
              margin: '8px 0 4px',
              color: '#1e293b'
            }}
          >
            Mi App
          </h1>

          <p
            style={{
              margin: 0,
              color: '#64748b'
            }}
          >
            Inicia sesión
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin}>
          {/* Correo */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="admin@empresa.com"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="********"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '10px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px'
              }}
            >
              {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600
            }}
          >
            Iniciar sesión
          </button>

          {/* Credenciales de prueba */}
          <p
            style={{
              marginTop: '16px',
              fontSize: '12px',
              color: '#94a3b8',
              textAlign: 'center'
            }}
          >
            Demo: admin@empresa.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;