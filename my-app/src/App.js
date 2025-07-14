import React, { useState, useEffect } from 'react';
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
import WeeklyTasksView from './components/tasks/WeeklyTasksView';
import TaskDistributionView from './components/tasks/TaskDistributionView';
import SupportRequestView from './components/requests/SupportRequestView';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingSpinner from './components/shared/LoadingSpinner';
import NotificationSystem from './components/shared/NotificationSystem';
import AIInsights from './components/dashboards/AIInsights';

// Data - ONLY for initial setup if Firebase is empty
import { mockInventory, mockInventoryLog, mockProjects, mockWorkers, mockPlans } from './data/mockData';

// Firebase Services
import {
  inventoryService,
  inventoryLogService,
  projectsService,
  workersService,
  tasksService,
  plansService,
  dailyLogsService,
  attendanceService,
  clientPortfolioService,
  milestonesService,
  statisticsService,
  initializeFirebaseData
} from './services/firebaseService';

// Weekly Tasks Service
import { weeklyTasksService } from './services/weeklyTasksService';

// Support Request Service
import { supportRequestService } from './services/supportRequestService';

// UserContext
import { UserContext } from './contexts/UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // State for real-time data from Firebase ONLY
  const [inventory, setInventory] = useState([]);
  const [inventoryLog, setInventoryLog] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [clientPortfolio, setClientPortfolio] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [firebaseDataLoaded, setFirebaseDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Add notification function
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Initialize Firebase data and set up real-time listeners
  useEffect(() => {
    let unsubscribes = [];
    
    const initializeApp = async () => {
      try {
        setConnectionStatus('connecting');
        addNotification('جاري الاتصال بقاعدة البيانات...', 'info');

        // Initialize Firebase data only if collections are empty
        if (!dataInitialized) {
          const mockData = {
            inventory: mockInventory,
            projects: mockProjects,
            workers: mockWorkers,
            plans: mockPlans
          };
          
          const initialized = await initializeFirebaseData(mockData);
          setDataInitialized(true);
          
          if (initialized) {
            addNotification('تم تهيئة البيانات الأولية بنجاح', 'success');
          }
        }

        // Set up real-time listeners for all collections
        const inventoryUnsub = inventoryService.subscribeToInventory(
          (data) => {
            setInventory(data);
            console.log('Inventory updated:', data.length, 'items');
          },
          (error) => {
            console.error('Inventory subscription error:', error);
            addNotification('خطأ في تحميل المخزون', 'error');
          }
        );

        const inventoryLogUnsub = inventoryLogService.subscribeToInventoryLog(
          (data) => {
            setInventoryLog(data);
            console.log('Inventory log updated:', data.length, 'entries');
          },
          (error) => {
            console.error('Inventory log subscription error:', error);
          }
        );

        const projectsUnsub = projectsService.subscribeToProjects(
          (data) => {
            setProjects(data);
            console.log('Projects updated:', data.length, 'projects');
          },
          (error) => {
            console.error('Projects subscription error:', error);
            addNotification('خطأ في تحميل المشاريع', 'error');
          }
        );

        const workersUnsub = workersService.subscribeToWorkers(
          (data) => {
            setWorkers(data);
            console.log('Workers updated:', data.length, 'workers');
          },
          (error) => {
            console.error('Workers subscription error:', error);
            addNotification('خطأ في تحميل العمال', 'error');
          }
        );

        const tasksUnsub = tasksService.subscribeToTasks(
          (data) => {
            setTasks(data);
            console.log('Tasks updated:', data.length, 'tasks');
          },
          (error) => {
            console.error('Tasks subscription error:', error);
            addNotification('خطأ في تحميل المهام', 'error');
          }
        );

        const plansUnsub = plansService.subscribeToPlans(
          (data) => {
            setPlans(data);
            console.log('Plans updated:', data.length, 'plans');
          },
          (error) => {
            console.error('Plans subscription error:', error);
          }
        );

        const dailyLogsUnsub = dailyLogsService.subscribeToDailyLogs(
          (data) => {
            setDailyLogs(data);
            console.log('Daily logs updated:', data.length, 'logs');
          },
          (error) => {
            console.error('Daily logs subscription error:', error);
          }
        );

        const attendanceUnsub = attendanceService.subscribeToAttendance(
          (data) => {
            setAttendanceData(data);
            console.log('Attendance updated:', data.length, 'records');
          },
          (error) => {
            console.error('Attendance subscription error:', error);
          }
        );

        const clientsUnsub = clientPortfolioService.subscribeToClients(
          (data) => {
            setClientPortfolio(data);
            console.log('Clients updated:', data.length, 'clients');
          },
          (error) => {
            console.error('Clients subscription error:', error);
          }
        );

        const milestonesUnsub = milestonesService.subscribeToMilestones(
          (data) => {
            setMilestones(data);
            console.log('Milestones updated:', data.length, 'milestones');
          },
          (error) => {
            console.error('Milestones subscription error:', error);
          }
        );

        const statisticsUnsub = statisticsService.subscribeToStatistics(
          (data) => {
            setStatistics(data);
            console.log('Statistics updated:', data.length, 'records');
          },
          (error) => {
            console.error('Statistics subscription error:', error);
          }
        );

        const supportRequestsUnsub = supportRequestService.subscribeToRequests(
          (data) => {
            setSupportRequests(data);
            console.log('Support requests updated:', data.length, 'requests');
          },
          (error) => {
            console.error('Support requests subscription error:', error);
            addNotification('خطأ في تحميل طلبات الدعم', 'error');
          }
        );

        // Store all unsubscribe functions
        unsubscribes = [
          inventoryUnsub,
          inventoryLogUnsub,
          projectsUnsub,
          workersUnsub,
          tasksUnsub,
          plansUnsub,
          dailyLogsUnsub,
          attendanceUnsub,
          clientsUnsub,
          milestonesUnsub,
          statisticsUnsub,
          supportRequestsUnsub
        ];

        setConnectionStatus('connected');
        setFirebaseDataLoaded(true);
        setIsLoading(false);
        addNotification('تم الاتصال بقاعدة البيانات بنجاح', 'success');

      } catch (error) {
        console.error('Error initializing app:', error);
        setError(error.message);
        setConnectionStatus('error');
        setIsLoading(false);
        addNotification('فشل في الاتصال بقاعدة البيانات', 'error');
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      unsubscribes.forEach(unsub => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, []); // Remove dataInitialized from dependencies to prevent re-initialization

  // Action handlers for inventory
  const inventoryActions = {
    addItem: async (item) => {
      try {
        await inventoryService.addInventoryItem(item);
        addNotification('تمت إضافة العنصر بنجاح', 'success');
      } catch (error) {
        console.error('Error adding inventory item:', error);
        addNotification('فشل في إضافة العنصر', 'error');
        throw error;
      }
    },
    updateItem: async (itemId, updates) => {
      try {
        await inventoryService.updateInventoryItem(itemId, updates);
        addNotification('تم تحديث العنصر بنجاح', 'success');
      } catch (error) {
        console.error('Error updating inventory item:', error);
        addNotification('فشل في تحديث العنصر', 'error');
        throw error;
      }
    },
    deleteItem: async (itemId) => {
      try {
        await inventoryService.deleteInventoryItem(itemId);
        addNotification('تم حذف العنصر بنجاح', 'success');
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        addNotification('فشل في حذف العنصر', 'error');
        throw error;
      }
    },
    addLog: async (logEntry) => {
      try {
        await inventoryLogService.addInventoryLog(logEntry);
      } catch (error) {
        console.error('Error adding inventory log:', error);
        throw error;
      }
    }
  };

  // Action handlers for projects
  const projectActions = {
    addProject: async (project) => {
      try {
        const projectId = await projectsService.addProject(project);
        
        // Add client to portfolio
        if (project.client) {
          await clientPortfolioService.addOrUpdateClient({
            name: project.client.name,
            phone: project.client.phone,
            email: project.client.email,
            projectValue: project.budget
          });
        }
        
        addNotification('تمت إضافة المشروع بنجاح', 'success');
        return projectId;
      } catch (error) {
        console.error('Error adding project:', error);
        addNotification('فشل في إضافة المشروع', 'error');
        throw error;
      }
    },
    updateProject: async (projectId, updates) => {
      try {
        await projectsService.updateProject(projectId, updates);
        addNotification('تم تحديث المشروع بنجاح', 'success');
      } catch (error) {
        console.error('Error updating project:', error);
        addNotification('فشل في تحديث المشروع', 'error');
        throw error;
      }
    },
    deleteProject: async (projectId) => {
      try {
        await projectsService.deleteProject(projectId);
        addNotification('تم حذف المشروع بنجاح', 'success');
      } catch (error) {
        console.error('Error deleting project:', error);
        addNotification('فشل في حذف المشروع', 'error');
        throw error;
      }
    }
  };

  // Action handlers for workers
  const workerActions = {
    addWorker: async (worker) => {
      try {
        await workersService.addWorker(worker);
        addNotification('تمت إضافة العامل بنجاح', 'success');
      } catch (error) {
        console.error('Error adding worker:', error);
        addNotification('فشل في إضافة العامل', 'error');
        throw error;
      }
    },
    updateWorker: async (workerId, updates) => {
      try {
        await workersService.updateWorker(workerId, updates);
        addNotification('تم تحديث بيانات العامل بنجاح', 'success');
      } catch (error) {
        console.error('Error updating worker:', error);
        addNotification('فشل في تحديث بيانات العامل', 'error');
        throw error;
      }
    },
    deleteWorker: async (workerId) => {
      try {
        await workersService.deleteWorker(workerId);
        addNotification('تم حذف العامل بنجاح', 'success');
      } catch (error) {
        console.error('Error deleting worker:', error);
        addNotification('فشل في حذف العامل', 'error');
        throw error;
      }
    }
  };

  // Action handlers for tasks
  const taskActions = {
    addTask: async (task) => {
      try {
        await tasksService.addTask(task);
        addNotification('تمت إضافة المهمة بنجاح', 'success');
      } catch (error) {
        console.error('Error adding task:', error);
        addNotification('فشل في إضافة المهمة', 'error');
        throw error;
      }
    },
    updateTask: async (taskId, updates) => {
      try {
        await tasksService.updateTask(taskId, updates);
        addNotification('تم تحديث المهمة بنجاح', 'success');
      } catch (error) {
        console.error('Error updating task:', error);
        addNotification('فشل في تحديث المهمة', 'error');
        throw error;
      }
    },
    deleteTask: async (taskId) => {
      try {
        await tasksService.deleteTask(taskId);
        addNotification('تم حذف المهمة بنجاح', 'success');
      } catch (error) {
        console.error('Error deleting task:', error);
        addNotification('فشل في حذف المهمة', 'error');
        throw error;
      }
    }
  };

  // Action handlers for attendance
  const attendanceActions = {
    recordAttendance: async (attendanceData) => {
      try {
        await attendanceService.recordAttendance(attendanceData);
        addNotification('تم تسجيل الحضور بنجاح', 'success');
      } catch (error) {
        console.error('Error recording attendance:', error);
        addNotification('فشل في تسجيل الحضور', 'error');
        throw error;
      }
    },
    getTodayAttendance: async (workerId) => {
      try {
        return await attendanceService.getTodayAttendance(workerId);
      } catch (error) {
        console.error('Error getting today attendance:', error);
        throw error;
      }
    }
  };

  // Action handlers for daily logs
  const dailyLogActions = {
    addDailyLog: async (log) => {
      try {
        await dailyLogsService.addDailyLog(log);
        addNotification('تم حفظ التقرير اليومي بنجاح', 'success');
      } catch (error) {
        console.error('Error adding daily log:', error);
        addNotification('فشل في حفظ التقرير اليومي', 'error');
        throw error;
      }
    },
    updateDailyLog: async (logId, updates) => {
      try {
        await dailyLogsService.updateDailyLog(logId, updates);
        addNotification('تم تحديث التقرير اليومي بنجاح', 'success');
      } catch (error) {
        console.error('Error updating daily log:', error);
        addNotification('فشل في تحديث التقرير اليومي', 'error');
        throw error;
      }
    }
  };

  // Action handlers for weekly tasks
  const weeklyTasksActions = {
    getWeeklyPlan: async (projectId, weekNumber, year) => {
      try {
        return await weeklyTasksService.getWeeklyPlan(projectId, weekNumber, year);
      } catch (error) {
        console.error('Error getting weekly plan:', error);
        addNotification('فشل في تحميل خطة الأسبوع', 'error');
        throw error;
      }
    },
    addWeeklyTask: async (taskData) => {
      try {
        await weeklyTasksService.addWeeklyTask(taskData);
        addNotification('تمت إضافة المهمة الأسبوعية بنجاح', 'success');
      } catch (error) {
        console.error('Error adding weekly task:', error);
        addNotification('فشل في إضافة المهمة الأسبوعية', 'error');
        throw error;
      }
    },
    updateWeeklyTask: async (taskId, updates) => {
      try {
        await weeklyTasksService.updateWeeklyTask(taskId, updates);
        addNotification('تم تحديث المهمة الأسبوعية بنجاح', 'success');
      } catch (error) {
        console.error('Error updating weekly task:', error);
        addNotification('فشل في تحديث المهمة الأسبوعية', 'error');
        throw error;
      }
    },
    deleteWeeklyTask: async (taskId) => {
      try {
        await weeklyTasksService.deleteWeeklyTask(taskId);
        addNotification('تم حذف المهمة الأسبوعية بنجاح', 'success');
      } catch (error) {
        console.error('Error deleting weekly task:', error);
        addNotification('فشل في حذف المهمة الأسبوعية', 'error');
        throw error;
      }
    },
    copyWeekTasks: async (projectId, fromWeek, fromYear, toWeek, toYear) => {
      try {
        await weeklyTasksService.copyWeekTasks(projectId, fromWeek, fromYear, toWeek, toYear);
        addNotification('تم نسخ مهام الأسبوع بنجاح', 'success');
      } catch (error) {
        console.error('Error copying week tasks:', error);
        addNotification('فشل في نسخ مهام الأسبوع', 'error');
        throw error;
      }
    },
    sendWeeklyPlan: async (projectId, weekNumber, year) => {
      try {
        await weeklyTasksService.sendWeeklyPlan(projectId, weekNumber, year);
        addNotification('تم إرسال خطة الأسبوع بنجاح', 'success');
      } catch (error) {
        console.error('Error sending weekly plan:', error);
        addNotification('فشل في إرسال خطة الأسبوع', 'error');
        throw error;
      }
    },
    assignTaskToWorkers: async (taskId, workerIds) => {
      try {
        await weeklyTasksService.assignTaskToWorkers(taskId, workerIds);
        addNotification('تم توزيع المهمة على العمال بنجاح', 'success');
      } catch (error) {
        console.error('Error assigning task to workers:', error);
        addNotification('فشل في توزيع المهمة على العمال', 'error');
        throw error;
      }
    }
  };

  // Action handlers for support requests
  const supportRequestActions = {
    getAllRequests: async () => {
      try {
        return await supportRequestService.getAllRequests();
      } catch (error) {
        console.error('Error getting support requests:', error);
        addNotification('فشل في تحميل طلبات الدعم', 'error');
        throw error;
      }
    },
    addRequest: async (requestData) => {
      try {
        await supportRequestService.addRequest(requestData);
        addNotification('تم إرسال الطلب بنجاح', 'success');
      } catch (error) {
        console.error('Error adding support request:', error);
        addNotification('فشل في إرسال الطلب', 'error');
        throw error;
      }
    },
    updateRequest: async (requestId, updates) => {
      try {
        await supportRequestService.updateRequest(requestId, updates);
        addNotification('تم تحديث الطلب بنجاح', 'success');
      } catch (error) {
        console.error('Error updating support request:', error);
        addNotification('فشل في تحديث الطلب', 'error');
        throw error;
      }
    },
    deleteRequest: async (requestId) => {
      try {
        await supportRequestService.deleteRequest(requestId);
        addNotification('تم حذف الطلب بنجاح', 'success');
      } catch (error) {
        console.error('Error deleting support request:', error);
        addNotification('فشل في حذف الطلب', 'error');
        throw error;
      }
    }
  };

  // Handle login
  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    addNotification(`مرحباً ${user.displayName}`, 'success');
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    addNotification('تم تسجيل الخروج بنجاح', 'info');
  };

  // أضف خيار لوحة الإدارة المالية في التنقل
  // تم حذف الاستيراد: const goToFinancialDashboard = () => setCurrentView('financial');
  // تم حذف خيار التنقل
  // تم حذف شرط عرض FinancialDashboard

  // أضف خيار صفحة الذكاء الاصطناعي في التنقل
  const goToAIInsights = () => setCurrentView('ai');

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">جاري تحميل التطبيق...</p>
          <p className="text-sm text-gray-500 mt-2">حالة الاتصال: {connectionStatus}</p>
        </div>
      </div>
    );
  }

  // Show error screen
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ في التطبيق</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!currentUser) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <LoginView onLogin={handleLogin} />
          <NotificationSystem notifications={notifications} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <div className="min-h-screen bg-gray-50">
          <Header 
            currentUser={currentUser} 
            currentView={currentView}
            setCurrentView={setCurrentView}
            onLogout={handleLogout}
            connectionStatus={connectionStatus}
            // تم حذف تمرير onGoToFinancialDashboard للهيدر
            onGoToAIInsights={goToAIInsights}
          />
          
          <NotificationSystem notifications={notifications} />

          <main className="pt-16">
            {currentView === 'dashboard' && currentUser?.type === 'contractor' && (
              <ContractorDashboard 
                currentUser={currentUser}
                projects={projects}
                inventory={inventory}
                clientPortfolio={clientPortfolio}
                milestones={milestones}
                statistics={statistics}
                projectActions={projectActions}
              />
            )}

            {currentView === 'dashboard' && currentUser?.type === 'architect' && (
              <ArchitectDashboard 
                currentUser={currentUser}
                projects={projects}
                plans={plans}
              />
            )}

            {currentView === 'dashboard' && currentUser?.type === 'worker' && (
              <WorkerDashboard 
                currentUser={currentUser}
                tasks={tasks}
                projects={projects}
                attendanceData={attendanceData}
              />
            )}

            {currentView === 'dashboard' && currentUser?.type === 'site_manager' && (
              <SiteManagerDashboard 
                currentUser={currentUser}
                projects={projects}
                workers={workers}
                tasks={tasks}
                dailyLogs={dailyLogs}
                attendanceData={attendanceData}
              />
            )}

            {currentView === 'dashboard' && !['contractor', 'architect', 'worker', 'site_manager'].includes(currentUser?.type) && (
              <DefaultDashboard 
                currentUser={currentUser}
                projects={projects}
                tasks={tasks}
              />
            )}

            {currentView === 'inventory' && (
              <InventoryView 
                currentUser={currentUser}
                inventory={inventory}
                inventoryLog={inventoryLog}
                inventoryActions={inventoryActions}
              />
            )}

            {currentView === 'statistics' && (
              <StatisticsView 
                currentUser={currentUser}
                projects={projects}
                workers={workers}
                inventory={inventory}
                tasks={tasks}
                statistics={statistics}
                attendanceData={attendanceData}
              />
            )}

            {currentView === 'profile' && (
              <ProfileView 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            )}

            {currentView === 'tasks' && (
              <TasksView 
                currentUser={currentUser}
                tasks={tasks}
                projects={projects}
                workers={workers}
                taskActions={taskActions}
              />
            )}

            {currentView === 'weekly-tasks' && (
              <WeeklyTasksView 
                currentUser={currentUser}
                projects={projects}
                workers={workers}
                weeklyTasksActions={weeklyTasksActions}
                taskActions={taskActions}
              />
            )}

            {currentView === 'task-distribution' && currentUser?.type === 'site_manager' && (
              <TaskDistributionView 
                currentUser={currentUser}
                projects={projects}
                workers={workers}
                weeklyTasksActions={weeklyTasksActions}
                workerActions={workerActions}
              />
            )}

            {currentView === 'projects' && currentUser?.type === 'contractor' && (
              <ProjectsManagement 
                currentUser={currentUser}
                projects={projects}
                workers={workers}
                clientPortfolio={clientPortfolio}
                projectActions={projectActions}
              />
            )}

            {currentView === 'daily-log' && currentUser?.type === 'site_manager' && (
              <DailyLogView 
                currentUser={currentUser}
                projects={projects}
                workers={workers}
                inventory={inventory}
                tasks={tasks}
                dailyLogs={dailyLogs}
                attendanceData={attendanceData}
                dailyLogActions={dailyLogActions}
              />
            )}

            {currentView === 'workers' && (
              <WorkersManagement 
                currentUser={currentUser}
                workers={workers}
                projects={projects}
                attendanceData={attendanceData}
                workerActions={workerActions}
                attendanceActions={attendanceActions}
              />
            )}

            {currentView === 'support-requests' && (
              <SupportRequestView 
                currentUser={currentUser}
                projects={projects}
                supportRequestActions={supportRequestActions}
              />
            )}

            {currentView === 'ai' && (
              <AIInsights />
            )}
          </main>

          <Footer />
        </div>
      </UserContext.Provider>
    </ErrorBoundary>
  );
}

export default App;