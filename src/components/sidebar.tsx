import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  CheckSquare,
  LogOut,
  Building2,
  ClipboardList
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

type User = {
  id: string;
  name: string;
  role: "admin" | "manager" | "employee";
  email: string;
};

type Page = "dashboard" | "employees" | "clients" | "billing" | "tasks" | "task-types";

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User;
}

export function Sidebar({ currentPage, setCurrentPage, currentUser }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "employees", label: "Employees", icon: Users },
    { id: "clients", label: "Clients", icon: UserCheck },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "task-types", label: "Task Types", icon: ClipboardList },
  ] as const;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-destructive text-destructive-foreground";
      case "manager": return "bg-primary text-primary-foreground";
      case "employee": return "bg-secondary text-secondary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-lg">BPM System</span>
        </div>
        
        {/* User info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {currentUser.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{currentUser.name}</p>
            <Badge className={`text-xs ${getRoleColor(currentUser.role)}`}>
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setCurrentPage(item.id as Page)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}