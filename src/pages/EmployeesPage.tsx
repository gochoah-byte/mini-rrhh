// src/pages/EmployeesPage.tsx
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type {
  Employee,
  Department,
  EmployeeStatus,
  EmployeeRole,
} from "../types";
import EmployeeCard from "../components/EmployeeCard";
import StatsBadge from "../components/StatsBadge";
import FormField from "../components/FormField";
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "../hooks/useEmployees";

const formFieldClass =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

// Ciclo de estados al hacer clic en la insignia de una tarjeta
const nextStatus: Record<EmployeeStatus, EmployeeStatus> = {
  active: "on_leave",
  on_leave: "inactive",
  inactive: "active",
};

function EmployeesPage() {
  const navigate = useNavigate();

  // Estado de los filtros — esto sigue siendo estado LOCAL (de la UI), no del servidor
  const [search, setSearch] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "">(
    "",
  );
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | "">("");

  // Estado del SERVIDOR: la lista de empleados, filtrada. TanStack Query se encarga
  // de pedirla, cachearla y mantenerla sincronizada — no hay useEffect ni useState local.
  const {
    data,
    isLoading: loading,
    isError,
    error: queryError,
  } = useEmployees({
    search: search || undefined,
    department: selectedDepartment || undefined,
    status: selectedStatus || undefined,
  });
  const employees = data?.data || [];

  // Segunda query, sin filtros — las estadísticas son sobre el TOTAL de empleados,
  // no sobre el filtro activo, así que necesitan su propia lista completa cacheada aparte.
  const { data: allData } = useEmployees({});
  const allEmployees = useMemo(() => allData?.data ?? [], [allData]);
  const totalEmployees = allEmployees.length;
  const activeEmployees = allEmployees.filter(
    (emp) => emp.status === "active",
  ).length;
  const onLeaveEmployees = allEmployees.filter(
    (emp) => emp.status === "on_leave",
  ).length;
  const inactiveEmployees = allEmployees.filter(
    (emp) => emp.status === "inactive",
  ).length;

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPosition, setNewPosition] = useState<string>("");
  const [newDepartment, setNewDepartment] = useState<Department>("Tecnología");
  const [newSalary, setNewSalary] = useState<string>("");
  const [newHireDate, setNewHireDate] = useState<string>("");
  const [newStatus, setNewStatus] = useState<EmployeeStatus>("active");
  const [newRole, setNewRole] = useState<EmployeeRole>("employee");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>("");

  // Memoizamos el handler para no recrearlo en cada render
  const handleSelectEmployee = useCallback(
    (employee: Employee) => {
      navigate(`/empleados/${employee.id}`);
    },
    [navigate],
  );

  const handleDeleteEmployee = useCallback(
    (id: number) => {
      if (!confirm("¿Estás seguro de eliminar este empleado?")) return;
      deleteEmployee.mutate(id);
    },
    [deleteEmployee],
  );

  // Actualiza el estado de un empleado (ciclo Activo → En permiso → Inactivo → Activo)
  const handleToggleStatus = useCallback(
    (employee: Employee) => {
      updateEmployee.mutate({
        id: employee.id,
        data: { status: nextStatus[employee.status] },
      });
    },
    [updateEmployee],
  );

  // Handler para agregar empleado
  const handleAddEmployee = useCallback(() => {
    if (
      !newName.trim() ||
      !newEmail.trim() ||
      !newPosition.trim() ||
      !newHireDate
    )
      return;

    // El API no valida emails duplicados por nosotros, así que lo revisamos
    // del lado del cliente antes de mandar la mutación (misma regla de la Clase 6).
    const emailTaken = allEmployees.some(
      (emp) => emp.email === newEmail.trim(),
    );
    if (emailTaken) {
      setFormError(`Ya existe un empleado con el email ${newEmail.trim()}.`);
      return;
    }

    createEmployee.mutate(
      {
        name: newName.trim(),
        email: newEmail.trim(),
        position: newPosition.trim(),
        department: newDepartment,
        salary: Number(newSalary) || 0,
        hireDate: newHireDate,
        status: newStatus,
        role: newRole,
        ...(newPhone.trim() && { phone: newPhone.trim() }),
        ...(newAvatarUrl.trim() && { avatarUrl: newAvatarUrl.trim() }),
      },
      {
        onSuccess: () => {
          setFormError(null);
          setNewName("");
          setNewEmail("");
          setNewPosition("");
          setNewDepartment("Tecnología");
          setNewSalary("");
          setNewHireDate("");
          setNewStatus("active");
          setNewRole("employee");
          setNewPhone("");
          setNewAvatarUrl("");
          setShowForm(false);
        },
        onError: () => {
          setFormError("No se pudo crear el empleado. Intenta de nuevo.");
        },
      },
    );
  }, [
    allEmployees,
    createEmployee,
    newName,
    newEmail,
    newPosition,
    newDepartment,
    newSalary,
    newHireDate,
    newStatus,
    newRole,
    newPhone,
    newAvatarUrl,
  ]);

  const departments: Department[] = [
    "Tecnología",
    "Recursos Humanos",
    "Finanzas",
    "Operaciones",
    "Ventas",
  ];
  const statuses: EmployeeStatus[] = ["active", "inactive", "on_leave"];
  const statusLabels: Record<EmployeeStatus, string> = {
    active: "Activo",
    inactive: "Inactivo",
    on_leave: "En permiso",
  };
  const roles: EmployeeRole[] = ["employee", "hr", "admin"];
  const roleLabels: Record<EmployeeRole, string> = {
    employee: "Empleado",
    hr: "Recursos Humanos",
    admin: "Administrador",
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Gestión de Empleados
          </h2>
          <p className="text-slate-500 mt-1">
            {loading
              ? "Cargando..."
              : `${employees.length} de ${totalEmployees} empleados`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Agregar empleado
        </button>
      </div>

      {/* Estadísticas */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatsBadge
          label="Total de empleados"
          value={totalEmployees}
          variant="blue"
        />
        <StatsBadge
          label="Empleados activos"
          value={activeEmployees}
          variant="green"
        />
        <StatsBadge
          label="Empleados en permiso"
          value={onLeaveEmployees}
          variant="yellow"
        />
        <StatsBadge
          label="Empleados inactivos"
          value={inactiveEmployees}
          variant="red"
        />
      </div>

      {showForm && (
        <div className="p-4 mb-6 bg-white rounded-lg border border-blue-200">
          <p className="mb-3 font-semibold text-slate-900">Nuevo empleado</p>
          {formError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 mb-4">
            <FormField label="Nombre *">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                autoFocus
                className={formFieldClass}
              />
            </FormField>

            <FormField label="Email *">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="juan.perez@empresa.com"
                className={formFieldClass}
              />
            </FormField>

            <FormField label="Cargo *">
              <input
                type="text"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Ej. Analista de Ventas"
                className={formFieldClass}
              />
            </FormField>

            <FormField label="Departamento *">
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value as Department)}
                className={formFieldClass}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Salario mensual *">
              <input
                type="number"
                min="0"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="Ej. 8500"
                className={formFieldClass}
              />
            </FormField>

            <FormField label="Fecha de ingreso *">
              <input
                type="date"
                value={newHireDate}
                onChange={(e) => setNewHireDate(e.target.value)}
                className={formFieldClass}
              />
            </FormField>

            <FormField label="Estado *">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as EmployeeStatus)}
                className={formFieldClass}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Rol *">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as EmployeeRole)}
                className={formFieldClass}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Teléfono (opcional)">
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Ej. 5555-5555"
                className={formFieldClass}
              />
            </FormField>

            <FormField label="URL de foto (opcional)">
              <input
                type="text"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="https://..."
                className={formFieldClass}
              />
            </FormField>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddEmployee}
              disabled={createEmployee.isPending}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors"
            >
              {createEmployee.isPending ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Barra de filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-end gap-3">
        {/* Búsqueda por texto */}
        <FormField label="Buscar" className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Buscar por nombre, email o cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={formFieldClass}
          />
        </FormField>

        {/* Filtro por departamento */}
        <FormField label="Departamento" className="min-w-[180px]">
          <select
            value={selectedDepartment}
            onChange={(e) =>
              setSelectedDepartment(e.target.value as Department | "")
            }
            className={formFieldClass}
          >
            <option value="">Todos los departamentos</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </FormField>

        {/* Filtro por estado */}
        <FormField label="Estado" className="min-w-[160px]">
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as EmployeeStatus | "")
            }
            className={formFieldClass}
          >
            <option value="">Todos los estados</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </FormField>

        {/* Botón limpiar filtros */}
        {(search || selectedDepartment || selectedStatus) && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedDepartment("");
              setSelectedStatus("");
            }}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
          <span>Cargando empleados...</span>
        </div>
      )}

      {/* Estado de error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">
            Error al cargar los empleados
          </p>
          <p className="text-red-500 text-sm mt-1">
            {(queryError as Error)?.message || "Error desconocido"}
          </p>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && !isError && employees.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No se encontraron empleados con los filtros aplicados.</p>
        </div>
      )}

      {/* Lista de empleados */}
      {!loading && !isError && employees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((employee) => (
            <div key={employee.id} className="relative">
              <button
                onClick={() => handleDeleteEmployee(employee.id)}
                aria-label="Eliminar empleado"
                title="Eliminar empleado"
                className="absolute -top-2.5 -right-2.5 z-10 w-6 h-6 rounded-full border-2 border-white bg-red-500 text-white cursor-pointer text-sm leading-5 shadow-md"
              >
                ×
              </button>
              <EmployeeCard
                employee={employee}
                onSelect={handleSelectEmployee}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;
