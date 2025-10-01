import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import Dashboard from "./components/dashboard";
import Employee from "./components/employee";
import Client from "./components/client";
import Billing from "./components/billing";
import Task from "./components/task";

type Page = "dashboard" | "employees" | "clients" | "billing" | "tasks";

type User = {
  id: string;
  name: string;
  role: "admin" | "manager" | "employee";
  email: string;
};

// Mock current user - in a real app this would come from authentication
const mockUser: User = {
  id: "1",
  name: "John Admin",
  role: "admin",
  email: "admin@company.com"
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [currentUser] = useState<User>(mockUser);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard currentUser={currentUser} />;
      case "employees":
        return <Employee currentUser={currentUser} />;
      case "clients":
        return <Client currentUser={currentUser} />;
      case "billing":
        return <Billing currentUser={currentUser} />;
      case "tasks":
        return <Task currentUser={currentUser} />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
