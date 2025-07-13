// databaseService.js - خدمة قاعدة البيانات مع دعم الانتقال التدريجي
import { getDatabaseConfig, testConnection } from '../supabase/config';
import { inventoryService as supabaseInventoryService } from './supabaseService';
import { inventoryService as firebaseInventoryService } from './firebaseService';

// تحديد قاعدة البيانات المستخدمة
const getActiveDatabase = () => {
  const config = getDatabaseConfig();
  
  if (config.useSupabase && config.isConfigured) {
    return 'supabase';
  } else if (config.useFirebase) {
    return 'firebase';
  } else {
    console.warn('⚠️ No database configured, falling back to Firebase');
    return 'firebase';
  }
};

// خدمة المخزون الموحدة
export const inventoryService = {
  // الاشتراك في تحديثات المخزون
  subscribeToInventory: (callback, errorCallback) => {
    const db = getActiveDatabase();
    console.log(`📡 Using ${db} for inventory subscription`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.subscribeToInventory(callback, errorCallback);
    } else {
      return firebaseInventoryService.subscribeToInventory(callback, errorCallback);
    }
  },

  // إضافة عنصر مخزون
  addInventoryItem: async (item) => {
    const db = getActiveDatabase();
    console.log(`➕ Using ${db} to add inventory item`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.addInventoryItem(item);
    } else {
      return firebaseInventoryService.addInventoryItem(item);
    }
  },

  // تحديث عنصر مخزون
  updateInventoryItem: async (itemId, updates) => {
    const db = getActiveDatabase();
    console.log(`✏️ Using ${db} to update inventory item`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.updateInventoryItem(itemId, updates);
    } else {
      return firebaseInventoryService.updateInventoryItem(itemId, updates);
    }
  },

  // حذف عنصر مخزون
  deleteInventoryItem: async (itemId) => {
    const db = getActiveDatabase();
    console.log(`🗑️ Using ${db} to delete inventory item`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.deleteInventoryItem(itemId);
    } else {
      return firebaseInventoryService.deleteInventoryItem(itemId);
    }
  },

  // الحصول على العناصر منخفضة المخزون
  getLowStockItems: async () => {
    const db = getActiveDatabase();
    console.log(`📊 Using ${db} to get low stock items`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.getLowStockItems();
    } else {
      return firebaseInventoryService.getLowStockItems();
    }
  }
};

// خدمة سجل المخزون الموحدة
export const inventoryLogService = {
  // الاشتراك في تحديثات سجل المخزون
  subscribeToInventoryLog: (callback, errorCallback) => {
    const db = getActiveDatabase();
    console.log(`📡 Using ${db} for inventory log subscription`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.subscribeToInventoryLog(callback, errorCallback);
    } else {
      return firebaseInventoryService.subscribeToInventoryLog(callback, errorCallback);
    }
  },

  // إضافة سجل مخزون
  addInventoryLog: async (logEntry) => {
    const db = getActiveDatabase();
    console.log(`📝 Using ${db} to add inventory log`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.addInventoryLog(logEntry);
    } else {
      return firebaseInventoryService.addInventoryLog(logEntry);
    }
  }
};

// خدمة المهام الأسبوعية الموحدة
export const weeklyTasksService = {
  // الاشتراك في تحديثات المهام الأسبوعية
  subscribeToWeeklyTasks: (callback, errorCallback) => {
    const db = getActiveDatabase();
    console.log(`📡 Using ${db} for weekly tasks subscription`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.subscribeToWeeklyTasks(callback, errorCallback);
    } else {
      return firebaseInventoryService.subscribeToWeeklyTasks(callback, errorCallback);
    }
  },

  // إضافة مهمة أسبوعية
  addWeeklyTask: async (task) => {
    const db = getActiveDatabase();
    console.log(`➕ Using ${db} to add weekly task`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.addWeeklyTask(task);
    } else {
      return firebaseInventoryService.addWeeklyTask(task);
    }
  },

  // تحديث مهمة أسبوعية
  updateWeeklyTask: async (taskId, updates) => {
    const db = getActiveDatabase();
    console.log(`✏️ Using ${db} to update weekly task`);
    
    if (db === 'supabase') {
      return supabaseInventoryService.updateWeeklyTask(taskId, updates);
    } else {
      return firebaseInventoryService.updateWeeklyTask(taskId, updates);
    }
  }
};

// دالة اختبار الاتصال
export const testDatabaseConnection = async () => {
  const db = getActiveDatabase();
  console.log(`🔍 Testing ${db} connection...`);
  
  if (db === 'supabase') {
    return await testConnection();
  } else {
    // اختبار Firebase connection
    try {
      const { db } = await import('../firebase/config');
      if (db) {
        console.log('✅ Firebase connection successful');
        return true;
      } else {
        console.error('❌ Firebase connection failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Firebase connection error:', error);
      return false;
    }
  }
};

// دالة الحصول على معلومات قاعدة البيانات
export const getDatabaseInfo = () => {
  const db = getActiveDatabase();
  const config = getDatabaseConfig();
  
  return {
    activeDatabase: db,
    configuration: config,
    timestamp: new Date().toISOString()
  };
};

// دالة تبديل قاعدة البيانات
export const switchDatabase = (database) => {
  if (database === 'supabase') {
    process.env.REACT_APP_USE_SUPABASE = 'true';
    process.env.REACT_APP_USE_FIREBASE = 'false';
    console.log('🔄 Switched to Supabase');
  } else if (database === 'firebase') {
    process.env.REACT_APP_USE_SUPABASE = 'false';
    process.env.REACT_APP_USE_FIREBASE = 'true';
    console.log('🔄 Switched to Firebase');
  }
};

export default {
  inventoryService,
  inventoryLogService,
  weeklyTasksService,
  testDatabaseConnection,
  getDatabaseInfo,
  switchDatabase
};