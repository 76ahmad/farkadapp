// firebaseService.js - Enhanced Firebase Service with complete integration
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  getDoc,
  getDocs,
  writeBatch,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000
};

// Utility function for retrying operations
const retryOperation = async (operation, retries = RETRY_CONFIG.maxRetries) => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error.code !== 'permission-denied') {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * (RETRY_CONFIG.maxRetries - retries + 1),
        RETRY_CONFIG.maxDelay
      );
      
      console.log(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
};

// ===== INVENTORY SERVICE =====
export const inventoryService = {
  subscribeToInventory: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'inventory'), orderBy('name', 'asc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const inventory = [];
          snapshot.forEach((doc) => {
            inventory.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Inventory loaded: ${inventory.length} items`);
          callback(inventory);
        } catch (error) {
          console.error('Error processing inventory snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Inventory subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up inventory subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {}; // Return empty unsubscribe function
    }
  },

  addInventoryItem: async (item) => {
    return retryOperation(async () => {
      if (!item.name || !item.category) {
        throw new Error('اسم العنصر والفئة مطلوبان');
      }

      const docRef = await addDoc(collection(db, 'inventory'), {
        ...item,
        quantity: parseInt(item.quantity) || 0,
        minQuantity: parseInt(item.minQuantity) || 0,
        price: parseFloat(item.price) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Inventory item added successfully:', docRef.id);
      return docRef.id;
    });
  },

  updateInventoryItem: async (itemId, updates) => {
    return retryOperation(async () => {
      if (!itemId) {
        throw new Error('معرف العنصر مطلوب للتحديث');
      }

      const itemRef = doc(db, 'inventory', itemId);
      
      // Check if item exists
      const itemDoc = await getDoc(itemRef);
      if (!itemDoc.exists()) {
        throw new Error(`عنصر المخزون بالمعرف ${itemId} غير موجود`);
      }

      const updateData = { ...updates };
      if (updateData.quantity !== undefined) {
        updateData.quantity = parseInt(updateData.quantity) || 0;
      }
      if (updateData.minQuantity !== undefined) {
        updateData.minQuantity = parseInt(updateData.minQuantity) || 0;
      }
      if (updateData.price !== undefined) {
        updateData.price = parseFloat(updateData.price) || 0;
      }

      await updateDoc(itemRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      console.log('Inventory item updated successfully:', itemId);
    });
  },

  deleteInventoryItem: async (itemId) => {
    return retryOperation(async () => {
      if (!itemId) {
        throw new Error('معرف العنصر مطلوب للحذف');
      }

      const itemRef = doc(db, 'inventory', itemId);
      
      // Check if item exists
      const itemDoc = await getDoc(itemRef);
      if (!itemDoc.exists()) {
        throw new Error(`عنصر المخزون بالمعرف ${itemId} غير موجود`);
      }

      await deleteDoc(itemRef);
      console.log('Inventory item deleted successfully:', itemId);
    });
  },

  getLowStockItems: async () => {
    return retryOperation(async () => {
      const q = query(collection(db, 'inventory'));
      const snapshot = await getDocs(q);
      
      const lowStockItems = [];
      snapshot.forEach((doc) => {
        const item = { id: doc.id, ...doc.data() };
        if (item.quantity <= item.minQuantity) {
          lowStockItems.push(item);
        }
      });
      
      return lowStockItems;
    });
  }
};

// ===== INVENTORY LOG SERVICE =====
export const inventoryLogService = {
  subscribeToInventoryLog: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'inventoryLog'), orderBy('timestamp', 'desc'), limit(100));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const logs = [];
          snapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Inventory log loaded: ${logs.length} entries`);
          callback(logs);
        } catch (error) {
          console.error('Error processing inventory log snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Inventory log subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up inventory log subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  addInventoryLog: async (logEntry) => {
    return retryOperation(async () => {
      if (!logEntry.itemId || !logEntry.action) {
        throw new Error('معرف العنصر ونوع العملية مطلوبان');
      }

      const docRef = await addDoc(collection(db, 'inventoryLog'), {
        ...logEntry,
        quantity: parseInt(logEntry.quantity) || 0,
        timestamp: serverTimestamp()
      });

      console.log('Inventory log entry added successfully:', docRef.id);
      return docRef.id;
    });
  }
};

// ===== PROJECTS SERVICE =====
export const projectsService = {
  subscribeToProjects: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const projects = [];
          snapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Projects loaded: ${projects.length} projects`);
          callback(projects);
        } catch (error) {
          console.error('Error processing projects snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Projects subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up projects subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  addProject: async (project) => {
    return retryOperation(async () => {
      if (!project.name || !project.location) {
        throw new Error('اسم المشروع والموقع مطلوبان');
      }

      const docRef = await addDoc(collection(db, 'projects'), {
        ...project,
        budget: parseFloat(project.budget) || 0,
        spent: parseFloat(project.spent) || 0,
        progress: parseInt(project.progress) || 0,
        status: project.status || 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Project added successfully:', docRef.id);
      return docRef.id;
    });
  },

  updateProject: async (projectId, updates) => {
    return retryOperation(async () => {
      if (!projectId) {
        throw new Error('معرف المشروع مطلوب للتحديث');
      }

      const projectRef = doc(db, 'projects', projectId);
      
      const projectDoc = await getDoc(projectRef);
      if (!projectDoc.exists()) {
        throw new Error(`المشروع بالمعرف ${projectId} غير موجود`);
      }

      const updateData = { ...updates };
      if (updateData.budget !== undefined) {
        updateData.budget = parseFloat(updateData.budget) || 0;
      }
      if (updateData.spent !== undefined) {
        updateData.spent = parseFloat(updateData.spent) || 0;
      }
      if (updateData.progress !== undefined) {
        updateData.progress = parseInt(updateData.progress) || 0;
      }

      await updateDoc(projectRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      console.log('Project updated successfully:', projectId);
    });
  },

  deleteProject: async (projectId) => {
    return retryOperation(async () => {
      if (!projectId) {
        throw new Error('معرف المشروع مطلوب للحذف');
      }

      const projectRef = doc(db, 'projects', projectId);
      
      const projectDoc = await getDoc(projectRef);
      if (!projectDoc.exists()) {
        throw new Error(`المشروع بالمعرف ${projectId} غير موجود`);
      }

      await deleteDoc(projectRef);
      console.log('Project deleted successfully:', projectId);
    });
  }
};

// ===== WORKERS SERVICE =====
export const workersService = {
  subscribeToWorkers: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'workers'), orderBy('name', 'asc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const workers = [];
          snapshot.forEach((doc) => {
            workers.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Workers loaded: ${workers.length} workers`);
          callback(workers);
        } catch (error) {
          console.error('Error processing workers snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Workers subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up workers subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  addWorker: async (worker) => {
    return retryOperation(async () => {
      if (!worker.name || !worker.specialization) {
        throw new Error('اسم العامل والتخصص مطلوبان');
      }

      const docRef = await addDoc(collection(db, 'workers'), {
        ...worker,
        salary: parseFloat(worker.salary) || 0,
        status: worker.status || 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Worker added successfully:', docRef.id);
      return docRef.id;
    });
  },

  updateWorker: async (workerId, updates) => {
    return retryOperation(async () => {
      if (!workerId) {
        throw new Error('معرف العامل مطلوب للتحديث');
      }

      const workerRef = doc(db, 'workers', workerId);
      
      const workerDoc = await getDoc(workerRef);
      if (!workerDoc.exists()) {
        throw new Error(`العامل بالمعرف ${workerId} غير موجود`);
      }

      const updateData = { ...updates };
      if (updateData.salary !== undefined) {
        updateData.salary = parseFloat(updateData.salary) || 0;
      }

      await updateDoc(workerRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      console.log('Worker updated successfully:', workerId);
    });
  },

  deleteWorker: async (workerId) => {
    return retryOperation(async () => {
      if (!workerId) {
        throw new Error('معرف العامل مطلوب للحذف');
      }

      const workerRef = doc(db, 'workers', workerId);
      
      const workerDoc = await getDoc(workerRef);
      if (!workerDoc.exists()) {
        throw new Error(`العامل بالمعرف ${workerId} غير موجود`);
      }

      await deleteDoc(workerRef);
      console.log('Worker deleted successfully:', workerId);
    });
  }
};

// ===== TASKS SERVICE =====
export const tasksService = {
  subscribeToTasks: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const tasks = [];
          snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Tasks loaded: ${tasks.length} tasks`);
          callback(tasks);
        } catch (error) {
          console.error('Error processing tasks snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Tasks subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up tasks subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  addTask: async (task) => {
    return retryOperation(async () => {
      if (!task.title || !task.projectId) {
        throw new Error('عنوان المهمة ومعرف المشروع مطلوبان');
      }

      const docRef = await addDoc(collection(db, 'tasks'), {
        ...task,
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        progress: parseInt(task.progress) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Task added successfully:', docRef.id);
      return docRef.id;
    });
  },

  updateTask: async (taskId, updates) => {
    return retryOperation(async () => {
      if (!taskId) {
        throw new Error('معرف المهمة مطلوب للتحديث');
      }

      const taskRef = doc(db, 'tasks', taskId);
      
      const taskDoc = await getDoc(taskRef);
      if (!taskDoc.exists()) {
        throw new Error(`المهمة بالمعرف ${taskId} غير موجودة`);
      }

      const updateData = { ...updates };
      if (updateData.progress !== undefined) {
        updateData.progress = parseInt(updateData.progress) || 0;
      }

      await updateDoc(taskRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      console.log('Task updated successfully:', taskId);
    });
  },

  deleteTask: async (taskId) => {
    return retryOperation(async () => {
      if (!taskId) {
        throw new Error('معرف المهمة مطلوب للحذف');
      }

      const taskRef = doc(db, 'tasks', taskId);
      
      const taskDoc = await getDoc(taskRef);
      if (!taskDoc.exists()) {
        throw new Error(`المهمة بالمعرف ${taskId} غير موجودة`);
      }

      await deleteDoc(taskRef);
      console.log('Task deleted successfully:', taskId);
    });
  }
};

// ===== PLANS SERVICE =====
export const plansService = {
  subscribeToPlans: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'plans'), orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const plans = [];
          snapshot.forEach((doc) => {
            plans.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Plans loaded: ${plans.length} plans`);
          callback(plans);
        } catch (error) {
          console.error('Error processing plans snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Plans subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up plans subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  }
};

// ===== DAILY LOGS SERVICE =====
export const dailyLogsService = {
  subscribeToDailyLogs: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'dailyLogs'), orderBy('date', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const logs = [];
          snapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Daily logs loaded: ${logs.length} logs`);
          callback(logs);
        } catch (error) {
          console.error('Error processing daily logs snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Daily logs subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up daily logs subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  addDailyLog: async (log) => {
    return retryOperation(async () => {
      if (!log.date || !log.projectId) {
        throw new Error('التاريخ ومعرف المشروع مطلوبان');
      }

      const docRef = await addDoc(collection(db, 'dailyLogs'), {
        ...log,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Daily log added successfully:', docRef.id);
      return docRef.id;
    });
  },

  updateDailyLog: async (logId, updates) => {
    return retryOperation(async () => {
      if (!logId) {
        throw new Error('معرف السجل مطلوب للتحديث');
      }

      const logRef = doc(db, 'dailyLogs', logId);
      
      const logDoc = await getDoc(logRef);
      if (!logDoc.exists()) {
        throw new Error(`السجل اليومي بالمعرف ${logId} غير موجود`);
      }

      await updateDoc(logRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      console.log('Daily log updated successfully:', logId);
    });
  }
};

// ===== ATTENDANCE SERVICE =====
export const attendanceService = {
  subscribeToAttendance: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'attendance'), orderBy('date', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const attendance = [];
          snapshot.forEach((doc) => {
            attendance.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Attendance loaded: ${attendance.length} records`);
          callback(attendance);
        } catch (error) {
          console.error('Error processing attendance snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Attendance subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up attendance subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  recordAttendance: async (attendanceData) => {
    return retryOperation(async () => {
      if (!attendanceData.workerId || !attendanceData.date) {
        throw new Error('معرف العامل والتاريخ مطلوبان');
      }

      const docRef = await addDoc(collection(db, 'attendance'), {
        ...attendanceData,
        timestamp: serverTimestamp()
      });

      console.log('Attendance recorded successfully:', docRef.id);
      return docRef.id;
    });
  },

  getTodayAttendance: async (workerId) => {
    return retryOperation(async () => {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'attendance'),
        where('workerId', '==', workerId),
        where('date', '==', today)
      );
      
      const snapshot = await getDocs(q);
      const attendance = [];
      snapshot.forEach((doc) => {
        attendance.push({ id: doc.id, ...doc.data() });
      });
      
      return attendance;
    });
  }
};

// ===== CLIENT PORTFOLIO SERVICE =====
export const clientPortfolioService = {
  subscribeToClients: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'clients'), orderBy('name', 'asc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const clients = [];
          snapshot.forEach((doc) => {
            clients.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Clients loaded: ${clients.length} clients`);
          callback(clients);
        } catch (error) {
          console.error('Error processing clients snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Clients subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up clients subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  addOrUpdateClient: async (client) => {
    return retryOperation(async () => {
      if (!client.name) {
        throw new Error('اسم العميل مطلوب');
      }

      const docRef = await addDoc(collection(db, 'clients'), {
        ...client,
        projectValue: parseFloat(client.projectValue) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Client added successfully:', docRef.id);
      return docRef.id;
    });
  }
};

// ===== MILESTONES SERVICE =====
export const milestonesService = {
  subscribeToMilestones: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'milestones'), orderBy('dueDate', 'asc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const milestones = [];
          snapshot.forEach((doc) => {
            milestones.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Milestones loaded: ${milestones.length} milestones`);
          callback(milestones);
        } catch (error) {
          console.error('Error processing milestones snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Milestones subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up milestones subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  }
};

// ===== STATISTICS SERVICE =====
export const statisticsService = {
  subscribeToStatistics: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'statistics'), orderBy('date', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        try {
          const statistics = [];
          snapshot.forEach((doc) => {
            statistics.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Statistics loaded: ${statistics.length} records`);
          callback(statistics);
        } catch (error) {
          console.error('Error processing statistics snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Statistics subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up statistics subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  }
};

// ===== DATA INITIALIZATION =====
export const initializeFirebaseData = async (mockData) => {
  try {
    console.log('Checking if Firebase data initialization is needed...');
    
    // Check if collections are empty
    const collections = ['inventory', 'projects', 'workers', 'plans'];
    const batch = writeBatch(db);
    let needsInitialization = false;
    
    for (const collectionName of collections) {
      const q = query(collection(db, collectionName), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty && mockData[collectionName]) {
        console.log(`Initializing ${collectionName} collection...`);
        needsInitialization = true;
        
        mockData[collectionName].forEach((item) => {
          const docRef = doc(collection(db, collectionName));
          batch.set(docRef, {
            ...item,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
      }
    }
    
    if (needsInitialization) {
      await batch.commit();
      console.log('Firebase data initialization completed successfully');
      return true;
    } else {
      console.log('Firebase data already exists, skipping initialization');
      return false;
    }
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
    throw new Error(`فشل في تهيئة البيانات: ${error.message}`);
  }
};

