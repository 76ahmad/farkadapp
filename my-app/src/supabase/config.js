// supabase/config.js - إعداد Supabase مع أمان عالي
import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase - استبدل هذه القيم بإعداداتك الحقيقية
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// إنشاء عميل Supabase مع إعدادات أمان متقدمة
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'farkad-scheduler'
    }
  }
});

// Helper function للتحقق من حالة الاتصال
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    if (error) {
      console.warn('⚠️ Supabase connection check failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
};

// Helper function للحصول على معلومات المستخدم الحالي
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.warn('⚠️ Error getting current user:', error.message);
      return null;
    }
    return user;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
};

// Helper function للتحقق من الصلاحيات
export const checkUserPermissions = async (table, action) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    // يمكنك إضافة منطق إضافي للتحقق من الصلاحيات هنا
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .limit(1);

    if (error && error.code === '42501') {
      console.warn(`⚠️ User doesn't have ${action} permission on ${table}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error checking permissions:', error);
    return false;
  }
};

// Helper function للحصول على معلومات المشروع
export const getProjectInfo = () => {
  return {
    projectUrl: supabaseUrl,
    isConnected: false, // سيتم تحديثه عند الاتصال
    timestamp: new Date().toISOString()
  };
};

export default supabase;