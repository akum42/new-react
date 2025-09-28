import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { KEYS, type Billing, type Client, type Employee, type Task } from '@/types/models';
import { getAll, type StorageEntity } from '@/lib/storage';

export default function DashboardPage() {
  const [employees, setEmployees] = useState<StorageEntity<Employee>[]>([]);
  const [clients, setClients] = useState<StorageEntity<Client>[]>([]);
  const [billings, setBillings] = useState<StorageEntity<Billing>[]>([]);
  const [tasks, setTasks] = useState<StorageEntity<Task>[]>([]);

  useEffect(() => {
    setEmployees(getAll<Employee>(KEYS.employees));
    setClients(getAll<Client>(KEYS.clients));
    setBillings(getAll<Billing>(KEYS.billings));
    setTasks(getAll<Task>(KEYS.tasks));
  }, []);

  const revenue = billings.reduce((sum, b) => sum + b.amount, 0);
  const tasksDone = tasks.filter((t) => t.status === 'done').length;
  const tasksInProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const tasksTodo = tasks.filter((t) => t.status === 'todo').length;

  return (
    <Shell className="max-w-6xl">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Employees" value={employees.length} />
        <Kpi title="Clients" value={clients.length} />
        <Kpi title="Revenue" value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(revenue)} />
        <Kpi title="Tasks" value={tasks.length} />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <Card title="Tasks by status">
          <ul className="text-sm">
            <li className="flex justify-between py-1"><span>To do</span><span>{tasksTodo}</span></li>
            <li className="flex justify-between py-1"><span>In progress</span><span>{tasksInProgress}</span></li>
            <li className="flex justify-between py-1"><span>Done</span><span>{tasksDone}</span></li>
          </ul>
        </Card>
        <Card title="Top clients by billing">
          <ClientBilling clients={clients} billings={billings} />
        </Card>
        <Card title="Recent billings">
          <ul className="text-sm divide-y">
            {billings.slice(-5).reverse().map((b)=> (
              <li key={b.id} className="py-1 flex justify-between">
                <span>{new Date(b.date).toLocaleDateString()}</span>
                <span>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(b.amount)}</span>
              </li>
            ))}
            {billings.length === 0 && <li className="py-1 text-muted-foreground">No billings</li>}
          </ul>
        </Card>
      </div>
    </Shell>
  );
}

function Kpi({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="font-medium mb-2">{title}</div>
      {children}
    </div>
  );
}

function ClientBilling({ clients, billings }: { clients: StorageEntity<Client>[]; billings: StorageEntity<Billing>[] }) {
  const totals = new Map<string, number>();
  for (const b of billings) {
    totals.set(b.clientId, (totals.get(b.clientId) || 0) + b.amount);
  }
  const rows = Array.from(totals.entries())
    .map(([clientId, total]) => ({ client: clients.find((c) => c.id === clientId)?.name || 'Unknown', total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  return (
    <ul className="text-sm divide-y">
      {rows.map((r) => (
        <li key={r.client} className="py-1 flex justify-between">
          <span>{r.client}</span>
          <span>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(r.total)}</span>
        </li>
      ))}
      {rows.length === 0 && <li className="py-1 text-muted-foreground">No data</li>}
    </ul>
  );
}
