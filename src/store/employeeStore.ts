// src/store/employeeStore.ts
import { create } from 'zustand';
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types';
import { mockEmployees } from '../utils/mockData';
interface EmployeeState {
employees: Employee[];
selectedEmployee: Employee | null;
isLoading: boolean;
error: string | null;
fetchEmployees: () => Promise<void>;
addEmployee: (data: CreateEmployeeDto) => boolean;
updateEmployee: (id: number, data: UpdateEmployeeDto) => void;
deleteEmployee: (id: number) => void;
selectEmployee: (employee: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
employees: [],
selectedEmployee: null,
isLoading: false,
error: null,
fetchEmployees: async () => {
set({ isLoading: true, error: null });
// Simular carga de API
await new Promise(resolve => setTimeout(resolve, 600));
set({ employees: mockEmployees, isLoading: false });
},


addEmployee: (data: CreateEmployeeDto) => {
// Usamos get() para leer el estado actual sin depender del callback de set()
const emailTaken = get().employees.some(emp => emp.email === data.email);
if (emailTaken) {
set({ error: `Ya existe un empleado con el email ${data.email}.` });
return false;
}
const newEmployee: Employee = {
...data,
id: Date.now(),
};
set(state => ({ employees: [...state.employees, newEmployee], error: null }));
return true;
},


updateEmployee: (id: number, data: UpdateEmployeeDto) => {
set(state => ({
employees: state.employees.map(emp =>
emp.id === id ? { ...emp, ...data } : emp
),
}));
},
deleteEmployee: (id: number) => {
set(state => ({
employees: state.employees.filter(emp => emp.id !== id),
// Si el empleado eliminado estaba seleccionado, deseleccionarlo
selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee,
}));
},
selectEmployee: (employee: Employee | null) => {
set({ selectedEmployee: employee });
},
}));