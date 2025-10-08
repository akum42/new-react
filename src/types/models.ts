export type Role = 'admin' | 'manager' | 'employee';

export interface Employee {
  userId: string;
  name: string;
  email: string;
  role: string;
  address: string;
  phoneNum: string;
  altPhoneNum: string;
  status: string;
}

export interface Client {
  clientId: string,
  clientType: string,
  name: string,
  nationality: string,
  dateOfBirth: string,
  citizenship: string,
  aadhar: string,
  sex: string,
  email: string,
  altEmail: string,
  phone: string,
  altPhone: string,
  address: string,
  state: string,
  country: string,
  DSC: boolean,
  DSCExpiryDate: string,
  IEC: string,
  PAN: string,
  TAN: string,
  DIN: string,
  CIN: string,
  PFNum: string,
  ESINum: string,
  professionalTaxNum: string,
  taxAudit: string,
  isINC20ACompliance: boolean,
  INC20AComplianceDate: string,
  isLLPIN: boolean,
  LLPIN: string,
  hasSocietyNum: boolean,
  societyNum: string,
  GSTNums: string[],
  proprietorshipFirmNames: string[],
  companyNames:  string[],
  HUFNames:  string[],
  shareholderCompanyNames:  string[],
  kartaNames: string[],
  personNames:  Person[],
  dedicatedManager: string,
  dedicatedStaff: string,
  status: string;
  notes: string;
}

export interface Person {
  PersonId: string;
  PersonType: string;
  Director: string;
  Partner: string;
  Shareholder: string;
  Propreitor: string;
  Member: string;
  Designation: string;
  DIN: string;
  ShareNumber: string;
  Percentage: string;
  email: string;
  phone: string;
  address: string;
  PAN: string;
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

export interface TaskType {
  id: number;
  name: string;
  description: string;
  head: string;
  price: number;
}

export const KEYS = {
  employees: 'bpm_employees',
  clients: 'bpm_clients',
  billings: 'bpm_billings',
  tasks: 'bpm_tasks',
  taskTypes: 'bpm_taskTypes',
} as const;
