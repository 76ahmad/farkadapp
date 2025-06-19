// firebaseService.js
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collections names
const COLLECTIONS = {
  INVENTORY: 'inventory',
  INVENTORY_LOG: 'inventoryLog',
  PROJECTS: 'projects',
  WORKERS: 'workers',
  TASKS: 'tasks',
  PLANS: 'plans',
  DAILY_LOGS: 'dailyLogs'
};

// Inventory Functions
export const inventoryService = {
  // Get all inventory items with real-time updates
  subscribeToInventory: (callback) => {
    const q = query(collection(db, COLLECTIONS.INVENTORY), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      const inventory = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(inventory);
    });
  },

  // Add new inventory item
  addInventoryItem: async (item) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.INVENTORY), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  },

  // Update inventory item
  updateInventoryItem: async (itemId, updates) => {
    try {
      const itemRef = doc(db, COLLECTIONS.INVENTORY, itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  },

  // Delete inventory item
  deleteInventoryItem: async (itemId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.INVENTORY, itemId));
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }
};

// Inventory Log Functions
export const inventoryLogService = {
  // Subscribe to inventory log with real-time updates
  subscribeToInventoryLog: (callback) => {
    const q = query(collection(db, COLLECTIONS.INVENTORY_LOG), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to readable format
        date: doc.data().createdAt?.toDate().toLocaleDateString('ar-EG') || '',
        time: doc.data().createdAt?.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) || ''
      }));
      callback(logs);
    });
  },

  // Add inventory log entry
  addInventoryLog: async (logEntry) => {
    try {
      await addDoc(collection(db, COLLECTIONS.INVENTORY_LOG), {
        ...logEntry,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding inventory log:', error);
      throw error;
    }
  }
};

// Projects Functions
export const projectsService = {
  // Subscribe to projects
  subscribeToProjects: (callback) => {
    const q = query(collection(db, COLLECTIONS.PROJECTS), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(projects);
    });
  },

  // Add new project
  addProject: async (project) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, updates) => {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROJECTS, projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

// Workers Functions
export const workersService = {
  // Subscribe to workers
  subscribeToWorkers: (callback) => {
    const q = query(collection(db, COLLECTIONS.WORKERS), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      const workers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(workers);
    });
  },

  // Add new worker
  addWorker: async (worker) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.WORKERS), {
        ...worker,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding worker:', error);
      throw error;
    }
  },

  // Update worker
  updateWorker: async (workerId, updates) => {
    try {
      const workerRef = doc(db, COLLECTIONS.WORKERS, workerId);
      await updateDoc(workerRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating worker:', error);
      throw error;
    }
  },

  // Delete worker
  deleteWorker: async (workerId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.WORKERS, workerId));
    } catch (error) {
      console.error('Error deleting worker:', error);
      throw error;
    }
  }
};

// Tasks Functions
export const tasksService = {
  // Subscribe to tasks
  subscribeToTasks: (callback) => {
    const q = query(collection(db, COLLECTIONS.TASKS), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(tasks);
    });
  },

  // Add new task
  addTask: async (task) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TASKS), {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, updates) => {
    try {
      const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

// Plans Functions
export const plansService = {
  // Subscribe to plans
  subscribeToPlans: (callback) => {
    const q = query(collection(db, COLLECTIONS.PLANS), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const plans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(plans);
    });
  },

  // Add new plan
  addPlan: async (plan) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PLANS), {
        ...plan,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding plan:', error);
      throw error;
    }
  },

  // Update plan
  updatePlan: async (planId, updates) => {
    try {
      const planRef = doc(db, COLLECTIONS.PLANS, planId);
      await updateDoc(planRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  },

  // Delete plan
  deletePlan: async (planId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PLANS, planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }
};

// Daily Logs Functions
export const dailyLogsService = {
  // Subscribe to daily logs
  subscribeToDailyLogs: (callback) => {
    const q = query(collection(db, COLLECTIONS.DAILY_LOGS), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(logs);
    });
  },

  // Add new daily log
  addDailyLog: async (log) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.DAILY_LOGS), {
        ...log,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding daily log:', error);
      throw error;
    }
  },

  // Update daily log
  updateDailyLog: async (logId, updates) => {
    try {
      const logRef = doc(db, COLLECTIONS.DAILY_LOGS, logId);
      await updateDoc(logRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating daily log:', error);
      throw error;
    }
  },

  // Delete daily log
  deleteDailyLog: async (logId) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.DAILY_LOGS, logId));
    } catch (error) {
      console.error('Error deleting daily log:', error);
      throw error;
    }
  }
};

// Initialize data function - use this to populate initial data
export const initializeFirebaseData = async (mockData) => {
  try {
    // Check if data already exists
    const inventorySnapshot = await getDocs(collection(db, COLLECTIONS.INVENTORY));
    
    if (inventorySnapshot.empty) {
      console.log('Initializing Firebase with mock data...');
      
      // Add mock inventory
      if (mockData.inventory) {
        for (const item of mockData.inventory) {
          await inventoryService.addInventoryItem(item);
        }
      }

      // Add mock projects
      if (mockData.projects) {
        for (const project of mockData.projects) {
          await projectsService.addProject(project);
        }
      }

      // Add mock workers
      if (mockData.workers) {
        for (const worker of mockData.workers) {
          await workersService.addWorker(worker);
        }
      }

      // Add mock plans
      if (mockData.plans) {
        for (const plan of mockData.plans) {
          await plansService.addPlan(plan);
        }
      }

      console.log('Firebase initialization completed!');
    }
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
};