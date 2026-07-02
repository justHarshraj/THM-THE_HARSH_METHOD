import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Link as LinkIcon, 
  BarChart2, 
  Settings,
  BookOpen,
  Command
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Day Planner', path: '/planner', icon: Calendar },
  { name: 'Todo Lists', path: '/todos', icon: CheckSquare },
  { name: 'Link Vault', path: '/links', icon: LinkIcon },
  { name: 'Notes', path: '/notes', icon: BookOpen },
  { name: 'Statistics', path: '/statistics', icon: BarChart2 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-bg-app border-r border-border-subtle flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border-subtle">
        <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center shadow-lg shadow-accent/20">
            <Command className="w-5 h-5 text-bg-app" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            THM
          </span>
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "bg-bg-card text-text-main" 
                  : "text-text-muted hover:bg-bg-card hover:text-text-main"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-text-muted">
          <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center border border-border-subtle">
            H
          </div>
          <div>
            <p className="font-medium text-text-main">Harsh</p>
            <p className="text-xs">Productivity OS</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
