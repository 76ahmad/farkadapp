// test-connection.js - سكريبت لاختبار الاتصال بـ Supabase
import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase
const supabaseUrl = 'https://zjiqhvajamdqeoxtwzje.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqaXFodmFqYW1kcWVveHR3emplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDM0OTIsImV4cCI6MjA2ODAxOTQ5Mn0.4tTh6sQcuymM_nQ4QCnBMWBlnvUCWNjyAFr4E5lCoh4';

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// دالة اختبار الاتصال
async function testConnection() {
  console.log('🔄 جاري اختبار الاتصال بـ Supabase...');
  
  try {
    // اختبار الاتصال الأساسي
    const { data, error } = await supabase
      .from('inventory')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ خطأ في الاتصال:', error.message);
      
      // إذا كان الخطأ بسبب عدم وجود الجدول، فهذا يعني أن الاتصال ناجح
      if (error.code === 'PGRST116') {
        console.log('✅ الاتصال ناجح! الجداول لم يتم إنشاؤها بعد.');
        console.log('📋 الخطوة التالية: تنفيذ مخطط قاعدة البيانات');
        return true;
      }
      
      return false;
    }
    
    console.log('✅ الاتصال ناجح! البيانات متاحة.');
    console.log('📊 عدد العناصر في المخزون:', data);
    return true;
    
  } catch (error) {
    console.log('❌ خطأ في الاتصال:', error.message);
    return false;
  }
}

// دالة اختبار إنشاء جدول تجريبي
async function testTableCreation() {
  console.log('🔄 جاري اختبار إنشاء جدول تجريبي...');
  
  try {
    // محاولة إنشاء جدول تجريبي
    const { error } = await supabase
      .rpc('test_connection_function');
    
    if (error) {
      console.log('❌ لا يمكن إنشاء دالة تجريبية:', error.message);
      return false;
    }
    
    console.log('✅ يمكن إنشاء الدوال والجداول!');
    return true;
    
  } catch (error) {
    console.log('❌ خطأ في اختبار إنشاء الجداول:', error.message);
    return false;
  }
}

// تشغيل الاختبارات
async function runTests() {
  console.log('🚀 بدء اختبارات Supabase...\n');
  
  const connectionTest = await testConnection();
  
  if (connectionTest) {
    console.log('\n✅ اختبار الاتصال ناجح!');
    console.log('📋 يمكنك الآن تنفيذ مخطط قاعدة البيانات');
  } else {
    console.log('\n❌ اختبار الاتصال فشل');
    console.log('🔧 تحقق من إعدادات Supabase');
  }
  
  console.log('\n📊 ملخص الاختبار:');
  console.log('- الاتصال:', connectionTest ? '✅ ناجح' : '❌ فشل');
  console.log('- URL:', supabaseUrl);
  console.log('- Key:', supabaseAnonKey.substring(0, 20) + '...');
}

// تشغيل الاختبارات إذا تم تشغيل الملف مباشرة
if (typeof window === 'undefined') {
  runTests();
}

export { testConnection, testTableCreation };