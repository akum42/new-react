import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

type User = {
  id: string;
  name: string;
  role: "admin" | "manager" | "employee";
  email: string;
};

type Employee = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  department: string;
  joinDate: string;
  status: "active" | "inactive";
  salary: number;
};

interface EmployeeProps {
  currentUser: User;
}

// Mock employee data
const mockEmployees: Employee[] = [
  { id: "1", name: "John Admin", email: "admin@company.com", role: "admin", department: "IT", joinDate: "2020-01-15", status: "active", salary: 80000 },
  { id: "2", name: "Sarah Manager", email: "sarah@company.com", role: "manager", department: "Sales", joinDate: "2021-03-10", status: "active", salary: 65000 },
  { id: "3", name: "Mike Johnson", email: "mike@company.com", role: "employee", department: "Marketing", joinDate: "2022-06-20", status: "active", salary: 45000 },
  { id: "4", name: "Emily Davis", email: "emily@company.com", role: "employee", department: "HR", joinDate: "2021-11-05", status: "active", salary: 50000 },
  { id: "5", name: "Robert Wilson", email: "robert@company.com", role: "manager", department: "IT", joinDate: "2020-08-12", status: "inactive", salary: 70000 },
];

export default function Employee({ currentUser }: EmployeeProps) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  const canManageEmployee = (targetEmployee: Employee) => {
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "manager" && targetEmployee.role === "employee") return true;
    return false;
  };

  const canViewSalary = () => {
    return currentUser.role === "admin" || currentUser.role === "manager";
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const departments = Array.from(new Set(employees.map(e => e.department)));

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      role: "employee",
      status: "active",
      department: "",
      name: "",
      email: "",
      salary: 40000,
      joinDate: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    if (!canManageEmployee(employee)) return;
    setEditingEmployee(employee);
    setFormData({ ...employee });
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee || !canManageEmployee(employee)) return;
    
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
  };

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.email || !formData.department) return;

    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData } as Employee
          : emp
      ));
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formData.name!,
        email: formData.email!,
        role: formData.role as "admin" | "manager" | "employee",
        department: formData.department!,
        joinDate: formData.joinDate!,
        status: formData.status as "active" | "inactive",
        salary: formData.salary || 40000,
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    
    setIsDialogOpen(false);
    setFormData({});
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-destructive text-destructive-foreground";
      case "manager": return "bg-primary text-primary-foreground";
      case "employee": return "bg-secondary text-secondary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Employee Management</h1>
          <p className="text-muted-foreground">Manage your organization's employees</p>
        </div>
        {(currentUser.role === "admin" || currentUser.role === "manager") && (
          <Button onClick={handleAddEmployee}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>

      {currentUser.role === "employee" && (
        <Alert>
          <AlertDescription>
            You have read-only access to employee information.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                {canViewSalary() && <TableHead>Salary</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {employee.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(employee.role)}>
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </Badge>
                  </TableCell>
                  {canViewSalary() && (
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canManageEmployee(employee) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
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

      {/* Add/Edit Employee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee ? "Update employee information" : "Fill in the details for the new employee"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Employee name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="employee@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={formData.role || "employee"} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  {currentUser.role === "admin" && (
                    <>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Department"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status || "active"} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {canViewSalary() && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="salary">Annual Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                  placeholder="40000"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmployee}>
              {editingEmployee ? "Update" : "Create"} Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
