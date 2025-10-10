import { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import DashboardPage from "./components/dashboard";
import EmployeePage from "./components/employee";
import ClientPage from "./components/client";
import BillingPage from "./components/billing";
import TasksPage from "./components/task";
import TaskTypePage from "./components/TaskTypePage";
import LoginPage from "./components/login";

import { useAuth, AuthProvider } from "./components/login";
import { KEYS, type Employee } from '@/types/models';
import { API_PATHS } from '@/constants/apipath';

type Page = "dashboard" | "employees" | "clients" | "billing" | "tasks" | "task-types" | "login";

export default function App() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);


  const renderPage = () => {
    if (!currentUser) {
      return <LoginPage />;
    }
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage currentUser={currentUser} />;
      case "employees":
        return <EmployeePage currentUser={currentUser} />;
      case "clients":
        return <ClientPage currentUser={currentUser} />;
      case "billing":
        return <BillingPage currentUser={currentUser} />;
      case "tasks":
        return <TasksPage currentUser={currentUser} />;
      case "task-types":
        return <TaskTypePage currentUser={currentUser} />;
      default:
        return <DashboardPage currentUser={currentUser} />;
    }
  };

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setCurrentPage("dashboard"); // Redirect to dashboard after login
    } else {
      setCurrentUser(null);
      setCurrentPage("login"); // Go to login page if no user
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading screen
  }
  return (
    <AuthProvider>
      <div className="flex h-screen bg-background">
        <Sidebar
          currentPage={currentPage as Exclude<Page, "login">} // Cast currentPage to exclude "login"
          setCurrentPage={setCurrentPage} // Pass setCurrentPage directly
    currentUser={currentUser as any} // currentUser is guaranteed to be not null here
        />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </AuthProvider>
  );
}
