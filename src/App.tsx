import { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import DashboardPage from "./components/dashboard";
import EmployeePage from "./components/employee";
import ClientPage from "./components/client";
import BillingPage from "./components/billing";
import TasksPage from "./components/task";
import TaskTypePage from "./components/TaskTypePage";

import { KEYS, type Employee } from '@/types/models';
import { API_PATHS } from '@/constants/apipath';

type Page = "dashboard" | "employees" | "clients" | "billing" | "tasks" | "task-types";


export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_PATHS.CURRENT_USER_API_URL, {
      credentials: 'include'  // send cookies for session
    }).then(async res => {
        if (res.status === 401) {
          window.location.href = API_PATHS.OAUTH2_URL;
          return;
        }
        const data = await res.json();
        setCurrentUser(data);
      })
      .catch(() => {
        window.location.href = API_PATHS.OAUTH2_URL;
      })
      .finally(() => setLoading(false));
  }, []);

  const renderPage = () => {
    if (!currentUser) {
      return null; // Or a loading spinner
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
        return <TasksPage  currentUser={currentUser} />;
      case "task-types":
        return <TaskTypePage currentUser={currentUser} />;
      default:
        return <DashboardPage currentUser={currentUser} />;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading screen
  }
  if (!currentUser) {
    return <div>Error loading user data.</div>; // Or a redirect to a login page
  }
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
