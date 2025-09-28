import { useEffect, useMemo, useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { Button } from '@/components/ui/button';
import { KEYS, type Billing, type Client } from '@/types/models';
import { createId } from '@/lib/id';
import { getAll, removeById, save, type StorageEntity } from '@/lib/storage';

export default function BillingPage() {
  const clients = useMemo(() => getAll<Client>(KEYS.clients), []);
  const [items, setItems] = useState<StorageEntity<Billing>[]>([]);

  useEffect(() => {
    setItems(getAll<Billing>(KEYS.billings));
  }, []);

  const [clientId, setClientId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');

  function addBilling() {
    const parsedAmount = parseFloat(amount);
    if (!clientId || isNaN(parsedAmount)) return;
    const item: StorageEntity<Billing> = {
      id: createId('bill'),
      clientId,
      amount: parsedAmount,
      date,
      description: description.trim() || undefined,
    };
    save<Billing>(KEYS.billings, item);
    setItems((p) => [...p, item]);
    setClientId('');
    setAmount('');
    setDate(new Date().toISOString().slice(0, 10));
    setDescription('');
  }

  function remove(id: string) {
    removeById<Billing>(KEYS.billings, id);
    setItems((p) => p.filter((x) => x.id !== id));
  }

  const total = items.reduce((sum, b) => sum + b.amount, 0);

  return (
    <Shell className="max-w-6xl">
      <h2 className="text-2xl font-semibold mb-4">Billing</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Create Billing</h3>
          <div className="grid gap-3">
            <select className="border rounded px-3 py-2" value={clientId} onChange={(e)=>setClientId(e.target.value)}>
              <option value="">Select client</option>
              {clients.map((c)=> (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input className="border rounded px-3 py-2" type="number" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
            <input className="border rounded px-3 py-2" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            <Button onClick={addBilling}>Create</Button>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-1">Billings</h3>
          <div className="text-sm text-muted-foreground mb-3">Total: {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(total)}</div>
          <ul className="divide-y">
            {items.length === 0 && <li className="py-2 text-sm text-muted-foreground">No billings</li>}
            {items.map((b) => {
              const client = clients.find((c) => c.id === b.clientId);
              return (
                <li key={b.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{client?.name || 'Unknown client'}</div>
                    <div className="text-sm text-muted-foreground">{new Date(b.date).toLocaleDateString()} • {b.description || '—'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(b.amount)}</div>
                    <Button variant="destructive" size="sm" onClick={() => remove(b.id)}>Delete</Button>
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
