import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export type Role = "Admin" | "Manager" | "Employee";

type UsersPageMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
};

const seed: UsersPageMember[] = [
  {
    id: "u1",
    name: "Amit Kumar",
    email: "amit@example.com",
    role: "Admin",
    department: "Ops",
  },
  {
    id: "u2",
    name: "Priya Singh",
    email: "priya@example.com",
    role: "Manager",
    department: "Engineering",
  },
  {
    id: "u3",
    name: "Rahul Verma",
    email: "rahul@example.com",
    role: "Employee",
    department: "QA",
  },
];

export default function UsersPage() {
  const [items, setItems] = useLocalStorage<UsersPageMember[]>("flowops_UsersPage", seed);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<UsersPageMember | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((i) =>
      [i.name, i.email, i.role, i.department ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, query]);

  const upsert = (data: Omit<UsersPageMember, "id">, id?: string) => {
    if (id) {
      setItems((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...data } : m)),
      );
      toast({ title: "Member updated" });
    } else {
      const nid = `u${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [{ id: nid, ...data }, ...prev]);
      toast({ title: "Member added" });
    }
    setEditing(null);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((m) => m.id !== id));
    toast({ title: "Member removed" });
  };

  return (
    <div className="container py-10">
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>UsersPage</CardTitle>
            <CardDescription>
              Manage your UsersPage members and roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3 mb-4">
              <Input
                placeholder="Search name, email, role..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                onClick={() =>
                  setEditing({
                    id: "",
                    name: "",
                    email: "",
                    role: "Employee",
                    department: "",
                  })
                }
              >
                New Member
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{m.role}</Badge>
                    </TableCell>
                    <TableCell>{m.department}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditing(m)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => remove(m.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-10"
                    >
                      No members
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <EditForm
          editing={editing}
          onCancel={() => setEditing(null)}
          onSubmit={(data) => upsert(data, editing?.id || undefined)}
        />
      </div>
    </div>
  );
}

function EditForm({
  editing,
  onCancel,
  onSubmit,
}: {
  editing: UsersPageMember | null;
  onCancel: () => void;
  onSubmit: (data: Omit<UsersPageMember, "id">) => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [role, setRole] = useState<Role>(editing?.role ?? "Employee");
  const [department, setDepartment] = useState(editing?.department ?? "");

  const isEditing = !!editing && editing.id;

  // Sync when switching selected editing target
  useMemo(() => {
    setName(editing?.name ?? "");
    setEmail(editing?.email ?? "");
    setRole(editing?.role ?? "Employee");
    setDepartment(editing?.department ?? "");
    return null;
  }, [editing]);

  const canSave = name.trim() && email.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Member" : "New Member"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update UsersPage member details"
            : "Create a new UsersPage member"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["Admin", "Manager", "Employee"] as Role[]).map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <Input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={() => onSubmit({ name, email, role, department })}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
