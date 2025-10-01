import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Plus, Edit, Trash2, Search, CheckSquare, Clock, AlertTriangle, Calendar } from "lucide-react";

type User = {
  id: string;
  name: string;
  role: "admin" | "manager" | "employee";
  email: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId: string;
  assigneeName: string;
  clientId?: string;
  clientName?: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
};

interface TaskProps {
  currentUser: User;
}

// Mock task data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Complete redesign of the company website with modern UI/UX",
    status: "in-progress",
    priority: "high",
    assigneeId: "3",
    assigneeName: "Mike Johnson",
    clientId: "1",
    clientName: "Acme Corporation",
    startDate: "2024-01-10",
    dueDate: "2024-02-15",
    progress: 65,
    estimatedHours: 120,
    actualHours: 78,
    tags: ["design", "development", "ui/ux"]
  },
  {
    id: "2",
    title: "Database Migration",
    description: "Migrate legacy database to new cloud infrastructure",
    status: "todo",
    priority: "urgent",
    assigneeId: "1",
    assigneeName: "John Admin",
    startDate: "2024-01-20",
    dueDate: "2024-02-01",
    progress: 0,
    estimatedHours: 40,
    actualHours: 0,
    tags: ["database", "migration", "infrastructure"]
  },
  {
    id: "3",
    title: "Mobile App Testing",
    description: "Comprehensive testing of the mobile application across different devices",
    status: "review",
    priority: "medium",
    assigneeId: "4",
    assigneeName: "Emily Davis",
    clientId: "2",
    clientName: "Tech Solutions Inc",
    startDate: "2024-01-05",
    dueDate: "2024-01-25",
    progress: 90,
    estimatedHours: 32,
    actualHours: 35,
    tags: ["testing", "mobile", "qa"]
  },
  {
    id: "4",
    title: "API Documentation",
    description: "Create comprehensive API documentation for external developers",
    status: "completed",
    priority: "low",
    assigneeId: "5",
    assigneeName: "Robert Wilson",
    startDate: "2024-01-01",
    dueDate: "2024-01-15",
    completedDate: "2024-01-14",
    progress: 100,
    estimatedHours: 16,
    actualHours: 18,
    tags: ["documentation", "api"]
  }
];

export default function Task({ currentUser }: TaskProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});

  const canManageTasks = () => {
    return currentUser.role === "admin" || currentUser.role === "manager";
  };

  const canEditTask = (task: Task) => {
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "manager") return true;
    if (currentUser.id === task.assigneeId) return true;
    return false;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assigneeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || task.assigneeId === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const assignees = Array.from(new Set(tasks.map(t => ({ id: t.assigneeId, name: t.assigneeName }))))
    .filter((assignee, index, self) => self.findIndex(a => a.id === assignee.id) === index);

  const handleAddTask = () => {
    setEditingTask(null);
    setFormData({
      status: "todo",
      priority: "medium",
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      estimatedHours: 8,
      actualHours: 0,
      tags: [],
      assigneeId: currentUser.id,
      assigneeName: currentUser.name
    });
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    if (!canEditTask(task)) return;
    setEditingTask(task);
    setFormData({ ...task });
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !canEditTask(task)) return;
    
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleSaveTask = () => {
    if (!formData.title || !formData.assigneeName) return;

    const taskData = {
      ...formData,
      completedDate: formData.status === "completed" ? new Date().toISOString().split('T')[0] : undefined
    };

    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData } as Task
          : task
      ));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title!,
        description: formData.description || "",
        status: formData.status as any,
        priority: formData.priority as any,
        assigneeId: formData.assigneeId!,
        assigneeName: formData.assigneeName!,
        clientId: formData.clientId,
        clientName: formData.clientName,
        startDate: formData.startDate!,
        dueDate: formData.dueDate!,
        completedDate: formData.status === "completed" ? new Date().toISOString().split('T')[0] : undefined,
        progress: formData.progress || 0,
        estimatedHours: formData.estimatedHours || 8,
        actualHours: formData.actualHours || 0,
        tags: formData.tags || [],
      };
      setTasks(prev => [...prev, newTask]);
    }
    
    setIsDialogOpen(false);
    setFormData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== "completed";
  };

  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status)).length;
  const totalHours = tasks.reduce((sum, t) => sum + t.actualHours, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Task Management</h1>
          <p className="text-muted-foreground">Track and manage project tasks and assignments</p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{tasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{inProgressTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {assignees.map(assignee => (
                    <SelectItem key={assignee.id} value={assignee.id}>{assignee.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} className={isOverdue(task.dueDate, task.status) ? "bg-red-50" : ""}>
                  <TableCell>
                    <div>
                      <p>{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex gap-1 mt-1">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {task.assigneeName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {task.assigneeName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={task.progress} className="w-20" />
                      <span className="text-xs text-muted-foreground">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {isOverdue(task.dueDate, task.status) && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{task.clientName || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canEditTask(task) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask ? "Update task information" : "Fill in the details for the new task"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Task title"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Task description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status || "todo"} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={formData.priority || "medium"} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assigneeName">Assignee</Label>
              <Input
                id="assigneeName"
                value={formData.assigneeName || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, assigneeName: e.target.value }))}
                placeholder="Assignee name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Client (Optional)</Label>
              <Input
                id="clientName"
                value={formData.clientName || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Client name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                placeholder="8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actualHours">Actual Hours</Label>
              <Input
                id="actualHours"
                type="number"
                value={formData.actualHours || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, actualHours: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={(formData.tags || []).join(", ")}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)
                }))}
                placeholder="design, development, testing"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              {editingTask ? "Update" : "Create"} Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
