import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex h-screen bg-bg-app text-text-main overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
