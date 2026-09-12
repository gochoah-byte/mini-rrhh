import { Link, useParams } from "react-router-dom";
import { useEmployee } from "../hooks/useEmployees";

const statusLabels = {
  active: "Activo",
  inactive: "Inactivo",
  on_leave: "En permiso",
};

const roleLabels = {
  employee: "Empleado",
  hr: "Recursos Humanos",
  admin: "Administrador",
};

function EmployeeDetailPage() {
  const { id } = useParams();
  const employeeId = Number(id);
  const { data: employee, isLoading, isError, error } = useEmployee(employeeId);

  if (!id || Number.isNaN(employeeId)) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-medium">ID de empleado inválido.</p>
        <Link
          to="/empleados"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Volver a empleados
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center py-16 text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
        <span>Cargando empleado...</span>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-medium">
          {error instanceof Error
            ? error.message
            : "No se pudo cargar el empleado."}
        </p>
        <Link
          to="/empleados"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Volver a empleados
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/empleados"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          ← Volver
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden text-blue-700 font-bold text-2xl shrink-0">
            {employee.avatarUrl ? (
              <img
                src={employee.avatarUrl}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              employee.name.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <p className="text-sm text-slate-500">Empleado</p>
            <h2 className="text-3xl font-bold text-slate-900">
              {employee.name}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <DetailItem label="Email" value={employee.email} />
            <DetailItem label="Cargo" value={employee.position} />
            <DetailItem label="Departamento" value={employee.department} />
            <DetailItem
              label="Salario"
              value={`$${employee.salary.toLocaleString()}`}
            />
          </div>

          <div className="space-y-4">
            <DetailItem label="Fecha de ingreso" value={employee.hireDate} />
            <DetailItem label="Estado" value={statusLabels[employee.status]} />
            <DetailItem label="Rol" value={roleLabels[employee.role]} />
            <DetailItem
              label="Teléfono"
              value={employee.phone || "No registrado"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 pb-3">
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-base text-slate-800 font-medium">{value}</p>
    </div>
  );
}

export default EmployeeDetailPage;
