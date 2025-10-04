import { API_PATHS } from '@/constants/apipath';
import { Client, Employee } from "@/types/models";
import { Building2, Edit, Mail, Phone, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Textarea } from "./ui/textarea";


interface EmployeeProps {
  currentUser: Employee;
}


export default function ClientPage({ currentUser }: EmployeeProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientTypes, setClientTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
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

  // Modular fetch functions
  const fetchClients = () => fetchData<Client[]>(API_PATHS.CLIENT_API_URL, setClients, 'Failed to fetch clients');
  const fetchClientTypes = () => fetchData<string[]>(API_PATHS.CLIENT_TYPE_API_URL, setClientTypes, 'Failed to fetch client types');
  const fetchStatuses = () => fetchData<string[]>(API_PATHS.USERS_STATUS_URL, setStatuses, 'Failed to fetch statuses');


  useEffect(() => {
    fetchClientTypes();
    fetchClients();
    fetchStatuses();
  }, []);


  const canManageClients = () => {
    return currentUser.role === "admin" || currentUser.role === "manager";
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({
      clientType: "",
      clientId: "",
      name: "",
      nationality: "",
      dateOfBirth: "",
      citizenship: "",
      aadhar: "",
      sex: "",
      email: "",
      altEmail: "",
      phone: "",
      altPhone: "",
      address: "",
      state: "",
      country: "",
      DSC: false,
      DSCExpiryDate: "",
      IEC: "",
      PAN: "",
      TAN: "",
      DIN: "",
      PFNum: "",
      ESINum: "",
      professionalTaxNum: "",
      properitor: false,
      propreitorshipFirmName: "",
      director: false,
      companyName: "",
      Partner: false,
      partnership_LLP_Name: "",
      KARTA: false,
      HUFName: "",
      shareholder: false,
      shareholderCompanyName: "",
      dedicatedManager: "",
      dedicatedStaff: "",
      status: "prospect",
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setIsDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!canManageClients()) return;
    try {
      const res = await fetch(`${API_PATHS.CLIENT_API_URL}/${clientId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete client');
      await fetchClients();
    } catch (err: any) {
      setError(err.message || 'Error deleting client');
    }
  };

  const handleSaveClient = async () => {
    if (!formData.name || !formData.email) return;
    try {
      if (editingClient) {
        // Update
        const res = await fetch(`${API_PATHS.CLIENT_API_URL}/${editingClient.clientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update client');
      } else {
        // Create
        const res = await fetch(API_PATHS.CLIENT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create client');
      }
      await fetchClients();
      setIsDialogOpen(false);
      setFormData({});
    } catch (err: any) {
      setError(err.message || 'Error saving client');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "prospect": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="p-6">Loading client...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Client Management</h1>
          <p className="text-muted-foreground">Manage your client relationships and contracts</p>
        </div>
        {canManageClients() && (
          <Button onClick={handleAddClient}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{clients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Clients</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{clients.filter(c => c.status === "active").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Prospects</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{clients.filter(c => c.status === "prospect").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                  placeholder="Search by name, company, or email..."
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
                  <SelectItem value="all">All</SelectItem>                  
                    {statuses.map(status => (
                      <SelectItem value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Govt Ids</TableHead>
                <TableHead>Govt Ids Compliance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.clientId}>
                  <TableCell>
                    <div>
                      <p>{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {client.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {client.email}
                      </div>
                      {client.phoneNum && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {client.phoneNum}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {canManageClients() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClient(client.clientId)}
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

      {/* Add/Edit Client Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Edit Client" : "Add New Client"}
            </DialogTitle>
            <DialogDescription>
              {editingClient ? "Update client information" : "Fill in the details for the new client"}
            </DialogDescription>
          </DialogHeader>
          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Render all fields from Client model */}
            <div className="space-y-2 md:col-span-3">
              <Label>Client Type</Label>
              <Select  value={formData.clientType || "active"} onValueChange={(value) => setFormData(prev => ({ ...prev, clientType: value as any }))}  >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clientTypes.map(clientType => (
                    <SelectItem value={clientType}>{clientType}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formData.name || ""} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" />
            </div>
            <div className="space-y-2">
              <Label>Nationality</Label>
              <Input value={formData.nationality || ""} onChange={e => setFormData(prev => ({ ...prev, nationality: e.target.value }))} placeholder="Nationality" />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={formData.dateOfBirth || ""} onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Citizenship</Label>
              <Input value={formData.citizenship || ""} onChange={e => setFormData(prev => ({ ...prev, citizenship: e.target.value }))} placeholder="Citizenship" />
            </div>
            <div className="space-y-2">
              <Label>Aadhar</Label>
              <Input value={formData.aadhar || ""} onChange={e => setFormData(prev => ({ ...prev, aadhar: e.target.value }))} placeholder="Aadhar" />
            </div>
            <div className="space-y-2">
              <Label>Sex</Label>
              <Input value={formData.sex || ""} onChange={e => setFormData(prev => ({ ...prev, sex: e.target.value }))} placeholder="Sex" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email || ""} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" />
            </div>
            <div className="space-y-2">
              <Label>Alt Email</Label>
              <Input type="email" value={formData.altEmail || ""} onChange={e => setFormData(prev => ({ ...prev, altEmail: e.target.value }))} placeholder="Alt Email" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone || ""} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone" />
            </div>
            <div className="space-y-2">
              <Label>Alt Phone</Label>
              <Input value={formData.altPhone || ""} onChange={e => setFormData(prev => ({ ...prev, altPhone: e.target.value }))} placeholder="Alt Phone" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={formData.address || ""} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} placeholder="Address" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={formData.state || ""} onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))} placeholder="State" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={formData.country || ""} onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))} placeholder="Country" />
            </div>            
            <div className="space-y-2">
              <Label>IEC</Label>
              <Input value={formData.IEC || ""} onChange={e => setFormData(prev => ({ ...prev, IEC: e.target.value }))} placeholder="IEC" />
            </div>
            <div className="space-y-2">
              <Label>PAN</Label>
              <Input value={formData.PAN || ""} onChange={e => setFormData(prev => ({ ...prev, PAN: e.target.value }))} placeholder="PAN" />
            </div>
            <div className="space-y-2">
              <Label>TAN</Label>
              <Input value={formData.TAN || ""} onChange={e => setFormData(prev => ({ ...prev, TAN: e.target.value }))} placeholder="TAN" />
            </div>
            <div className="space-y-2">
              <Label>DIN</Label>
              <Input value={formData.DIN || ""} onChange={e => setFormData(prev => ({ ...prev, DIN: e.target.value }))} placeholder="DIN" />
            </div>
            <div className="space-y-2">
              <Label>PF Number</Label>
              <Input value={formData.PFNum || ""} onChange={e => setFormData(prev => ({ ...prev, PFNum: e.target.value }))} placeholder="PF Number" />
            </div>
            <div className="space-y-2">
              <Label>ESI Number</Label>
              <Input value={formData.ESINum || ""} onChange={e => setFormData(prev => ({ ...prev, ESINum: e.target.value }))} placeholder="ESI Number" />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label>Professional Tax Number</Label>
              <Input value={formData.professionalTaxNum || ""} onChange={e => setFormData(prev => ({ ...prev, professionalTaxNum: e.target.value }))} placeholder="Professional Tax Number" />
            </div>
            <div className="space-y-2">
              <Label>DSC</Label>
              <Checkbox checked={formData.DSC || false} onCheckedChange={checked => setFormData(prev => ({ ...prev, DSC: checked as boolean }))} />
            </div>
            <div className="space-y-2">
              <Label>Properitor</Label>
              <Checkbox checked={formData.properitor || false} onCheckedChange={checked => setFormData(prev => ({ ...prev, properitor: checked as boolean }))} />
            </div>
            <div className="space-y-2">
              <Label>Director</Label>
              <Checkbox checked={formData.director || false} onCheckedChange={checked => setFormData(prev => ({ ...prev, director: checked as boolean }))} />
            </div>
            {(formData.DSC && <div className="space-y-2">
              <Label>DSC Expiry Date</Label>
              <Input type="date" value={formData.DSCExpiryDate || ""} onChange={e => setFormData(prev => ({ ...prev, DSCExpiryDate: e.target.value }))} />
            </div>)}            
            {(formData.properitor && <div className="space-y-2">
              <Label>Propreitorship Firm Name</Label>
              <Input value={formData.propreitorshipFirmName || ""} onChange={e => setFormData(prev => ({ ...prev, propreitorshipFirmName: e.target.value }))} placeholder="Propreitorship Firm Name" />
            </div>)}
            {(formData.director && <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={formData.companyName || ""} onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))} placeholder="Company Name" />
            </div>)}
            <div className="space-y-2">
              <Label>Partner</Label>
              <Checkbox checked={formData.partner || false} onCheckedChange={checked => setFormData(prev => ({ ...prev, partner: checked as boolean }))} />
            </div>
            <div className="space-y-2">
              <Label>KARTA</Label>
              <Checkbox checked={formData.KARTA || false} onCheckedChange={checked => setFormData(prev => ({ ...prev, KARTA: checked as boolean }))} />
            </div>
            <div className="space-y-2">
              <Label>Shareholder</Label>
              <Checkbox checked={formData.shareholder || false} onCheckedChange={checked => setFormData(prev => ({ ...prev, shareholder: checked as boolean }))} />
            </div>
            {(formData.partner && <div className="space-y-2">
              <Label>Partnership/LLP Name</Label>
              <Input value={formData.partnership_LLP_Name || ""} onChange={e => setFormData(prev => ({ ...prev, partnership_LLP_Name: e.target.value }))} placeholder="Partnership/LLP Name" />
            </div>)}
            {(formData.KARTA && <div className="space-y-2">
              <Label>HUF Name</Label>
              <Input value={formData.HUFName || ""} onChange={e => setFormData(prev => ({ ...prev, HUFName: e.target.value }))} placeholder="HUF Name" />
            </div>)}
            {(formData.shareholder && <div className="space-y-2">
              <Label>Shareholder Company Name</Label>
              <Input value={formData.shareholderCompanyName || ""} onChange={e => setFormData(prev => ({ ...prev, shareholderCompanyName: e.target.value }))} placeholder="Shareholder Company Name" />
            </div>)}
            <div className="space-y-2">
              <Label>Dedicated Manager</Label>
              <Input value={formData.dedicatedManager || ""} onChange={e => setFormData(prev => ({ ...prev, dedicatedManager: e.target.value }))} placeholder="Dedicated Manager" />
            </div>
            <div className="space-y-2">
              <Label>Dedicated Staff</Label>
              <Input value={formData.dedicatedStaff || ""} onChange={e => setFormData(prev => ({ ...prev, dedicatedStaff: e.target.value }))} placeholder="Dedicated Staff" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status || "active"  } onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>                  
                    {statuses.map(status => (
                      <SelectItem value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Notes</Label>
              <Textarea value={formData.notes || ""} onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Notes" rows={3} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>
              {editingClient ? "Update" : "Create"} Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
