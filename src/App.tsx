import { useEffect } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import { useTheme } from './context/theme-provider';
import { NAVIGATION_PATHS } from './constants/navigation';

import Home from './views/Home/Home';
import { Navbar } from '@/components/layout/navbar';
import UsersPage from '@/views/Users/UsersPage';
import ClientsPage from '@/views/Clients/ClientsPage';
import BillingPage from '@/views/Billing/BillingPage';
import TasksPage from '@/views/Tasks/TasksPage';
import DashboardPage from '@/views/Dashboard/DashboardPage';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={NAVIGATION_PATHS.DASHBOARD_PATH} element={<DashboardPage />} />
        <Route path={NAVIGATION_PATHS.USERS_PATH} element={<UsersPage />} />
        <Route path={NAVIGATION_PATHS.CLIENTS_PATH} element={<ClientsPage />} />
        <Route path={NAVIGATION_PATHS.BILLING_PATH} element={<BillingPage />} />
        <Route path={NAVIGATION_PATHS.TASKS_PATH} element={<TasksPage />} />
      </Route>
    </Routes>
  );
}

export default App;
