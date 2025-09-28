import { useEffect, useMemo, useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { Button } from '@/components/ui/button';
import { KEYS, type Task, type TaskStatus, type Employee, type Client } from '@/types/models';
import { createId } from '@/lib/id';
import { getAll, removeById, save, type StorageEntity } from '@/lib/storage';

export default function TasksPage() {
  const employees = useMemo(() => getAll<Employee>(KEYS.employees), []);
  const clients = useMemo(() => getAll<Client>(KEYS.clients), []);
  const [items, setItems] = useState<StorageEntity<Task>[]>([]);

  useEffect(() => {
    setItems(getAll<Task>(KEYS.tasks));
  }, []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);

  function addTask() {
    if (!title.trim() || !assigneeId) return;
    const item: StorageEntity<Task> = {
      id: createId('task'),
      title: title.trim(),
      description: description.trim() || undefined,
      assigneeId,
      clientId: clientId || undefined,
      status,
      dueDate,
    };
    save<Task>(KEYS.tasks, item);
    setItems((p) => [...p, item]);
    setTitle('');
    setDescription('');
    setAssigneeId('');
    setClientId('');
    setStatus('todo');
    setDueDate(undefined);
  }

  function remove(id: string) {
    removeById<Task>(KEYS.tasks, id);
    setItems((p) => p.filter((x) => x.id !== id));
  }

  function toggleStatus(id: string) {
    const next = items.map((t) => {
      if (t.id !== id) return t;
      const nextStatus: TaskStatus = t.status === 'done' ? 'todo' : 'done';
      const updated = { ...t, status: nextStatus };
      save<Task>(KEYS.tasks, updated);
      return updated;
    });
    setItems(next);
  }

  return (
    <Shell className="max-w-6xl">
      <h2 className="text-2xl font-semibold mb-4">Task Management</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Create Task</h3>
          <div className="grid gap-3">
            <input className="border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            <select className="border rounded px-3 py-2" value={assigneeId} onChange={(e)=>setAssigneeId(e.target.value)}>
              <option value="">Select assignee</option>
              {employees.map((e)=> (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <select className="border rounded px-3 py-2" value={clientId} onChange={(e)=>setClientId(e.target.value)}>
              <option value="">Optional client</option>
              {clients.map((c)=> (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select className="border rounded px-3 py-2" value={status} onChange={(e)=>setStatus(e.target.value as TaskStatus)}>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <input className="border rounded px-3 py-2" type="date" value={dueDate || ''} onChange={(e)=>setDueDate(e.target.value || undefined)} />
            <Button onClick={addTask}>Create</Button>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Tasks</h3>
          <ul className="divide-y">
            {items.length === 0 && <li className="py-2 text-sm text-muted-foreground">No tasks</li>}
            {items.map((t) => {
              const assignee = employees.find((e)=>e.id === t.assigneeId);
              const client = clients.find((c)=>c.id === t.clientId);
              return (
                <li key={t.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.title} {t.status === 'done' && <span className="text-xs ml-1 px-1.5 py-0.5 rounded bg-green-100 text-green-800">done</span>}</div>
                    <div className="text-sm text-muted-foreground">{assignee?.name || 'Unassigned'} {client ? `• ${client.name}` : ''} {t.dueDate ? `• due ${new Date(t.dueDate).toLocaleDateString()}` : ''}</div>
                    {t.description && <div className="text-sm">{t.description}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => toggleStatus(t.id)}>{t.status === 'done' ? 'Mark todo' : 'Mark done'}</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(t.id)}>Delete</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
