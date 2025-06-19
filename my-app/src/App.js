import React, { useState, useEffect } from 'react';
import './App.css';

import LoginView from './components/auth/LoginView';
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

import { mockInventory, mockProjects, mockWorkers, mockPlans } from './data/mockData';
import {
  inventoryService,
  inventoryLogService,
  projectsService,
  workersService,
  tasksService,
  plansService,
  dailyLogsService,
  initializeFirebaseData
} from './services/firebaseService';

import { UserContext } from './contexts/UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [inventoryLog, setInventoryLog] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!dataInitialized) {
          await initializeFirebaseData({
            inventory: mockInventory,
            projects: mockProjects,
            workers: mockWorkers,
            plans: mockPlans
          });
          setDataInitialized(true);
        }

        const unsubscribes = [
          inventoryService.subscribeToInventory(setInventory),
          inventoryLogService.subscribeToInventoryLog(setInventoryLog),
          projectsService.subscribeToProjects(setProjects),
          workersService.subscribeToWorkers(setWorkers),
          tasksService.subscribeToTasks(setTasks),
          plansService.subscribeToPlans(setPlans),
          dailyLogsService.subscribeToDailyLogs(setDailyLogs),
        ];

        setIsLoading(false);
        return () => unsubscribes.forEach(unsub => unsub());
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dataInitialized]);

  const handleLogin = (userData) => setCurrentUser(userData);
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  if (!currentUser) return <LoginView onLogin={handleLogin} />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        <header className="App-header">
          <div className="App-logo">LOGO</div>
        </header>

        <nav className="App-tabs">
          <div className="App-tab" onClick={() => setCurrentView('dashboard')}>Dashboard</div>
          <div className="App-tab" onClick={() => setCurrentView('inventory')}>Inventory</div>
          <div className="App-tab" onClick={() => setCurrentView('tasks')}>Tasks</div>
          <div className="App-tab" onClick={() => setCurrentView('projects')}>Projects</div>
          <div className="App-tab" onClick={() => setCurrentView('statistics')}>Statistics</div>
          <div className="App-tab" onClick={() => setCurrentView('workers')}>Workers</div>
          <div className="App-tab" onClick={() => setCurrentView('profile')}>Profile</div>
          <div className="App-tab" onClick={handleLogout}>Logout</div>
        </nav>

        <main className="App-content">
          {currentView === 'dashboard' && (
            <>
              {currentUser.type === 'contractor' && <ContractorDashboard projects={projects} inventory={inventory} />}
              {currentUser.type === 'architect' && <ArchitectDashboard plans={plans} />}
              {currentUser.type === 'worker' && <WorkerDashboard workers={workers} currentUser={currentUser} tasks={tasks} />}
              {currentUser.type === 'site_manager' && <SiteManagerDashboard currentUser={currentUser} projects={projects} inventory={inventory} workers={workers} />}
              {!['contractor', 'architect', 'worker', 'site_manager'].includes(currentUser.type) && <DefaultDashboard currentUser={currentUser} />}
            </>
          )}
          {currentView === 'inventory' && <InventoryView inventory={inventory} inventoryLog={inventoryLog} currentUser={currentUser} />}
          {currentView === 'tasks' && <TasksView currentUser={currentUser} inventory={inventory} workers={workers} tasks={tasks} />}
          {currentView === 'statistics' && <StatisticsView inventory={inventory} projects={projects} tasks={tasks} currentUser={currentUser} workers={workers} />}
          {currentView === 'profile' && <ProfileView currentUser={currentUser} />}
          {currentView === 'projects' && <ProjectsManagement currentUser={currentUser} projects={projects} />}
          {currentView === 'workers' && <WorkersManagement currentUser={currentUser} workers={workers} />}
          {currentView === 'daily-log' && <DailyLogView currentUser={currentUser} projects={projects} workers={workers} inventory={inventory} dailyLogs={dailyLogs} />}
        </main>

        <button className="App-button" onClick={() => alert("Action clicked!")}>Sticky Action</button>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default App;
