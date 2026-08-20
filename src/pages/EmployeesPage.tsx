import { useCallback, useEffect, useState } from "react";
import type { Department, Employee, EmployeeStatus } from "../types";
import { mockEmployees } from "../utils/mockData";
import EmployeeCard from "../components/EmployeeCard";
import FormField from "../components/FormField";
import StatsBadge from "../components/StatsBadge";

type EmployeeRole = "admin" | "hr" | "employee";

const formFieldClass =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "">("");
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | "">("");
  const [showForm, setShowForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newDepartment, setNewDepartment] = useState<Department>("Tecnología");
  const [newSalary, setNewSalary] = useState("");
  const [newHireDate, setNewHireDate] = useState("");
  const [newStatus, setNewStatus] = useState<EmployeeStatus>("active");
  const [newRole, setNewRole] = useState<EmployeeRole>("employee");
  const [newPhone, setNewPhone] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  const departments: Department[] = [
    "Tecnología",
    "Recursos Humanos",
    "Finanzas",
    "Operaciones",
    "Ventas",
  ];

  const statuses: EmployeeStatus[] = ["active", "inactive", "on_leave"];
  const roles: EmployeeRole[] = ["admin", "hr", "employee"];

  const statusLabels: Record<EmployeeStatus, string> = {
    active: "Activo",
    inactive: "Inactivo",
    on_leave: "En permiso",
  };

  const roleLabels: Record<EmployeeRole, string> = {
    admin: "Administrador",
    hr: "Recursos Humanos",
    employee: "Empleado",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmployees(mockEmployees);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const term = search.toLowerCase();
    return (
      (employee.name.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.position.toLowerCase().includes(term)) &&
      (!selectedDepartment || employee.department === selectedDepartment) &&
      (!selectedStatus || employee.status === selectedStatus)
    );
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((employee) => employee.status === "active").length;
  const onLeaveEmployees = employees.filter((employee) => employee.status === "on_leave").length;
  const inactiveEmployees = employees.filter((employee) => employee.status === "inactive").length;

  const resetForm = () => {
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
  };

  const handleAddEmployee = () => {
    if (!newName || !newEmail || !newPosition || !newSalary || !newHireDate) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const employee = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      position: newPosition,
      department: newDepartment,
      salary: Number(newSalary),
      hireDate: newHireDate,
      status: newStatus,
      role: newRole,
      phone: newPhone,
      avatarUrl: newAvatarUrl,
    } as Employee;

    setEmployees((currentEmployees) => [...currentEmployees, employee]);
    resetForm();
    setShowForm(false);
  };

  const handleDeleteEmployee = useCallback((id: number) => {
    if (!confirm("¿Estás seguro de eliminar este empleado?")) return;
    setEmployees((currentEmployees) => currentEmployees.filter((employee) => employee.id !== id));
  }, []);

  const handleSelectEmployee = useCallback((employee: Employee) => {
    alert(
      `Empleado: ${employee.name}\nCargo: ${employee.position}\nDepartamento: ${employee.department}`,
    );
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Empleados</h2>
          <p className="text-slate-500 mt-1">
            {filteredEmployees.length} de {employees.length} empleados
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Agregar empleado
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:flex-wrap sm:gap-4">
        <StatsBadge label="Total de empleados" value={totalEmployees} variant="blue" />
        <StatsBadge label="Empleados activos" value={activeEmployees} variant="green" />
        <StatsBadge label="Empleados en permiso" value={onLeaveEmployees} variant="yellow" />
        <StatsBadge label="Empleados inactivos" value={inactiveEmployees} variant="red" />
      </div>

      {showForm && (
        <div className="p-4 mb-6 bg-white rounded-lg border border-blue-200 shadow-sm">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 mb-4">
            <FormField label="Nombre *">
              <input type="text" value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Ej. Juan Pérez" autoFocus className={formFieldClass} />
            </FormField>
            <FormField label="Email *">
              <input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} placeholder="juan.perez@empresa.com" className={formFieldClass} />
            </FormField>
            <FormField label="Cargo *">
              <input type="text" value={newPosition} onChange={(event) => setNewPosition(event.target.value)} placeholder="Ej. Analista de Ventas" className={formFieldClass} />
            </FormField>
            <FormField label="Departamento *">
              <select value={newDepartment} onChange={(event) => setNewDepartment(event.target.value as Department)} className={formFieldClass}>
                {departments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
            </FormField>
            <FormField label="Salario mensual *">
              <input type="number" min="0" value={newSalary} onChange={(event) => setNewSalary(event.target.value)} placeholder="Ej. 8500" className={formFieldClass} />
            </FormField>
            <FormField label="Fecha de ingreso *">
              <input type="date" value={newHireDate} onChange={(event) => setNewHireDate(event.target.value)} className={formFieldClass} />
            </FormField>
            <FormField label="Estado *">
              <select value={newStatus} onChange={(event) => setNewStatus(event.target.value as EmployeeStatus)} className={formFieldClass}>
                {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
              </select>
            </FormField>
            <FormField label="Rol *">
              <select value={newRole} onChange={(event) => setNewRole(event.target.value as EmployeeRole)} className={formFieldClass}>
                {roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
              </select>
            </FormField>
            <FormField label="Teléfono (opcional)">
              <input type="text" value={newPhone} onChange={(event) => setNewPhone(event.target.value)} placeholder="Ej. 5555-5555" className={formFieldClass} />
            </FormField>
            <FormField label="URL de foto (opcional)">
              <input type="text" value={newAvatarUrl} onChange={(event) => setNewAvatarUrl(event.target.value)} placeholder="https://..." className={formFieldClass} />
            </FormField>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddEmployee} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">Guardar</button>
            <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <FormField label="Buscar" className="w-full sm:flex-1 sm:min-w-[220px]">
          <input type="text" placeholder="Buscar por nombre, email o cargo..." value={search} onChange={(event) => setSearch(event.target.value)} className={formFieldClass} />
        </FormField>
        <FormField label="Departamento" className="w-full sm:min-w-[180px]">
          <select value={selectedDepartment} onChange={(event) => setSelectedDepartment(event.target.value as Department | "")} className={formFieldClass}>
            <option value="">Todos los departamentos</option>
            {departments.map((department) => <option key={department} value={department}>{department}</option>)}
          </select>
        </FormField>
        <FormField label="Estado" className="w-full sm:min-w-[160px]">
          <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as EmployeeStatus | "")} className={formFieldClass}>
            <option value="">Todos los estados</option>
            {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
          </select>
        </FormField>
        {(search || selectedDepartment || selectedStatus) && (
          <button onClick={() => { setSearch(""); setSelectedDepartment(""); setSelectedStatus(""); }} className="w-full sm:w-auto px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition-colors">
            Limpiar filtros
          </button>
        )}
      </div>

      {loading && <div className="text-center py-12 text-slate-500"><p>Cargando empleados...</p></div>}
      {!loading && filteredEmployees.length === 0 && <div className="text-center py-12 text-slate-500"><p>No se encontraron empleados con los filtros aplicados.</p></div>}
      {!loading && filteredEmployees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="relative">
              <button onClick={() => handleDeleteEmployee(employee.id)} aria-label="Eliminar empleado" title="Eliminar empleado" className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full border-2 border-white bg-red-500 text-white cursor-pointer text-sm leading-5 shadow-md">×</button>
              <EmployeeCard employee={employee} onSelect={handleSelectEmployee} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;
