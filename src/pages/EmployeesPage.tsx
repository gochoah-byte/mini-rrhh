import { useCallback, useEffect, useState } from 'react';
import type {
  Employee,
  Department,
  EmployeeStatus,
  EmployeeRole
} from '../types';

import { useEmployeeStore } from '../store/employeeStore';
import EmployeeCard from '../components/EmployeeCard';
import StatsBadge from '../components/StatsBadge';
import FormField from '../components/FormField';

const formFieldClass =
  'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const nextStatus: Record<EmployeeStatus, EmployeeStatus> = {
  active: 'on_leave',
  on_leave: 'inactive',
  inactive: 'active'
};

function EmployeesPage() {
  // Estado global
  const {
    employees,
    loading,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployeeStore();

  // Estado de filtros
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | ''>('');
  const [selectedStatus, setSelectedStatus] =
    useState<EmployeeStatus | ''>('');

  // Estado del formulario
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newDepartment, setNewDepartment] =
    useState<Department>('Tecnología');
  const [newSalary, setNewSalary] = useState('');
  const [newHireDate, setNewHireDate] = useState('');
  const [newStatus, setNewStatus] =
    useState<EmployeeStatus>('active');
  const [newRole, setNewRole] =
    useState<EmployeeRole>('employee');
  const [newPhone, setNewPhone] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  // Cargar empleados
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Filtrar empleados
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      !selectedDepartment ||
      emp.department === selectedDepartment;

    const matchesStatus =
      !selectedStatus ||
      emp.status === selectedStatus;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesStatus
    );
  });

  // Estadísticas
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (emp) => emp.status === 'active'
  ).length;

  const onLeaveEmployees = employees.filter(
    (emp) => emp.status === 'on_leave'
  ).length;

  const inactiveEmployees = employees.filter(
    (emp) => emp.status === 'inactive'
  ).length;

  // Seleccionar empleado
  const handleSelectEmployee = useCallback(
    (employee: Employee) => {
      alert(
        `Empleado: ${employee.name}\n` +
        `Cargo: ${employee.position}\n` +
        `Departamento: ${employee.department}`
      );
    },
    []
  );

  // Eliminar empleado
  const handleDeleteEmployee = useCallback(
    (id: number) => {
      const confirmDelete = window.confirm(
        '¿Estás seguro de eliminar este empleado?'
      );

      if (!confirmDelete) return;

      deleteEmployee(id);
    },
    [deleteEmployee]
  );

  // Cambiar estado
  const handleToggleStatus = useCallback(
    (employee: Employee) => {
      updateEmployee(employee.id, {
        status: nextStatus[employee.status]
      });
    },
    [updateEmployee]
  );

  // Agregar empleado
  const handleAddEmployee = useCallback(() => {
    if (
      !newName.trim() ||
      !newEmail.trim() ||
      !newPosition.trim() ||
      !newHireDate
    ) {
      setError('Completa los campos obligatorios.');
      return;
    }

    const added = addEmployee({
      name: newName.trim(),
      email: newEmail.trim(),
      position: newPosition.trim(),
      department: newDepartment,
      salary: Number(newSalary) || 0,
      hireDate: newHireDate,
      status: newStatus,
      role: newRole,
      ...(newPhone.trim() && {
        phone: newPhone.trim()
      }),
      ...(newAvatarUrl.trim() && {
        avatarUrl: newAvatarUrl.trim()
      })
    });

    if (!added) {
      setError('El correo ya está registrado.');
      return;
    }

    setNewName('');
    setNewEmail('');
    setNewPosition('');
    setNewDepartment('Tecnología');
    setNewSalary('');
    setNewHireDate('');
    setNewStatus('active');
    setNewRole('employee');
    setNewPhone('');
    setNewAvatarUrl('');
    setError('');
    setShowForm(false);
  }, [
    addEmployee,
    newName,
    newEmail,
    newPosition,
    newDepartment,
    newSalary,
    newHireDate,
    newStatus,
    newRole,
    newPhone,
    newAvatarUrl
  ]);

  const departments: Department[] = [
    'Tecnología',
    'Recursos Humanos',
    'Finanzas',
    'Operaciones',
    'Ventas'
  ];

  const statuses: EmployeeStatus[] = [
    'active',
    'inactive',
    'on_leave'
  ];

  const statusLabels: Record<EmployeeStatus, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    on_leave: 'En permiso'
  };

  const roles: EmployeeRole[] = [
    'employee',
    'hr',
    'admin'
  ];

  const roleLabels: Record<EmployeeRole, string> = {
    employee: 'Empleado',
    hr: 'Recursos Humanos',
    admin: 'Administrador'
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Gestión de Empleados
          </h2>

          <p className="text-sm text-slate-500">
            {filteredEmployees.length} de {employees.length} empleados
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          + Agregar empleado
        </button>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 flex flex-wrap gap-4">
        <StatsBadge
          label="Total"
          value={totalEmployees}
          variant="blue"
        />

        <StatsBadge
          label="Activos"
          value={activeEmployees}
          variant="green"
        />

        <StatsBadge
          label="En permiso"
          value={onLeaveEmployees}
          variant="yellow"
        />

        <StatsBadge
          label="Inactivos"
          value={inactiveEmployees}
          variant="red"
        />
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Agregar empleado
          </h3>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            <FormField label="Nombre *">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className={formFieldClass}
              />
            </FormField>

            <FormField label="Email *">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="juan@empresa.com"
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
                onChange={(e) =>
                  setNewDepartment(
                    e.target.value as Department
                  )
                }
                className={formFieldClass}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Salario mensual">
              <input
                type="number"
                min="0"
                value={newSalary}
                onChange={(e) =>
                  setNewSalary(e.target.value)
                }
                placeholder="Ej. 8500"
                className={formFieldClass}
              />
            </FormField>

            <FormField label="Fecha de ingreso *">
              <input
                type="date"
                value={newHireDate}
                onChange={(e) =>
                  setNewHireDate(e.target.value)
                }
                className={formFieldClass}
              />
            </FormField>

            <FormField label="Estado *">
              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(
                    e.target.value as EmployeeStatus
                  )
                }
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
                onChange={(e) =>
                  setNewRole(
                    e.target.value as EmployeeRole
                  )
                }
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
                onChange={(e) =>
                  setNewPhone(e.target.value)
                }
                placeholder="Ej. 5555-5555"
                className={formFieldClass}
              />
            </FormField>

            <FormField label="URL de foto (opcional)">
              <input
                type="text"
                value={newAvatarUrl}
                onChange={(e) =>
                  setNewAvatarUrl(e.target.value)
                }
                placeholder="https://..."
                className={formFieldClass}
              />
            </FormField>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleAddEmployee}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              Guardar
            </button>

            <button
              onClick={() => {
                setShowForm(false);
                setError('');
              }}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <FormField
          label="Buscar"
          className="flex-1 min-w-[220px]"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o cargo..."
            className={formFieldClass}
          />
        </FormField>

        <FormField
          label="Departamento"
          className="min-w-[180px]"
        >
          <select
            value={selectedDepartment}
            onChange={(e) =>
              setSelectedDepartment(
                e.target.value as Department | ''
              )
            }
            className={formFieldClass}
          >
            <option value="">
              Todos los departamentos
            </option>

            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Estado"
          className="min-w-[160px]"
        >
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value as EmployeeStatus | ''
              )
            }
            className={formFieldClass}
          >
            <option value="">
              Todos los estados
            </option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </FormField>

        {(search || selectedDepartment || selectedStatus) && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedDepartment('');
              setSelectedStatus('');
            }}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-200"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="py-12 text-center text-slate-500">
          <p>Cargando empleados...</p>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && filteredEmployees.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          <p>
            No se encontraron empleados con los filtros aplicados.
          </p>
        </div>
      )}

      {/* Lista */}
      {!loading && filteredEmployees.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="relative">
              <button
                onClick={() =>
                  handleDeleteEmployee(employee.id)
                }
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 text-sm text-white shadow-md transition hover:bg-red-600"
                title="Eliminar empleado"
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