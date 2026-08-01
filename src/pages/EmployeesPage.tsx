//src/pages/EmployeesPage.tsx
import { useState, useEffect, useCallback } from "react";
import type { Employee, Department, EmployeeStatus } from "../types";
import { mockEmployees } from "../utils/mockData";
import EmployeeCard from "../components/EmployeeCard";
import StatsBadge from "../components/StatsBadge";
import AddEmployeePage from "./AddEmployeePage";

function EmployeesPage() {
  //Estado de la lista completa (simulando datos del servidor)
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //Estados de los filtros
  const [search, setSearch] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "">("");
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | "">("");
  
  const [showAddPage, setShowAddPage] = useState<boolean>(false);

// Simular carga de datos (en clases siguientes conectaremos la API real)
useEffect(() => {
  const timer = setTimeout(() => {
    setEmployees(mockEmployees);
    setLoading(false);
  }, 800);

  return () => clearTimeout(timer);
}, []);

// Filtrar empleados según los criterios activos
const filteredEmployees = employees.filter((emp) => {
  const matchesSearch =
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.position.toLowerCase().includes(search.toLowerCase());

  const matchesDepartment =
    !selectedDepartment || emp.department === selectedDepartment;

  const matchesStatus =
    !selectedStatus || emp.status === selectedStatus;

  return matchesSearch && matchesDepartment && matchesStatus;
});

// Estadísticas generales
const totalEmployees = employees.length;

const activeEmployees = employees.filter(
  (emp) => emp.status === "active"
).length;

const onLeaveEmployees = employees.filter(
  (emp) => emp.status === "on_leave"
).length;

const inactiveEmployees = employees.filter(
  (emp) => emp.status === "inactive"
).length;

// Memoizamos el handler para no recrearlo en cada render
const handleSelectEmployee = useCallback((employee: Employee) => {
  alert(
    `Empleado: ${employee.name}\nCargo: ${employee.position}\nDepartamento: ${employee.department}`
  );
}, []);

const handleDeleteEmployee = useCallback((id: number) => {
  if (!confirm("¿Estás seguro de eliminar este empleado?")) return;

  setEmployees((prev) => prev.filter((emp) => emp.id !== id));
}, []);

const handleAddEmployee = useCallback((employee: Employee) => {
  setEmployees((prev) => [...prev, employee]);
  setShowAddPage(false);
}, []);

const departments: Department[] = [
  "Tecnología",
  "Recursos Humanos",
  "Finanzas",
  "Operaciones",
  "Ventas",
];

const statuses: EmployeeStatus[] = [
  "active",
  "inactive",
  "on_leave",
];

const statusLabels: Record<EmployeeStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  on_leave: "En permiso",
};

if (showAddPage) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.3)",
        }}
      >
        <button
          onClick={() => setShowAddPage(false)}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            border: "none",
            background: "#e2e8f0",
            color: "#475569",
            width: "36px",
            height: "36px",
            borderRadius: "999px",
            cursor: "pointer",
            fontSize: "18px",
          }}
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <AddEmployeePage
          onSave={handleAddEmployee}
          onCancel={() => setShowAddPage(false)}
        />
      </div>
    </div>
  );
}

return (
  <div style={{ padding: "24px" }}>
    {/* Encabezado */}
    <div
      style={{
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <h2 style={{ margin: 0, color: "#1e293b" }}>
          Gestión de Empleados
        </h2>

        <p
          style={{
            margin: "4px 0 0",
            color: "#64748b",
          }}
        >
          {filteredEmployees.length} de {employees.length} empleados
        </p>
      </div>

      <button
        onClick={() => setShowAddPage(true)}
        style={{
          padding: "8px 16px",
          background: "#1e40af",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        + Agregar empleado
      </button>
    </div>

    {/* Estadísticas */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <StatsBadge
        label="Total de empleados"
        value={totalEmployees}
        color="#2563eb"
      />

      <StatsBadge
        label="Empleados activos"
        value={activeEmployees}
        color="#16a34a"
      />

      <StatsBadge
        label="Empleados en permiso"
        value={onLeaveEmployees}
        color="#ca8a04"
      />

      <StatsBadge
        label="Empleados inactivos"
        value={inactiveEmployees}
        color="#d44444"
      />
    </div>

    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}
    >
      <input
        type="text"
        placeholder="Buscar empleado..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          flex: 1,
          minWidth: "220px",
          padding: "10px",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
        }}
      />

      <select
        value={selectedDepartment}
        onChange={(e) =>
          setSelectedDepartment(e.target.value as Department | "")
        }
        style={{
          padding: "10px",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
        }}
      >
        <option value="">Todos los departamentos</option>

        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) =>
          setSelectedStatus(e.target.value as EmployeeStatus | "")
        }
        style={{
          padding: "10px",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
        }}
      >
        <option value="">Todos los estados</option>

        {statuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>

      <button
        onClick={() => {
          setSearch("");
          setSelectedDepartment("");
          setSelectedStatus("");
        }}
        style={{
          padding: "10px 16px",
          border: "none",
          background: "#e2e8f0",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Limpiar filtros
      </button>
    </div>

    {loading ? (
  <p>Cargando empleados...</p>
) : filteredEmployees.length === 0 ? (
  <p>No se encontraron empleados.</p>
) : (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))",
      gap: "20px",
    }}
  >
    {filteredEmployees.map((employee) => (
      <EmployeeCard
        key={employee.id}
        employee={employee}
        onSelect={handleSelectEmployee}
        onDelete={handleDeleteEmployee}
      />
    ))}
  </div>
)}

  </div>
);

}

export default EmployeesPage;