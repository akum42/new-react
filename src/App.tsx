import { useState, useEffect } from "react";
import { useAuthRedirect } from "./hooks/useAuthRedirect";
import { Sidebar } from "./components/sidebar";
import Dashboard from "./components/dashboard";
import Employee from "./components/employee";
import Client from "./components/client";
import Billing from "./components/billing";
import Task from "./components/task";
import { UserRoundPen } from "lucide-react";

type Page = "dashboard" | "employees" | "clients" | "billing" | "tasks";

type User = {
  id: string;
  name: string;
  role: "admin" | "manager" | "employee";
  email: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/users/me', {
      credentials: 'include'  // send cookies for session
    })
      .then(async res => {
        if (res.status === 401) {
          // Not logged in, redirect to Google OAuth login
          window.location.href = 'http://localhost:8080/oauth2/authorization/google';
          return;
        }
        const data = await res.json();
        setCurrentUser(data);
      })
      .catch(() => {
        // In case of network error, also redirect or handle accordingly
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
      })
      .finally(() => setLoading(false));
  }, []);

  const renderPage = () => {
    if (!currentUser) {
      return null; // Or a loading spinner
    }
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
