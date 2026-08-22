// src/pages/DashboardPage.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockEmployees } from '../utils/mockData';

function DashboardPage() {
  const userName = localStorage.getItem('userName') || 'usuario';
  const [showWelcome, setShowWelcome] = useState(true);
  const total = mockEmployees.length;

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  const active = mockEmployees.filter(
    (e) => e.status === 'active'
  ).length;

  const onLeave = mockEmployees.filter(
    (e) => e.status === 'on_leave'
  ).length;

  const stats = [
    {
      label: 'Total empleados',
      value: total,
      color: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    {
      label: 'Activos',
      value: active,
      color: 'bg-green-100',
      textColor: 'text-green-800'
    },
    {
      label: 'En permiso',
      value: onLeave,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    }
  ];

  return (
    <div className="p-6">
      {showWelcome && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800">
              Bienvenido, {userName}
            </h2>
          </div>
        </div>
      )}
      <h2 className="mb-6 text-2xl font-bold text-slate-800">
        Resumen de tu equipo
      </h2>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`min-w-[160px] flex-1 rounded-xl p-6 ${stat.color}
                        transition-shadow duration-200 hover:shadow-lg`}
          >
            <p className={`mb-1 text-sm ${stat.textColor}`}>
              {stat.label}
            </p>
            <p className={`text-4xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          to="/empleados"
          className="rounded-md bg-brand-800 px-5 py-2.5 text-sm text-white
                     transition-colors hover:bg-brand-700"
        >
          Ver empleados
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;