import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { KEYS, type Employee } from '@/types/models';
import { API_PATHS } from '@/constants/apipath';
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Edit, Trash2, Search, Filter, Building2, Phone, Mail } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface EmployeeProps {
  currentUser: Employee;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export default function EmployeePage({ currentUser }: EmployeeProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Generic fetch helper
  const fetchData = async <T,>(url: string, setter: (data: T) => void, errorMsg: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(errorMsg);
      const data = await res.json();
      setter(data);
    } catch (err: any) {
      setError(err.message || errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Modular fetch functions
  const fetchEmployees = () => fetchData<Employee[]>(API_PATHS.USERS_API_URL, setEmployees, 'Failed to fetch employees');
  const fetchRoles = () => fetchData<string[]>(API_PATHS.USERS_ROLE_URL, setRoles, 'Failed to fetch roles');
  const fetchStatuses = () => fetchData<string[]>(API_PATHS.USERS_STATUS_URL, setStatuses, 'Failed to fetch statuses');


  useEffect(() => {
    fetchEmployees();
    fetchRoles();
    fetchStatuses();
  }, []);

  const canManageEmployee = (targetEmployee: Employee) => {
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "manager" && targetEmployee.role === "employee") return true;
    return false;
  };


  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;

    return matchesSearch && matchesRole;
  });


  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      role: "employee",
      status: "active",
      name: "",
      email: "",
      address: "",
      phoneNum: "",
      altPhoneNum: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    if (!canManageEmployee(employee)) return;
    setEditingEmployee(employee);
    setFormData({ ...employee });
    setIsDialogOpen(true);
  };
  const handleDeleteEmployee = async (employeeId: number) => {
    const employee = employees.find(e => e.userId === employeeId);
    if (!employee || !canManageEmployee(employee)) return;
    try {
      const res = await fetch(`${API_PATHS.USERS_API_URL}/${employeeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete employee');
      await fetchEmployees();
    } catch (err: any) {
      setError(err.message || 'Error deleting employee');
    }
  };

  const handleSaveEmployee = async () => {
    if (!formData.name || !formData.email) return;
    try {
      if (editingEmployee) {
        // Update
        const res = await fetch(`${API_PATHS.USERS_API_URL}/${editingEmployee.userId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update employee');
      } else {
        // Create
        const res = await fetch(API_PATHS.USERS_API_URL, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create employee');
      }
      await fetchEmployees();
      setIsDialogOpen(false);
      setFormData({});
    } catch (err: any) {
      setError(err.message || 'Error saving employee');
    }
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

  if (loading) return <div className="p-6">Loading employees...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Employee</h1>
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
                  {roles.map(role => (
                    <SelectItem value={role}>{role}</SelectItem>
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
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {employee.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {employee.email}
                      </div>
                      {employee.phoneNum && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {employee.phoneNum}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(employee.role)}>
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </Badge>
                  </TableCell>
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
                            onClick={() => handleDeleteEmployee(employee.userId)}
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
              <Input id="name" value={formData.name || ""} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Employee name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email || ""} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="employee@company.com" />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role || "employee"} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))} >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status || "active"} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}  >
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
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={formData.address || ""} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} placeholder="House# 1, Street 1, City, Country" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNum">Phone</Label>
              <Input id="phoneNum" type="phoneNum" value={formData.phoneNum || ""} onChange={(e) => setFormData(prev => ({ ...prev, phoneNum: e.target.value }))} placeholder="1234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altPhoneNum">Alt Phone</Label>
              <Input id="altPhoneNum" type="altPhoneNum" value={formData.altPhoneNum || ""} onChange={(e) => setFormData(prev => ({ ...prev, altPhoneNum: e.target.value }))} placeholder="1234567890" />
            </div>
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