// src/services/employeeService.ts
import { apiClient } from './api';
import { mockEmployees } from '../utils/mockData';
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto, PaginatedResponse } from '../types';

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

const buildMockPaginatedResponse = (
  filters: EmployeeFilters = {},
): PaginatedResponse<Employee> => {
  const search = filters.search?.trim().toLowerCase() ?? '';
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;

  let filtered = [...mockEmployees];

  if (search) {
    filtered = filtered.filter((employee) =>
      [employee.name, employee.email, employee.position]
        .some((value) => value.toLowerCase().includes(search)),
    );
  }

  if (filters.department) {
    filtered = filtered.filter(
      (employee) => employee.department === filters.department,
    );
  }

  if (filters.status) {
    filtered = filtered.filter((employee) => employee.status === filters.status);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: filtered.slice(start, end),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
};

export const employeeService = {
  // Obtener lista paginada
  getAll: async (filters: EmployeeFilters = {}): Promise<PaginatedResponse<Employee>> => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('q', filters.search);
      if (filters.department) params.set('department', filters.department);
      if (filters.status) params.set('status', filters.status);
      if (filters.page) params.set('_page', String(filters.page));
      if (filters.pageSize) params.set('_limit', String(filters.pageSize));

      const response = await apiClient.get<Employee[]>(`/employees?${params}`);
      const total = Number.parseInt(response.headers['x-total-count'] || '0', 10);

      return {
        data: response.data,
        total,
        page: filters.page || 1,
        pageSize: filters.pageSize || 10,
        totalPages: Math.max(1, Math.ceil(total / (filters.pageSize || 10))),
      };
    } catch {
      return buildMockPaginatedResponse(filters);
    }
  },

  // Obtener uno por ID
  getById: async (id: number): Promise<Employee> => {
    try {
      const response = await apiClient.get<Employee>(`/employees/${id}`);
      return response.data;
    } catch {
      const employee = mockEmployees.find((item) => item.id === id);
      if (!employee) {
        throw new Error(`Empleado con id ${id} no encontrado`);
      }
      return employee;
    }
  },

  // Crear nuevo empleado
  create: async (data: CreateEmployeeDto): Promise<Employee> => {
    const response = await apiClient.post<Employee>('/employees', data);
    return response.data;
  },

  // Actualizar empleado (PATCH, no PUT — data es parcial y json-server
  // reemplazaría el recurso completo con un PUT, perdiendo los campos que no se envían)
  update: async (id: number, data: UpdateEmployeeDto): Promise<Employee> => {
    const response = await apiClient.patch<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  // Eliminar empleado
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },
};