import type { Employee } from "../types";

// Datos iniciales de la práctica: 6 empleados.
export const mockEmployees: Employee[] = [
  { id: 1, name: "Ana García", email: "ana.garcia@empresa.com", position: "Desarrolladora Frontend", department: "Tecnología", salary: 8500, hireDate: "2022-03-15", status: "active", role: "employee", avatarUrl: "https://i.pravatar.cc/64?img=1" },
  { id: 2, name: "Carlos Martínez", email: "carlos.martinez@empresa.com", position: "Gerente de RRHH", department: "Recursos Humanos", salary: 12000, hireDate: "2019-07-01", status: "active", role: "hr" },
  { id: 3, name: "María López", email: "maria.lopez@empresa.com", position: "Contadora Senior", department: "Finanzas", salary: 9500, hireDate: "2021-01-20", status: "on_leave", role: "employee" },
  { id: 4, name: "Roberto Silva", email: "roberto.silva@empresa.com", position: "Administrador del Sistema", department: "Tecnología", salary: 15000, hireDate: "2018-05-10", status: "active", role: "admin" },
  { id: 5, name: "Gabriel Ochoa", email: "gabriel.ochoa@empresa.com", position: "Gerente de Ventas", department: "Ventas", salary: 9250, hireDate: "2019-08-01", status: "inactive", role: "employee" },
  { id: 6, name: "Sofía Ramírez", email: "sofia.ramirez@empresa.com", position: "Desarrolladora Backend", department: "Tecnología", salary: 10000, hireDate: "2023-02-14", status: "active", role: "employee", avatarUrl: "https://i.pravatar.cc/64?img=2" },
];
