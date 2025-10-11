export type Role = 'admin' | 'manager' | 'employee';

export interface Employee {
  userId: number;
  name: string;
  email: string;
  role: string;
  address?: string;
  phoneNum?: string;
  altPhoneNum?: string;
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
  dsc: boolean,
  dscexpiryDate: string,
  iec: string,
  pan: string,
  tan: string,
  din: string,
  cin: string,
  pfnum: string,
  esinum: string,
  professionalTaxNum: string,
  taxAudit: string,
  isINC20ACompliance: boolean,
  inc20AComplianceDate: string,
  isLLPIN: boolean,
  llpin: string,
  hasSocietyNum: boolean,
  societyNum: string,
  gstnums: string[],
  proprietorshipFirmNames: string[],
  companyNames:  string[],
  hufnames:  string[],
  shareholderCompanyNames:  string[],
  kartaNames: string[],
  directorNames:  Person[],
  shareholdersNames:  Person[],
  designatedPartnerNames:  Person[],
  propreitorsNames:  Person[],
  membersNames:  Person[],
  dedicatedManager: string,
  dedicatedStaff: string,
  status: string;
  notes: string;
}

export interface Person {
  personId: string;
  personType: string;
  parentClientId: string;
  director: string;
  partner: string;
  shareholder: string;
  propreitor: string;
  member: string;
  designation: string;
  din: string;
  shareNumber: string;
  percentage: string;
  email: string;
  phone: string;
  address: string;
  pan: string;
}

export interface LoginUser {
  userId: string;
  password: string;
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
