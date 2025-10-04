import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, ClipboardList } from "lucide-react";
import { Employee, TaskType } from "@/types/models";
import { API_PATHS } from '@/constants/apipath';
import { Badge } from "@/components/ui/badge";

interface TaskTypePageProps {
  currentUser: Employee;
}

const TASK_TYPE_API_URL = "http://localhost:8080/api/tasks/tasktypes";

export default function TaskTypePage({ currentUser }: TaskTypePageProps) {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaskType, setEditingTaskType] = useState<TaskType | null>(null);
  const [formData, setFormData] = useState<Partial<TaskType>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generic fetch helper
  const fetchData = async <T,>(url: string, setter: (data: T) => void, errorMsg: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(errorMsg);
      const data = await res.json();
      setter(data);
    } catch (err: any) {
      setError(err.message || errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskTypes = () => fetchData<TaskType[]>(TASK_TYPE_API_URL, setTaskTypes, 'Failed to fetch task types');
  const fetchStatuses = () => fetchData<string[]>(API_PATHS.USERS_STATUS_URL, setStatuses, 'Failed to fetch statuses');
  

  useEffect(() => {
    fetchTaskTypes();
    fetchStatuses();
  }, []);

  const canManageTaskTypes = () => {
    return currentUser.role === "admin" || currentUser.role === "manager";
  };

  const filteredTaskTypes = taskTypes.filter(taskType => {
    return taskType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           taskType.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddTaskType = () => {
    setEditingTaskType(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEditTaskType = (taskType: TaskType) => {
    setEditingTaskType(taskType);
    setFormData({ ...taskType });
    setIsDialogOpen(true);
  };

  const handleDeleteTaskType = async (id: number) => {
    if (!canManageTaskTypes()) return;
    try {
      const res = await fetch(`${TASK_TYPE_API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete task type');
      await fetchTaskTypes();
    } catch (err: any) {
      setError(err.message || 'Error deleting task type');
    }
  };

  const handleSaveTaskType = async () => {
    if (!formData.name || !formData.description || !formData.head || !formData.price) return;

    try {
      if (editingTaskType) {
        const res = await fetch(`${TASK_TYPE_API_URL}/${editingTaskType.taskTypeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update task type');
      } else {
        const res = await fetch(TASK_TYPE_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create task type');
      }
      await fetchTaskTypes();
      setIsDialogOpen(false);
      setFormData({});
    } catch (err: any) {
      setError(err.message || 'Error saving task type');
    }
  };

  if (loading) return <div className="p-6">Loading task types...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Task Type Management</h1>
          <p className="text-muted-foreground">Manage the types of tasks for your projects</p>
        </div>
        {canManageTaskTypes() && (
          <Button onClick={handleAddTaskType}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task Type
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Task Types</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{taskTypes.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Types ({filteredTaskTypes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaskTypes.map((taskType) => (
                <TableRow key={taskType.taskTypeId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <p>{taskType.name}</p>
                    </div>
                    </TableCell>
                  <TableCell>{taskType.description}</TableCell>
                  <TableCell>{taskType.head}</TableCell>
                  <TableCell>{taskType.price}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(taskType.status)}>
                        {taskType.status.charAt(0).toUpperCase() + taskType.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTaskType(taskType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {canManageTaskTypes() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTaskType(taskType.taskTypeId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTaskType ? "Edit Task Type" : "Add New Task Type"}
            </DialogTitle>
            <DialogDescription>
              {editingTaskType ? "Update task type information" : "Fill in the details for the new task type"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name || ""} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Task type name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description || ""} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Task type description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="head">Head</Label>
              <Input id="head" value={formData.head || ""} onChange={e => setFormData(prev => ({ ...prev, head: e.target.value }))} placeholder="Head" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={formData.price || ""} onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} placeholder="Price" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select  value={formData.status || "active"} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value as any }))}  >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTaskType}>
              {editingTaskType ? "Update" : "Create"} Task Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
