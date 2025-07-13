// supabase/config.js - إعداد Supabase محسن مع متغيرات البيئة
import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase من متغيرات البيئة
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// التحقق من وجود الإعدادات
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env file');
  console.error('Get these values from your Supabase project settings');
}

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
      'X-Client-Info': 'farkad-scheduler-v2'
    }
  }
});

// Helper function للتحقق من حالة الاتصال
export const checkSupabaseConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase configuration missing');
      return false;
    }

    const { data, error } = await supabase
      .from('inventory')
      .select('count')
      .limit(1);

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
      console.warn('⚠️ No authenticated user found');
      return false;
    }

    // التحقق من الصلاحيات
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
    isConfigured: !!(supabaseUrl && supabaseAnonKey),
    isConnected: false, // سيتم تحديثه عند الاتصال
    timestamp: new Date().toISOString()
  };
};

// Helper function لتبديل بين Firebase و Supabase
export const getDatabaseConfig = () => {
  const useSupabase = process.env.REACT_APP_USE_SUPABASE === 'true';
  const useFirebase = process.env.REACT_APP_USE_FIREBASE === 'true';
  
  return {
    useSupabase,
    useFirebase,
    isConfigured: useSupabase ? !!(supabaseUrl && supabaseAnonKey) : true
  };
};

// Helper function لاختبار الاتصال
export const testConnection = async () => {
  console.log('🔄 Testing Supabase connection...');
  
  const config = getDatabaseConfig();
  console.log('📋 Database configuration:', config);
  
  if (!config.useSupabase) {
    console.log('ℹ️ Supabase is disabled, using Firebase');
    return false;
  }
  
  if (!config.isConfigured) {
    console.error('❌ Supabase not configured properly');
    return false;
  }
  
  const isConnected = await checkSupabaseConnection();
  
  if (isConnected) {
    console.log('✅ Supabase connection test successful');
  } else {
    console.error('❌ Supabase connection test failed');
  }
  
  return isConnected;
};

export default supabase;