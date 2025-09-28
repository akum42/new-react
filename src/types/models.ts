export type Role = 'admin' | 'manager' | 'employee';

export interface Employee {
  name: string;
  email: string;
  role: Role;
}

export interface Client {
  name: string;
  contact?: string;
  email?: string;
}

export interface Billing {
  clientId: string;
  amount: number;
  date: string; // ISO date
  description?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  title: string;
  description?: string;
  assigneeId: string; // employee id
  clientId?: string; // optional link to client
  status: TaskStatus;
  dueDate?: string; // ISO date
}

export const KEYS = {
  employees: 'bpm_employees',
  clients: 'bpm_clients',
  billings: 'bpm_billings',
  tasks: 'bpm_tasks',
} as const;
