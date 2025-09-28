import { NavLink } from 'react-router-dom';
import { NAVIGATION_PATHS } from '@/constants/navigation';
import { cn } from '@/lib/utils';

const links = [
  { to: NAVIGATION_PATHS.HOME_PATH, label: 'Home' },
  { to: NAVIGATION_PATHS.DASHBOARD_PATH, label: 'Dashboard' },
  { to: NAVIGATION_PATHS.USERS_PATH, label: 'Users' },
  { to: NAVIGATION_PATHS.CLIENTS_PATH, label: 'Clients' },
  { to: NAVIGATION_PATHS.BILLING_PATH, label: 'Billing' },
  { to: NAVIGATION_PATHS.TASKS_PATH, label: 'Tasks' },
];

export function Navbar() {
  return (
    <header className="border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <nav className="container flex h-14 items-center gap-4">
        <div className="font-semibold">BPM</div>
        <ul className="flex items-center gap-3 text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-accent text-accent-foreground'
                  )
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
