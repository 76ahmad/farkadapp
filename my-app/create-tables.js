// create-tables.js - سكريبت لإنشاء الجداول
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjiqhvajamdqeoxtwzje.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqaXFodmFqYW1kcWVveHR3emplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDM0OTIsImV4cCI6MjA2ODAxOTQ5Mn0.4tTh6sQcuymM_nQ4QCnBMWBlnvUCWNjyAFr4E5lCoh4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL لإنشاء الجداول
const createTablesSQL = `
-- إنشاء جدول المخزون
CREATE TABLE IF NOT EXISTS inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول سجل المخزون
CREATE TABLE IF NOT EXISTS inventory_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    quantity_change INTEGER DEFAULT 0,
    previous_quantity INTEGER DEFAULT 0,
    new_quantity INTEGER DEFAULT 0,
    notes TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول المهام الأسبوعية
CREATE TABLE IF NOT EXISTS weekly_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_completed BOOLEAN DEFAULT FALSE,
    assigned_to VARCHAR(100),
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_day ON weekly_tasks(day_of_week);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_priority ON weekly_tasks(priority);

-- إضافة بيانات تجريبية
INSERT INTO inventory (name, category, quantity, min_quantity, price, description) VALUES
('لابتوب HP', 'إلكترونيات', 5, 2, 2500.00, 'لابتوب HP للعمل'),
('طابعة كانون', 'إلكترونيات', 3, 1, 800.00, 'طابعة كانون ملونة'),
('ورق A4', 'مستلزمات مكتبية', 50, 10, 25.00, 'ورق A4 أبيض'),
('قلم جاف', 'مستلزمات مكتبية', 100, 20, 2.50, 'قلم جاف أزرق'),
('طاولة مكتب', 'أثاث', 8, 3, 500.00, 'طاولة مكتب خشبية');

INSERT INTO weekly_tasks (title, description, day_of_week, priority) VALUES
('فحص المخزون', 'فحص جميع عناصر المخزون وتحديث الكميات', 0, 'high'),
('نسخ احتياطي', 'عمل نسخة احتياطية من البيانات', 2, 'medium'),
('تنظيف المكتب', 'تنظيف المكتب وترتيب الأثاث', 4, 'low'),
('مراجعة التقارير', 'مراجعة تقارير الأسبوع', 6, 'high');
`;

async function createTables() {
  console.log('🔄 جاري إنشاء الجداول...');
  
  try {
    // تنفيذ SQL لإنشاء الجداول
    const { error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (error) {
      console.log('❌ خطأ في إنشاء الجداول:', error.message);
      console.log('💡 استخدم Supabase Dashboard > SQL Editor بدلاً من ذلك');
      return false;
    }
    
    console.log('✅ تم إنشاء الجداول بنجاح!');
    return true;
    
  } catch (error) {
    console.log('❌ خطأ في إنشاء الجداول:', error.message);
    console.log('💡 استخدم Supabase Dashboard > SQL Editor بدلاً من ذلك');
    return false;
  }
}

// اختبار الجداول بعد إنشائها
async function testTables() {
  console.log('🔄 اختبار الجداول...');
  
  try {
    // اختبار جدول المخزون
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('*')
      .limit(5);
    
    if (inventoryError) {
      console.log('❌ خطأ في جدول المخزون:', inventoryError.message);
      return false;
    }
    
    console.log('✅ جدول المخزون يعمل بشكل صحيح');
    console.log('📊 عدد العناصر:', inventory.length);
    
    // اختبار جدول المهام الأسبوعية
    const { data: tasks, error: tasksError } = await supabase
      .from('weekly_tasks')
      .select('*')
      .limit(5);
    
    if (tasksError) {
      console.log('❌ خطأ في جدول المهام الأسبوعية:', tasksError.message);
      return false;
    }
    
    console.log('✅ جدول المهام الأسبوعية يعمل بشكل صحيح');
    console.log('📊 عدد المهام:', tasks.length);
    
    return true;
    
  } catch (error) {
    console.log('❌ خطأ في اختبار الجداول:', error.message);
    return false;
  }
}

// تشغيل العملية
async function runSetup() {
  console.log('🚀 بدء إعداد قاعدة البيانات...\n');
  
  const tablesCreated = await createTables();
  
  if (tablesCreated) {
    console.log('\n🔄 اختبار الجداول...');
    const tablesTested = await testTables();
    
    if (tablesTested) {
      console.log('\n🎉 تم إعداد قاعدة البيانات بنجاح!');
      console.log('✅ يمكنك الآن استخدام التطبيق مع Supabase');
    } else {
      console.log('\n❌ فشل في اختبار الجداول');
    }
  } else {
    console.log('\n❌ فشل في إنشاء الجداول');
    console.log('💡 استخدم Supabase Dashboard > SQL Editor');
  }
}

// تشغيل الإعداد إذا تم تشغيل الملف مباشرة
if (typeof window === 'undefined') {
  runSetup();
}

export { createTables, testTables };