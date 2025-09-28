import { KEYS, type Billing, type Client, type Employee, type Task } from '@/types/models';
import { getAll, save, type StorageEntity } from '@/lib/storage';
import { createId } from '@/lib/id';

export function seedDemoData(): void {
  // Seed employees if empty
  let employees = getAll<Employee>(KEYS.employees);
  if (employees.length === 0) {
    const demoEmployees: StorageEntity<Employee>[] = [
      { id: createId('emp'), name: 'Alice Johnson', email: 'alice@company.com', role: 'admin' },
      { id: createId('emp'), name: 'Bob Williams', email: 'bob@company.com', role: 'manager' },
      { id: createId('emp'), name: 'Carol Smith', email: 'carol@company.com', role: 'employee' },
    ];
    for (const e of demoEmployees) save<Employee>(KEYS.employees, e);
    employees = getAll<Employee>(KEYS.employees);
  }

  // Seed clients if empty
  let clients = getAll<Client>(KEYS.clients);
  if (clients.length === 0) {
    const demoClients: StorageEntity<Client>[] = [
      { id: createId('cli'), name: 'Acme Corp', email: 'ap@acme.com', contact: 'Jane Doe' },
      { id: createId('cli'), name: 'Globex LLC', email: 'billing@globex.com', contact: 'John Roe' },
      { id: createId('cli'), name: 'Initech', email: 'ap@initech.com', contact: 'Peter Gibbons' },
    ];
    for (const c of demoClients) save<Client>(KEYS.clients, c);
    clients = getAll<Client>(KEYS.clients);
  }

  // Seed billings if empty
  const billings = getAll<Billing>(KEYS.billings);
  if (billings.length === 0 && clients.length > 0) {
    const today = new Date();
    const amounts = [1200, 850, 4300, 1999.99, 750];
    const demoBillings: StorageEntity<Billing>[] = amounts.map((amt, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() - idx * 3);
      const client = clients[idx % clients.length];
      return {
        id: createId('bill'),
        clientId: client.id,
        amount: amt,
        date: d.toISOString().slice(0, 10),
        description: `Invoice #${1000 + idx}`,
      };
    });
    for (const b of demoBillings) save<Billing>(KEYS.billings, b);
  }

  // Seed tasks if empty
  const tasks = getAll<Task>(KEYS.tasks);
  if (tasks.length === 0 && employees.length > 0) {
    const statuses: Task['status'][] = ['todo', 'in_progress', 'done', 'todo'];
    const titles = ['Prepare proposal', 'Client onboarding', 'Monthly report', 'Data cleanup'];
    const demoTasks: StorageEntity<Task>[] = titles.map((t, idx) => {
      const due = new Date();
      due.setDate(due.getDate() + (idx + 1) * 2);
      const assignee = employees[idx % employees.length];
      const client = clients.length > 0 ? clients[idx % clients.length] : undefined;
      return {
        id: createId('task'),
        title: t,
        description: `Task ${idx + 1} for ${client ? client.name : 'internal'}`,
        assigneeId: assignee.id,
        clientId: client?.id,
        status: statuses[idx % statuses.length],
        dueDate: due.toISOString().slice(0, 10),
      };
    });
    for (const t of demoTasks) save<Task>(KEYS.tasks, t);
  }
}
