import { useMemo, useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { Button } from '@/components/ui/button';
import { KEYS, type Employee, type Role } from '@/types/models';
import { createId } from '@/lib/id';
import { getAll, removeById, save, type StorageEntity } from '@/lib/storage';

export default function UsersPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('employee');

  const employees = useMemo(() => getAll<Employee>(KEYS.employees), []);
  const [items, setItems] = useState<StorageEntity<Employee>[]>(employees);

  function addUser() {
    if (!name.trim() || !email.trim()) return;
    const item: StorageEntity<Employee> = {
      id: createId('emp'),
      name: name.trim(),
      email: email.trim(),
      role,
    };
    save<Employee>(KEYS.employees, item);
    setItems((prev) => [...prev, item]);
    setName('');
    setEmail('');
    setRole('employee');
  }

  function remove(id: string) {
    removeById<Employee>(KEYS.employees, id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <Shell className="max-w-6xl">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Create Employee</h3>
          <div className="grid gap-3">
            <input
              className="border rounded px-3 py-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            <Button onClick={addUser}>Create</Button>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Employees</h3>
          <ul className="divide-y">
            {items.length === 0 && <li className="py-2 text-sm text-muted-foreground">No employees</li>}
            {items.map((e) => (
              <li key={e.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-sm text-muted-foreground">{e.email} • {e.role}</div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => remove(e.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
