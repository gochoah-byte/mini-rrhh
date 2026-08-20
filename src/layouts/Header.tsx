import { Link, useLocation } from "react-router-dom";
import type { User } from "../types";

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/empleados", label: "Empleados" },
];

function Header({ user, onLogout }: HeaderProps) {
  const { pathname } = useLocation();
  const displayUser = user ?? {
    name: "Roberto Silva",
    role: "admin",
  };

  return (
    <header className="bg-brand-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-0 min-h-16 flex flex-col gap-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👥</span>
          <span className="font-bold text-xl tracking-tight">Mini RRHH</span>
        </div>

        <nav className="flex w-full justify-center items-center gap-1 sm:w-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith(item.to)
                  ? "bg-white/20 text-white"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap justify-center items-center gap-3 sm:justify-end">
          <span className="text-sm text-white/80">
            Bienvenido, {displayUser.name}
          </span>
          <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full uppercase font-medium">
            {displayUser.role}
          </span>
          <button
            onClick={onLogout}
            className="text-sm text-white/75 hover:text-white border border-white/30 hover:border-white/60 px-3 py-1.5 rounded-md transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
