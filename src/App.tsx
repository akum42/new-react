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
const USER_API_URL = "http://localhost:8080/api/users/me";
const USER_API_ROLE_URL = "http://localhost:8080/api/users/role";
const OAUTH2_URL = "http://localhost:8080/oauth2/authorization/google";

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
    fetch(USER_API_URL, {
      credentials: 'include'  // send cookies for session
    }).then(async res => {
        if (res.status === 401) {
          window.location.href = OAUTH2_URL;
          return;
        }
        const data = await res.json();
        setCurrentUser(data);
      })
      .catch(() => {
        window.location.href = OAUTH2_URL;
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
