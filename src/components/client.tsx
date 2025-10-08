import { API_PATHS } from '@/constants/apipath';
import { Client, Employee, Person } from "@/types/models";
import { Building2, ChevronDown, ChevronUp, Edit, Mail, Phone, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArrayFieldInput } from "./ui/ArrayFieldInput";
import { ArrayFieldsInput } from "./ui/ArrayFieldsInput";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { CreatableSelect } from "./ui/creatable-select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
  const [indianStates, setIndianStates] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [helperFormData, setHelperFormData] = useState<Partial<Person>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isAddClientTableCollapsed, setAddClientTableCollapsed] = useState(false);

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (statuses || [])
            .map((status) => status?.trim())
            .filter((status): status is string => !!status && status.toLowerCase() !== "all")
        )
      ),
    [statuses]
  );

  const statusFilterOptions = useMemo(
    () => ["all", ...statusOptions],
    [statusOptions]
  );

  const clientTypeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (clientTypes || [])
            .map((type) => type?.trim())
            .filter((type): type is string => !!type)
        )
      ),
    [clientTypes]
  );

  const addStatusOption = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === "all") return;
    setStatuses((prev) => {
      if (prev.some((option) => option.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
  };

  const addClientTypeOption = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setClientTypes((prev) => {
      if (prev.some((option) => option.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
  };

  const indianStatesOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (indianStates || [])
            .map((state) => state?.trim())
            .filter((state): state is string => !!state && state.toLowerCase() !== "all")
        )
      ),
    [indianStates]
  );

  const countriesOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (countries || [])
            .map((type) => type?.trim())
            .filter((type): type is string => !!type)
        )
      ),
    [countries]
  );

  const addIndianStatesOption = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === "all") return;
    setIndianStates((prev) => {
      if (prev.some((option) => option.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
  };

  const addCountriesOption = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setCountries((prev) => {
      if (prev.some((option) => option.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
  };


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
  const fetchIndianStates = () => fetchData<string[]>(API_PATHS.CLIENT_INDIAN_STATES_URL, setIndianStates, 'Failed to fetch states');
  const fetchCountries = () => fetchData<string[]>(API_PATHS.CLIENT_COUNTRIES_URL, setCountries, 'Failed to fetch countries');



  useEffect(() => {
    fetchClientTypes();
    fetchClients();
    fetchStatuses();
    fetchIndianStates();
    fetchCountries();
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
    setFormData({ clientType: "Individual", status: "active", country: "INDIA", state: "DELHI" });
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
    alert(JSON.stringify(formData));
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

  // Generic array field handlers
  type ArrayField = 'GSTNums' | 'proprietorshipFirmNames' | 'companyNames' | 'HUFNames' | 'shareholderCompanyNames' | 'kartaNames';

  const handleAddArrayField = (field: ArrayField) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...((prev[field] as string[]) || []), ""]
    }));
  };

  const handleUpdateArrayField = (field: ArrayField, oldValue: string, newValue: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: ((prev[field] as string[]) || []).map(item => item === oldValue ? newValue : item)
    }));
  };

  const handleRemoveArrayField = (field: ArrayField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: ((prev[field] as string[]) || []).filter(item => item !== value)
    }));
  };

  // Generic person field handlers
  type personField = 'personNames';

  const handleAddPersonField = (field: personField, person: Person) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...((prev[field] as Person[]) || []), person]
    }));
  };

  const handleUpdatePersonField = (field: personField, oldValue: Person, newValue: Person) => {
    setFormData(prev => ({
      ...prev,
      [field]: ((prev[field] as Person[]) || []).map(item => item === oldValue ? newValue : item)
    }));
  };

  const handleRemovePersonField = (field: personField, value: Person) => {
    setFormData(prev => ({
      ...prev,
      [field]: ((prev[field] as Person[]) || []).filter(item => item !== value)
    }));
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stats</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}>
            {isStatsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {!isStatsCollapsed && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </CardContent>
        )}
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}>
            {isFiltersCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {!isFiltersCollapsed && (
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
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <CreatableSelect
                value={statusFilter}
                options={statusFilterOptions}
                onChange={(value) => setStatusFilter(value ?? "all")}
                onCreateOption={(newStatus) => {
                  addStatusOption(newStatus);
                  setStatusFilter(newStatus);
                }}
                placeholder="Filter by status"
                isClearable={false}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Client Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Clients ({filteredClients.length})</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsTableCollapsed(!isTableCollapsed)}>
            {isTableCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {!isTableCollapsed && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date Of Birth</TableHead>
                  <TableHead>Aadhar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.clientId}>
                    <TableCell>
                      <div>
                        <p>{client.clientType}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.address}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
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
        )}
      </Card>

      {/* Add/Edit Client Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto w-full sm:max-w-[860px] ">

          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Edit Client" : "Add New Client"}
            </DialogTitle>
            <DialogDescription>
              {editingClient ? "Update client information" : "Fill in the details for the new client"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Render all fields from Client model */}
            <div className="space-y-2 md:col-span-3">
              <Label>Client Type</Label>
              <CreatableSelect
                value={formData.clientType ?? undefined}
                options={clientTypeOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, clientType: value ?? undefined }))}
                onCreateOption={(newType) => {
                  addClientTypeOption(newType);
                  setFormData(prev => ({ ...prev, clientType: newType }));
                }}
                placeholder="Select or create a client type"
              />
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
              <CreatableSelect
                value={formData.state ?? undefined}
                options={indianStatesOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value ?? undefined }))}
                onCreateOption={(newType) => {
                  addIndianStatesOption(newType);
                  setFormData(prev => ({ ...prev, state: newType }));
                }}
                placeholder="Select or create a state"
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <CreatableSelect
                value={formData.country ?? undefined}
                options={countriesOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, country: value ?? undefined }))}
                onCreateOption={(newType) => {
                  addCountriesOption(newType);
                  setFormData(prev => ({ ...prev, country: newType }));
                }}
                placeholder="Select or create a country"
              />
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
            {(formData.clientType && ["Pvt Ltd Company", "Public Ltd", "OPC Company", "Trust/Society", "Foreign Company",].includes(formData.clientType)) && (
              <div className="space-y-2">
                <Label>CIN</Label>
                <Input value={formData.CIN || ""} onChange={e => setFormData(prev => ({ ...prev, CIN: e.target.value }))} placeholder="CIN" />
              </div>
            )}
            <div className="space-y-2">
              <Label>PF Number</Label>
              <Input value={formData.PFNum || ""} onChange={e => setFormData(prev => ({ ...prev, PFNum: e.target.value }))} placeholder="PF Number" />
            </div>
            <div className="space-y-2">
              <Label>ESI Number</Label>
              <Input value={formData.ESINum || ""} onChange={e => setFormData(prev => ({ ...prev, ESINum: e.target.value }))} placeholder="ESI Number" />
            </div>
            <div className="space-y-3">
              <Label>Professional Tax Number</Label>
              <Input value={formData.professionalTaxNum || ""} onChange={e => setFormData(prev => ({ ...prev, professionalTaxNum: e.target.value }))} placeholder="Professional Tax Number" />
            </div>
            <div className="space-y-3">
              <Label>Tax Audit</Label>
              <Input value={formData.taxAudit || ""} onChange={e => setFormData(prev => ({ ...prev, taxAudit: e.target.value }))} placeholder="Professional Tax Number" />
            </div>
            <div className="space-y-2">
              <Label>DSC</Label>
              <Checkbox checked={formData.DSC || false} onCheckedChange={checked => setFormData(prev => ({ ...prev, DSC: checked as boolean }))} />
            </div>
            {(formData.DSC &&
              <div className="space-y-2">
                <Label>DSC Expiry Date</Label>
                <Input type="date" value={formData.DSCExpiryDate || ""} onChange={e => setFormData(prev => ({ ...prev, DSCExpiryDate: e.target.value }))} />
              </div>
            )}
            <div className="space-y-2">
              <Label>INC 20A Compliance</Label>
              <Checkbox checked={formData.isINC20ACompliance || false} onCheckedChange={checked => setFormData(prev => ({ ...prev, isINC20ACompliance: checked as boolean }))} />
            </div>
            {(formData.isINC20ACompliance &&
              <div className="space-y-2">
                <Label>Compliance Date</Label>
                <Input type="date" value={formData.INC20AComplianceDate || ""} onChange={e => setFormData(prev => ({ ...prev, INC20AComplianceDate: e.target.value }))} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <ArrayFieldInput
                label="GST Numbers"
                values={formData.GSTNums || []}
                onAdd={() => handleAddArrayField('GSTNums')}
                onUpdate={(oldValue, newValue) => handleUpdateArrayField('GSTNums', oldValue, newValue)}
                onRemove={value => handleRemoveArrayField('GSTNums', value)}
                placeholder="GST Number"
                itemLabelPrefix="GST"
              />
            </div>
            <div className="flex items-center gap-2">
              <ArrayFieldInput
                label="Proprietorship Firm"
                values={formData.proprietorshipFirmNames || []}
                onAdd={() => handleAddArrayField('proprietorshipFirmNames')}
                onUpdate={(oldValue, newValue) => handleUpdateArrayField('proprietorshipFirmNames', oldValue, newValue)}
                onRemove={value => handleRemoveArrayField('proprietorshipFirmNames', value)}
                placeholder="Firm Number"
                itemLabelPrefix="Firm"
              />
            </div>
            <div className="space-y-2">
              <ArrayFieldInput
                label="Director's Company Names"
                values={formData.companyNames || []}
                onAdd={() => handleAddArrayField('companyNames')}
                onUpdate={(oldValue, newValue) => handleUpdateArrayField('companyNames', oldValue, newValue)}
                onRemove={value => handleRemoveArrayField('companyNames', value)}
                placeholder="Company name"
                itemLabelPrefix="Company"
              />
            </div>
            <div className="space-y-2">
              <ArrayFieldInput
                label="Karta's HUF Names"
                values={formData.HUFNames || []}
                onAdd={() => handleAddArrayField('HUFNames')}
                onUpdate={(oldValue, newValue) => handleUpdateArrayField('HUFNames', oldValue, newValue)}
                onRemove={value => handleRemoveArrayField('HUFNames', value)}
                placeholder="HUF name"
                itemLabelPrefix="HUF"
              />
            </div>
            <div className="space-y-2">
              <ArrayFieldInput
                label="Shareholder Company Names"
                values={formData.shareholderCompanyNames || []}
                onAdd={() => handleAddArrayField('shareholderCompanyNames')}
                onUpdate={(oldValue, newValue) => handleUpdateArrayField('shareholderCompanyNames', oldValue, newValue)}
                onRemove={value => handleRemoveArrayField('shareholderCompanyNames', value)}
                placeholder="Company name"
                itemLabelPrefix="Company"
              />
            </div>
            <div className="space-y-2">
              <ArrayFieldInput
                label="Karta Names"
                values={formData.kartaNames || []}
                onAdd={() => handleAddArrayField('kartaNames')}
                onUpdate={(oldValue, newValue) => handleUpdateArrayField('kartaNames', oldValue, newValue)}
                onRemove={value => handleRemoveArrayField('kartaNames', value)}
                placeholder="Karta name"
                itemLabelPrefix="Karta"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-3  gap-4">
              <Button variant="ghost" size="sm" onClick={() => setAddClientTableCollapsed(!isAddClientTableCollapsed)}>
                {isAddClientTableCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
            {!isAddClientTableCollapsed && (
              <div className="space-y-2 md:col-span-3  gap-4">
                <div className="space-y-2">
                  <ArrayFieldsInput
                    label="Directors"
                    values={formData.personNames || [{ Director: '', DIN: '', email: '', phone: '', address: '', PAN: '' } as Person]}
                    onAdd={() => handleAddPersonField('personNames', { Director: '', DIN: '', email: '', phone: '', address: '', PAN: '' } as Person)}
                    onUpdate={(oldValue, newValue) => handleUpdatePersonField('personNames', oldValue, newValue)}
                    onRemove={value => handleRemovePersonField('personNames', value)}
                    placeholder={[]}
                    itemLabelPrefix=""
                  />
                </div>
                <div className="space-y-2">
                  <ArrayFieldsInput
                    label="Shareholders"
                    values={formData.personNames || [{ Shareholder: '', ShareNumber: '', email: '', phone: '', address: '', PAN: '' } as Person]}
                    onAdd={() => handleAddPersonField('personNames', { Shareholder: '', ShareNumber: '', email: '', phone: '', address: '', PAN: '' } as Person)}
                    onUpdate={(oldValue, newValue) => handleUpdatePersonField('personNames', oldValue, newValue)}
                    onRemove={value => handleRemovePersonField('personNames', value)}
                    placeholder={[]}
                    itemLabelPrefix=""
                  />
                </div>
                <div className="space-y-2">
                  <ArrayFieldsInput
                    label="Designated Partner"
                    values={formData.personNames || [{ Partner: '', Percentage: '', email: '', phone: '', address: '', PAN: '' } as Person]}
                    onAdd={() => handleAddPersonField('personNames', { Partner: '', Percentage: '', email: '', phone: '', address: '', PAN: '' } as Person)}
                    onUpdate={(oldValue, newValue) => handleUpdatePersonField('personNames', oldValue, newValue)}
                    onRemove={value => handleRemovePersonField('personNames', value)}
                    placeholder={[]}
                    itemLabelPrefix=""
                  />
                </div>
                <div className="space-y-2">
                  <ArrayFieldsInput
                    label="Propreitors"
                    values={formData.personNames || [{ Propreitor: '', email: '', phone: '', address: '', PAN: '' } as Person]}
                    onAdd={() => handleAddPersonField('personNames', { Propreitor: '', email: '', phone: '', address: '', PAN: '' } as Person)}
                    onUpdate={(oldValue, newValue) => handleUpdatePersonField('personNames', oldValue, newValue)}
                    onRemove={value => handleRemovePersonField('personNames', value)}
                    placeholder={[]}
                    itemLabelPrefix=""
                  />
                </div>
                <div className="space-y-2">
                  <ArrayFieldsInput
                    label="Members"
                    values={formData.personNames || [{ Member: '', Designation: '', email: '', phone: '', address: '', PAN: '' } as Person]}
                    onAdd={() => handleAddPersonField('personNames', { Member: '', Designation: '', email: '', phone: '', address: '', PAN: '' } as Person)}
                    onUpdate={(oldValue, newValue) => handleUpdatePersonField('personNames', oldValue, newValue)}
                    onRemove={value => handleRemovePersonField('personNames', value)}
                    placeholder={[]}
                    itemLabelPrefix=""
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <CreatableSelect
                value={formData.status ?? undefined}
                options={statusOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value ?? undefined }))}
                onCreateOption={(newStatus) => {
                  addStatusOption(newStatus);
                  setFormData(prev => ({ ...prev, status: newStatus }));
                }}
                placeholder="Select or create a status"
              />

            </div>
          </div>

          <div className="space-y-2 md:grid-cols-3 gap-42">
            <Label>Notes</Label>
            <Textarea value={formData.notes || ""} onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Notes" rows={3} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>
              {editingClient ? "Update" : "Create"} Client
            </Button>
          </DialogFooter>

        </DialogContent >
      </Dialog >
    </div >
  );
} 
