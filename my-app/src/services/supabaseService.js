// supabaseService.js - خدمة Supabase محسنة مع أمان عالي
import supabase, { getCurrentUser, checkUserPermissions } from '../supabase/config';

// إعدادات Retry
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000
};

// دالة مساعدة لإعادة المحاولة
const retryOperation = async (operation, retries = RETRY_CONFIG.maxRetries) => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error.code !== '42501') {
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

// ===== خدمة المخزون =====
export const inventoryService = {
  // الاشتراك في تحديثات المخزون
  subscribeToInventory: (callback, errorCallback) => {
    try {
      const subscription = supabase
        .channel('inventory_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'inventory' 
          }, 
          (payload) => {
            console.log('Inventory change detected:', payload);
            callback(payload);
          }
        )
        .subscribe((status) => {
          console.log('Inventory subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Inventory subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Inventory subscription error');
            if (errorCallback) errorCallback(new Error('Subscription failed'));
          }
        });

      return () => {
        supabase.removeChannel(subscription);
      };
    } catch (error) {
      console.error('Error setting up inventory subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  // إضافة عنصر مخزون جديد
  addInventoryItem: async (item) => {
    return retryOperation(async () => {
      // التحقق من الصلاحيات
      const hasPermission = await checkUserPermissions('inventory', 'INSERT');
      if (!hasPermission) {
        throw new Error('ليس لديك صلاحية لإضافة عناصر المخزون');
      }

      if (!item.name || !item.category) {
        throw new Error('اسم العنصر والفئة مطلوبان');
      }

      const { data, error } = await supabase
        .from('inventory')
        .insert({
          name: item.name,
          category: item.category,
          quantity: parseInt(item.quantity) || 0,
          min_quantity: parseInt(item.minQuantity) || 0,
          price: parseFloat(item.price) || 0,
          description: item.description || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding inventory item:', error);
        throw new Error(`فشل في إضافة عنصر المخزون: ${error.message}`);
      }

      console.log('Inventory item added successfully:', data.id);
      return data.id;
    });
  },

  // تحديث عنصر مخزون
  updateInventoryItem: async (itemId, updates) => {
    return retryOperation(async () => {
      // التحقق من الصلاحيات
      const hasPermission = await checkUserPermissions('inventory', 'UPDATE');
      if (!hasPermission) {
        throw new Error('ليس لديك صلاحية لتحديث عناصر المخزون');
      }

      if (!itemId) {
        throw new Error('معرف العنصر مطلوب للتحديث');
      }

      // التحقق من وجود العنصر
      const { data: existingItem, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', itemId)
        .single();

      if (fetchError || !existingItem) {
        throw new Error(`عنصر المخزون بالمعرف ${itemId} غير موجود`);
      }

      const updateData = { ...updates };
      if (updateData.quantity !== undefined) {
        updateData.quantity = parseInt(updateData.quantity) || 0;
      }
      if (updateData.minQuantity !== undefined) {
        updateData.min_quantity = parseInt(updateData.minQuantity) || 0;
      }
      if (updateData.price !== undefined) {
        updateData.price = parseFloat(updateData.price) || 0;
      }

      const { error } = await supabase
        .from('inventory')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating inventory item:', error);
        throw new Error(`فشل في تحديث عنصر المخزون: ${error.message}`);
      }

      console.log('Inventory item updated successfully:', itemId);
    });
  },

  // حذف عنصر مخزون
  deleteInventoryItem: async (itemId) => {
    return retryOperation(async () => {
      // التحقق من الصلاحيات
      const hasPermission = await checkUserPermissions('inventory', 'DELETE');
      if (!hasPermission) {
        throw new Error('ليس لديك صلاحية لحذف عناصر المخزون');
      }

      if (!itemId) {
        throw new Error('معرف العنصر مطلوب للحذف');
      }

      // التحقق من وجود العنصر
      const { data: existingItem, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', itemId)
        .single();

      if (fetchError || !existingItem) {
        throw new Error(`عنصر المخزون بالمعرف ${itemId} غير موجود`);
      }

      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting inventory item:', error);
        throw new Error(`فشل في حذف عنصر المخزون: ${error.message}`);
      }

      console.log('Inventory item deleted successfully:', itemId);
    });
  },

  // الحصول على جميع عناصر المخزون
  getAllInventoryItems: async () => {
    return retryOperation(async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching inventory items:', error);
        throw new Error(`فشل في جلب عناصر المخزون: ${error.message}`);
      }

      return data || [];
    });
  },

  // الحصول على العناصر منخفضة المخزون
  getLowStockItems: async () => {
    return retryOperation(async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .lte('quantity', supabase.raw('min_quantity'));

      if (error) {
        console.error('Error fetching low stock items:', error);
        throw new Error(`فشل في جلب العناصر منخفضة المخزون: ${error.message}`);
      }

      return data || [];
    });
  }
};

// ===== خدمة سجل المخزون =====
export const inventoryLogService = {
  // الاشتراك في تحديثات سجل المخزون
  subscribeToInventoryLog: (callback, errorCallback) => {
    try {
      const subscription = supabase
        .channel('inventory_log_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'inventory_log' 
          }, 
          (payload) => {
            console.log('Inventory log change detected:', payload);
            callback(payload);
          }
        )
        .subscribe((status) => {
          console.log('Inventory log subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Inventory log subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Inventory log subscription error');
            if (errorCallback) errorCallback(new Error('Subscription failed'));
          }
        });

      return () => {
        supabase.removeChannel(subscription);
      };
    } catch (error) {
      console.error('Error setting up inventory log subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  // إضافة سجل مخزون جديد
  addInventoryLog: async (logEntry) => {
    return retryOperation(async () => {
      // التحقق من الصلاحيات
      const hasPermission = await checkUserPermissions('inventory_log', 'INSERT');
      if (!hasPermission) {
        throw new Error('ليس لديك صلاحية لإضافة سجلات المخزون');
      }

      if (!logEntry.item_id || !logEntry.action) {
        throw new Error('معرف العنصر ونوع العملية مطلوبان');
      }

      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from('inventory_log')
        .insert({
          item_id: logEntry.item_id,
          action: logEntry.action,
          quantity_change: logEntry.quantity_change || 0,
          previous_quantity: logEntry.previous_quantity || 0,
          new_quantity: logEntry.new_quantity || 0,
          notes: logEntry.notes || '',
          user_id: user?.id || null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding inventory log:', error);
        throw new Error(`فشل في إضافة سجل المخزون: ${error.message}`);
      }

      console.log('Inventory log added successfully:', data.id);
      return data.id;
    });
  },

  // الحصول على سجلات المخزون
  getInventoryLogs: async (limit = 100) => {
    return retryOperation(async () => {
      const { data, error } = await supabase
        .from('inventory_log')
        .select(`
          *,
          inventory:item_id (
            id,
            name,
            category
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching inventory logs:', error);
        throw new Error(`فشل في جلب سجلات المخزون: ${error.message}`);
      }

      return data || [];
    });
  }
};

// ===== خدمة المهام الأسبوعية =====
export const weeklyTasksService = {
  // الاشتراك في تحديثات المهام الأسبوعية
  subscribeToWeeklyTasks: (callback, errorCallback) => {
    try {
      const subscription = supabase
        .channel('weekly_tasks_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'weekly_tasks' 
          }, 
          (payload) => {
            console.log('Weekly tasks change detected:', payload);
            callback(payload);
          }
        )
        .subscribe((status) => {
          console.log('Weekly tasks subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Weekly tasks subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Weekly tasks subscription error');
            if (errorCallback) errorCallback(new Error('Subscription failed'));
          }
        });

      return () => {
        supabase.removeChannel(subscription);
      };
    } catch (error) {
      console.error('Error setting up weekly tasks subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  // إضافة مهمة أسبوعية جديدة
  addWeeklyTask: async (task) => {
    return retryOperation(async () => {
      // التحقق من الصلاحيات
      const hasPermission = await checkUserPermissions('weekly_tasks', 'INSERT');
      if (!hasPermission) {
        throw new Error('ليس لديك صلاحية لإضافة المهام الأسبوعية');
      }

      if (!task.title || !task.day_of_week) {
        throw new Error('عنوان المهمة ويوم الأسبوع مطلوبان');
      }

      const user = await getCurrentUser();

      const { data, error } = await supabase
        .from('weekly_tasks')
        .insert({
          title: task.title,
          description: task.description || '',
          day_of_week: task.day_of_week,
          priority: task.priority || 'medium',
          is_completed: false,
          assigned_to: task.assigned_to || null,
          user_id: user?.id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding weekly task:', error);
        throw new Error(`فشل في إضافة المهمة الأسبوعية: ${error.message}`);
      }

      console.log('Weekly task added successfully:', data.id);
      return data.id;
    });
  },

  // تحديث مهمة أسبوعية
  updateWeeklyTask: async (taskId, updates) => {
    return retryOperation(async () => {
      // التحقق من الصلاحيات
      const hasPermission = await checkUserPermissions('weekly_tasks', 'UPDATE');
      if (!hasPermission) {
        throw new Error('ليس لديك صلاحية لتحديث المهام الأسبوعية');
      }

      if (!taskId) {
        throw new Error('معرف المهمة مطلوب للتحديث');
      }

      const { error } = await supabase
        .from('weekly_tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating weekly task:', error);
        throw new Error(`فشل في تحديث المهمة الأسبوعية: ${error.message}`);
      }

      console.log('Weekly task updated successfully:', taskId);
    });
  },

  // الحصول على المهام الأسبوعية
  getWeeklyTasks: async () => {
    return retryOperation(async () => {
      const { data, error } = await supabase
        .from('weekly_tasks')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching weekly tasks:', error);
        throw new Error(`فشل في جلب المهام الأسبوعية: ${error.message}`);
      }

      return data || [];
    });
  }
};

// ===== دالة تهيئة البيانات =====
export const initializeSupabaseData = async () => {
  try {
    console.log('🔄 Initializing Supabase data...');
    
    // التحقق من الاتصال
    const isConnected = await supabase.from('inventory').select('count').limit(1);
    if (isConnected.error) {
      console.warn('⚠️ Supabase connection check failed:', isConnected.error.message);
      return false;
    }

    console.log('✅ Supabase data initialization completed');
    return true;
  } catch (error) {
    console.error('❌ Supabase data initialization failed:', error);
    return false;
  }
};

export default {
  inventoryService,
  inventoryLogService,
  weeklyTasksService,
  initializeSupabaseData
};