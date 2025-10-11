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

function AppContent() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("login");
    }
    setLoading(false);
  }, [user]);

  const renderPage = () => {
    if (!user) {
      return <LoginPage />;
    }
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage currentUser={user} />;
      case "employees":
        return <EmployeePage currentUser={user} />;
      case "clients":
        return <ClientPage currentUser={user} />;
      case "billing":
        return <BillingPage currentUser={user} />;
      case "tasks":
        return <TasksPage currentUser={user} />;
      case "task-types":
        return <TaskTypePage currentUser={user} />;
      default:
        return <DashboardPage currentUser={user} />;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading screen
  }
  return (
    <div className="flex h-screen bg-background">
      {user && <Sidebar
        currentPage={currentPage as Exclude<Page, "login">} // Cast currentPage to exclude "login"
        setCurrentPage={setCurrentPage} // Pass setCurrentPage directly
        currentUser={user} // currentUser is guaranteed to be not null here
        logout={logout}
      />}          <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
