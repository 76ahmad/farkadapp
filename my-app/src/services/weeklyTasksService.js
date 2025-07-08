import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  orderBy, 
  serverTimestamp,
  getDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===== WEEKLY TASKS SERVICE =====
export const weeklyTasksService = {
  // الاشتراك في المهام الأسبوعية لمشروع معين
  subscribeToWeeklyTasks: (projectId, weekNumber, year, callback) => {
    const q = query(
      collection(db, 'weeklyTasks'),
      where('projectId', '==', projectId),
      where('weekNumber', '==', weekNumber),
      where('year', '==', year),
      orderBy('dayIndex', 'asc'),
      orderBy('startTime', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      callback(tasks);
    });
  },

  // الحصول على خطة الأسبوع كاملة
  getWeeklyPlan: async (projectId, weekNumber, year) => {
    try {
      // البحث عن خطة الأسبوع
      const planQuery = query(
        collection(db, 'weeklyPlans'),
        where('projectId', '==', projectId),
        where('weekNumber', '==', weekNumber),
        where('year', '==', year)
      );
      
      const planSnapshot = await getDocs(planQuery);
      let plan = null;
      
      if (!planSnapshot.empty) {
        const planDoc = planSnapshot.docs[0];
        plan = { id: planDoc.id, ...planDoc.data() };
      } else {
        // إنشاء خطة جديدة إذا لم توجد
        const newPlan = {
          projectId,
          weekNumber,
          year,
          status: 'draft',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'weeklyPlans'), newPlan);
        plan = { id: docRef.id, ...newPlan };
      }
      
      // الحصول على المهام
      const tasksQuery = query(
        collection(db, 'weeklyTasks'),
        where('projectId', '==', projectId),
        where('weekNumber', '==', weekNumber),
        where('year', '==', year),
        orderBy('dayIndex', 'asc'),
        orderBy('startTime', 'asc')
      );
      
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = [];
      tasksSnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      return { ...plan, tasks };
    } catch (error) {
      console.error('Error getting weekly plan:', error);
      throw error;
    }
  },

  // إضافة مهمة أسبوعية
  addWeeklyTask: async (taskData) => {
    try {
      const docRef = await addDoc(collection(db, 'weeklyTasks'), {
        ...taskData,
        status: taskData.status || 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // تحديث خطة الأسبوع
      await weeklyTasksService.updateWeeklyPlanStatus(
        taskData.projectId,
        taskData.weekNumber,
        taskData.year,
        'draft'
      );
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding weekly task:', error);
      throw error;
    }
  },

  // تحديث مهمة أسبوعية
  updateWeeklyTask: async (taskId, updates) => {
    try {
      const taskRef = doc(db, 'weeklyTasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating weekly task:', error);
      throw error;
    }
  },

  // حذف مهمة أسبوعية
  deleteWeeklyTask: async (taskId) => {
    try {
      await deleteDoc(doc(db, 'weeklyTasks', taskId));
    } catch (error) {
      console.error('Error deleting weekly task:', error);
      throw error;
    }
  },

  // نسخ مهام الأسبوع
  copyWeekTasks: async (projectId, fromWeek, fromYear, toWeek, toYear) => {
    try {
      // الحصول على مهام الأسبوع المصدر
      const tasksQuery = query(
        collection(db, 'weeklyTasks'),
        where('projectId', '==', projectId),
        where('weekNumber', '==', fromWeek),
        where('year', '==', fromYear)
      );
      
      const snapshot = await getDocs(tasksQuery);
      const batch = writeBatch(db);
      
      // نسخ كل مهمة
      snapshot.forEach((doc) => {
        const taskData = doc.data();
        const newTaskRef = doc(collection(db, 'weeklyTasks'));
        
        // تحديث التواريخ للأسبوع الجديد
        const weekDiff = (toWeek - fromWeek) + (toYear - fromYear) * 52;
        const newDate = new Date(taskData.date);
        newDate.setDate(newDate.getDate() + (weekDiff * 7));
        
        batch.set(newTaskRef, {
          ...taskData,
          weekNumber: toWeek,
          year: toYear,
          date: newDate.toISOString(),
          status: 'pending',
          assignedWorkers: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      
      // إنشاء خطة للأسبوع الجديد
      await weeklyTasksService.updateWeeklyPlanStatus(projectId, toWeek, toYear, 'draft');
      
    } catch (error) {
      console.error('Error copying week tasks:', error);
      throw error;
    }
  },

  // إرسال خطة الأسبوع لمدير الموقع
  sendWeeklyPlan: async (projectId, weekNumber, year) => {
    try {
      await weeklyTasksService.updateWeeklyPlanStatus(projectId, weekNumber, year, 'sent');
      
      // إنشاء إشعار لمدير الموقع
      const project = await getDoc(doc(db, 'projects', projectId));
      if (project.exists() && project.data().siteManager) {
        await addDoc(collection(db, 'notifications'), {
          type: 'weekly_tasks',
          title: 'مهام أسبوعية جديدة',
          message: `تم إرسال مهام الأسبوع ${weekNumber} لمشروع ${project.data().name}`,
          recipientId: project.data().siteManager.id,
          projectId: projectId,
          weekNumber: weekNumber,
          year: year,
          read: false,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error sending weekly plan:', error);
      throw error;
    }
  },

  // تحديث حالة خطة الأسبوع
  updateWeeklyPlanStatus: async (projectId, weekNumber, year, status) => {
    try {
      const planQuery = query(
        collection(db, 'weeklyPlans'),
        where('projectId', '==', projectId),
        where('weekNumber', '==', weekNumber),
        where('year', '==', year)
      );
      
      const snapshot = await getDocs(planQuery);
      
      if (!snapshot.empty) {
        const planDoc = snapshot.docs[0];
        await updateDoc(planDoc.ref, {
          status: status,
          updatedAt: serverTimestamp()
        });
      } else {
        // إنشاء خطة جديدة
        await addDoc(collection(db, 'weeklyPlans'), {
          projectId,
          weekNumber,
          year,
          status,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating weekly plan status:', error);
      throw error;
    }
  },

  // الحصول على المهام حسب التاريخ
  getTasksByDate: async (projectId, date) => {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const q = query(
        collection(db, 'weeklyTasks'),
        where('projectId', '==', projectId),
        where('date', '>=', startOfDay.toISOString()),
        where('date', '<=', endOfDay.toISOString()),
        orderBy('date', 'asc'),
        orderBy('startTime', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      return tasks;
    } catch (error) {
      console.error('Error getting tasks by date:', error);
      throw error;
    }
  },

  // توزيع المهام على العمال
  assignTaskToWorkers: async (taskId, workerIds) => {
    try {
      const taskRef = doc(db, 'weeklyTasks', taskId);
      await updateDoc(taskRef, {
        assignedWorkers: workerIds,
        status: 'assigned',
        assignedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // إنشاء إشعارات للعمال
      const batch = writeBatch(db);
      const task = await getDoc(taskRef);
      const taskData = task.data();
      
      workerIds.forEach(workerId => {
        const notificationRef = doc(collection(db, 'notifications'));
        batch.set(notificationRef, {
          type: 'task_assigned',
          title: 'مهمة جديدة',
          message: `تم تكليفك بمهمة: ${taskData.title}`,
          recipientId: workerId,
          taskId: taskId,
          projectId: taskData.projectId,
          read: false,
          createdAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      
    } catch (error) {
      console.error('Error assigning task to workers:', error);
      throw error;
    }
  },

  // الحصول على المهام المكلف بها العامل
  getWorkerWeeklyTasks: async (workerId, weekNumber, year) => {
    try {
      const q = query(
        collection(db, 'weeklyTasks'),
        where('assignedWorkers', 'array-contains', workerId),
        where('weekNumber', '==', weekNumber),
        where('year', '==', year),
        orderBy('date', 'asc'),
        orderBy('startTime', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      return tasks;
    } catch (error) {
      console.error('Error getting worker weekly tasks:', error);
      throw error;
    }
  },

  // إحصائيات المهام الأسبوعية
  getWeeklyTasksStats: async (projectId, weekNumber, year) => {
    try {
      const q = query(
        collection(db, 'weeklyTasks'),
        where('projectId', '==', projectId),
        where('weekNumber', '==', weekNumber),
        where('year', '==', year)
      );
      
      const snapshot = await getDocs(q);
      
      const stats = {
        total: 0,
        pending: 0,
        assigned: 0,
        inProgress: 0,
        completed: 0,
        totalWorkers: 0,
        byCategory: {},
        byPriority: {
          urgent: 0,
          high: 0,
          medium: 0,
          low: 0
        }
      };
      
      snapshot.forEach((doc) => {
        const task = doc.data();
        stats.total++;
        
        // حسب الحالة
        if (task.status === 'pending') stats.pending++;
        else if (task.status === 'assigned') stats.assigned++;
        else if (task.status === 'in-progress') stats.inProgress++;
        else if (task.status === 'completed') stats.completed++;
        
        // حسب الفئة
        if (!stats.byCategory[task.category]) {
          stats.byCategory[task.category] = 0;
        }
        stats.byCategory[task.category]++;
        
        // حسب الأولوية
        if (stats.byPriority[task.priority] !== undefined) {
          stats.byPriority[task.priority]++;
        }
        
        // عدد العمال
        stats.totalWorkers += task.workersNeeded || 0;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting weekly tasks stats:', error);
      throw error;
    }
  }
};