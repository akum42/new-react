import { useMemo, useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { Button } from '@/components/ui/button';
import { KEYS, type Client } from '@/types/models';
import { createId } from '@/lib/id';
import { getAll, removeById, save, type StorageEntity } from '@/lib/storage';

export default function ClientsPage() {
  const initial = useMemo(() => getAll<Client>(KEYS.clients), []);
  const [items, setItems] = useState<StorageEntity<Client>[]>(initial);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  function addClient() {
    if (!name.trim()) return;
    const item: StorageEntity<Client> = {
      id: createId('cli'),
      name: name.trim(),
      email: email.trim() || undefined,
      contact: contact.trim() || undefined,
    };
    save<Client>(KEYS.clients, item);
    setItems((p) => [...p, item]);
    setName('');
    setEmail('');
    setContact('');
  }

  function remove(id: string) {
    removeById<Client>(KEYS.clients, id);
    setItems((p) => p.filter((x) => x.id !== id));
  }

  return (
    <Shell className="max-w-6xl">
      <h2 className="text-2xl font-semibold mb-4">Client Management</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Create Client</h3>
          <div className="grid gap-3">
            <input className="border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Contact" value={contact} onChange={(e)=>setContact(e.target.value)} />
            <Button onClick={addClient}>Create</Button>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Clients</h3>
          <ul className="divide-y">
            {items.length === 0 && <li className="py-2 text-sm text-muted-foreground">No clients</li>}
            {items.map((c) => (
              <li key={c.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-muted-foreground">{c.email || '—'} {c.contact ? `• ${c.contact}` : ''}</div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => remove(c.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
