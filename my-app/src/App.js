import React, { useState } from 'react';
import './App.css';

// Components
import LoginView from './components/auth/LoginView';
import Header from './components/layout/Header';
import Footer from './components/shared/Footer';
import ContractorDashboard from './components/dashboards/ContractorDashboard';
import ArchitectDashboard from './components/dashboards/ArchitectDashboard';
import WorkerDashboard from './components/dashboards/WorkerDashboard';
import DefaultDashboard from './components/dashboards/DefaultDashboard';
import SiteManagerDashboard from './components/dashboards/SiteMangerDashboard';
import InventoryView from './components/inventory/InventoryView';
import StatisticsView from './components/statistics/StatisticsView';
import ProfileView from './components/profile/ProfileView';
import WorkersManagement from './components/workers/WorkersManagement';
import TasksView from './components/tasks/TasksView';
import ProjectsManagement from './components/projects/ProjectsManagement';
import DailyLogView from './components/tasks/DailyLogView';
// Data
import { mockInventory, mockInventoryLog, mockProjects, mockWorkers, mockPlans } from './data/mockData';

// UserContext
import { UserContext } from './contexts/UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [inventory, setInventory] = useState(mockInventory);
  const [inventoryLog, setInventoryLog] = useState(mockInventoryLog);
  const [projects] = useState(mockProjects);
  const [workers] = useState(mockWorkers);
  const [plans] = useState(mockPlans);

  const [tasks] = useState([]);

  const addInventoryLog = (itemId, itemName, action, quantity, previousStock, newStock, reason) => {
    const newLog = {
      id: Date.now(),
      itemId,
      itemName,
      action,
      quantity,
      previousStock,
      newStock,
      reason,
      user: currentUser?.displayName || 'مستخدم',
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    setInventoryLog(prev => [newLog, ...prev]);
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const lowStockCount = inventory.filter(item => item.currentStock <= item.minStock).length;

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header 
          currentUser={currentUser}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
          lowStockCount={lowStockCount}
        />

        <main className="flex-1">
          {currentView === 'dashboard' && (
            <>
              {currentUser.type === 'contractor' && (
                <ContractorDashboard projects={projects} inventory={inventory} />
              )}
              {currentUser.type === 'architect' && (
                <ArchitectDashboard plans={plans} />
              )}
              {currentUser.type === 'worker' && (
                <WorkerDashboard workers={workers} currentUser={currentUser} />
              )}
              {currentUser.type === 'site_manager' && (
                <SiteManagerDashboard 
                  currentUser={currentUser}
                  projects={projects}
                  inventory={inventory}
                  workers={workers}
                  onViewChange={handleViewChange}
                />
              )}
              {!['contractor', 'architect', 'worker', 'site_manager'].includes(currentUser.type) && (
                <DefaultDashboard currentUser={currentUser} />
              )}
            </>
          )}

          {currentView === 'inventory' && (
            <InventoryView 
              inventory={inventory}
              setInventory={setInventory}
              inventoryLog={inventoryLog}
              addInventoryLog={addInventoryLog}
              currentUser={currentUser}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView 
              currentUser={currentUser}
              inventory={inventory}
              workers={workers}
            />
          )}

          {currentView === 'statistics' && (
            <StatisticsView 
              inventory={inventory}
              projects={projects}
              tasks={tasks}
              currentUser={currentUser}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView currentUser={currentUser} />
          )}

          {currentView === 'projects' && currentUser?.type === 'contractor' && (
            <ProjectsManagement currentUser={currentUser} />
          )}

          {currentView === 'daily-log' && currentUser?.type === 'site_manager' && (
            <DailyLogView 
              currentUser={currentUser}
              projects={projects}
              workers={workers}
              inventory={inventory}
            />
          )}

          {currentView === 'workers' && (
            <WorkersManagement currentUser={currentUser} />
          )}
        </main>

        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default App;
