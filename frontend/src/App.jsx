import React, { useContext } from 'react';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import TaskForm from './components/TaskForm';
import Toolbar from './components/Toolbar';
import TaskList from './components/TaskList';
import { TaskProvider, TaskContext } from './context/TaskContext';
import { Info } from 'lucide-react';

const DashboardContent = () => {
  const { toast } = useContext(TaskContext);

  return (
    <div className="app-container">
      {/* Brand Header */}
      <Header />

      {/* Main Grid Dashboard */}
      <main className="dashboard-grid">
        {/* Left Side: Create form & Progress analytics */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TaskForm />
          <StatsPanel />
        </section>

        {/* Right Side: Filters, Sorting and Grid Lists */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Toolbar />
          <TaskList />
        </section>
      </main>

      {/* Toast Alert Notification */}
      {toast.show && (
        <div className="toast-alert" role="status" aria-live="polite">
          <Info size={18} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
};

export default App;
