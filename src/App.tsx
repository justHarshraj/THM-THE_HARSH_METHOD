import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './store';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './features/dashboard/Dashboard';
import { DayPlanner } from './features/day-planner/DayPlanner';
import { TodoSystem } from './features/todo-system/TodoSystem';
import { LinkVault } from './features/link-vault/LinkVault';
import { Statistics } from './features/statistics/Statistics';

function App() {
  const checkDailyReset = useAppStore((state) => state.checkDailyReset);

  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<DayPlanner />} />
          <Route path="todos" element={<TodoSystem />} />
          <Route path="links" element={<LinkVault />} />
          <Route path="notes" element={<div className="p-4">Notes (Coming Soon)</div>} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<div className="p-4">Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
