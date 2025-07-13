-- supabase-schema.sql - مخطط قاعدة البيانات مع أمان عالي
-- قم بتنفيذ هذا الملف في Supabase SQL Editor

-- ===== إنشاء الجداول =====

-- جدول المخزون
CREATE TABLE IF NOT EXISTS inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- جدول سجل المخزون
CREATE TABLE IF NOT EXISTS inventory_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'add', 'remove', 'update', 'adjust'
    quantity_change INTEGER DEFAULT 0,
    previous_quantity INTEGER DEFAULT 0,
    new_quantity INTEGER DEFAULT 0,
    notes TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المهام الأسبوعية
CREATE TABLE IF NOT EXISTS weekly_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=الأحد, 6=السبت
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_completed BOOLEAN DEFAULT FALSE,
    assigned_to VARCHAR(100),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول طلبات الدعم
CREATE TABLE IF NOT EXISTS support_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100),
    assigned_to VARCHAR(100),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== إنشاء الفهارس =====

-- فهارس للمخزون
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity);
CREATE INDEX IF NOT EXISTS idx_inventory_created_at ON inventory(created_at);

-- فهارس لسجل المخزون
CREATE INDEX IF NOT EXISTS idx_inventory_log_item_id ON inventory_log(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_log_action ON inventory_log(action);
CREATE INDEX IF NOT EXISTS idx_inventory_log_created_at ON inventory_log(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_log_user_id ON inventory_log(user_id);

-- فهارس للمهام الأسبوعية
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_day ON weekly_tasks(day_of_week);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_priority ON weekly_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_completed ON weekly_tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_user_id ON weekly_tasks(user_id);

-- فهارس لطلبات الدعم
CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_priority ON support_requests(priority);
CREATE INDEX IF NOT EXISTS idx_support_requests_user_id ON support_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at ON support_requests(created_at);

-- فهارس للإشعارات
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ===== تفعيل Row Level Security (RLS) =====

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===== سياسات الأمان للمخزون =====

-- سياسة القراءة: المستخدمون يمكنهم قراءة جميع عناصر المخزون
CREATE POLICY "Users can view all inventory items" ON inventory
    FOR SELECT USING (true);

-- سياسة الإضافة: المستخدمون المصادق عليهم يمكنهم إضافة عناصر مخزون
CREATE POLICY "Authenticated users can add inventory items" ON inventory
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- سياسة التحديث: المستخدمون المصادق عليهم يمكنهم تحديث عناصر المخزون
CREATE POLICY "Authenticated users can update inventory items" ON inventory
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- سياسة الحذف: المستخدمون المصادق عليهم يمكنهم حذف عناصر المخزون
CREATE POLICY "Authenticated users can delete inventory items" ON inventory
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- ===== سياسات الأمان لسجل المخزون =====

-- سياسة القراءة: المستخدمون يمكنهم قراءة جميع سجلات المخزون
CREATE POLICY "Users can view all inventory logs" ON inventory_log
    FOR SELECT USING (true);

-- سياسة الإضافة: المستخدمون المصادق عليهم يمكنهم إضافة سجلات مخزون
CREATE POLICY "Authenticated users can add inventory logs" ON inventory_log
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ===== سياسات الأمان للمهام الأسبوعية =====

-- سياسة القراءة: المستخدمون يمكنهم قراءة جميع المهام الأسبوعية
CREATE POLICY "Users can view all weekly tasks" ON weekly_tasks
    FOR SELECT USING (true);

-- سياسة الإضافة: المستخدمون المصادق عليهم يمكنهم إضافة مهام أسبوعية
CREATE POLICY "Authenticated users can add weekly tasks" ON weekly_tasks
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- سياسة التحديث: المستخدمون المصادق عليهم يمكنهم تحديث المهام الأسبوعية
CREATE POLICY "Authenticated users can update weekly tasks" ON weekly_tasks
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- سياسة الحذف: المستخدمون المصادق عليهم يمكنهم حذف المهام الأسبوعية
CREATE POLICY "Authenticated users can delete weekly tasks" ON weekly_tasks
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- ===== سياسات الأمان لطلبات الدعم =====

-- سياسة القراءة: المستخدمون يمكنهم قراءة جميع طلبات الدعم
CREATE POLICY "Users can view all support requests" ON support_requests
    FOR SELECT USING (true);

-- سياسة الإضافة: المستخدمون المصادق عليهم يمكنهم إضافة طلبات دعم
CREATE POLICY "Authenticated users can add support requests" ON support_requests
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- سياسة التحديث: المستخدمون المصادق عليهم يمكنهم تحديث طلبات الدعم
CREATE POLICY "Authenticated users can update support requests" ON support_requests
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ===== سياسات الأمان للإشعارات =====

-- سياسة القراءة: المستخدمون يمكنهم قراءة إشعاراتهم فقط
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- سياسة الإضافة: النظام يمكنه إضافة إشعارات للمستخدمين
CREATE POLICY "System can add notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- سياسة التحديث: المستخدمون يمكنهم تحديث إشعاراتهم فقط
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- ===== دوال مساعدة =====

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء triggers لتحديث updated_at
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_tasks_updated_at BEFORE UPDATE ON weekly_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_requests_updated_at BEFORE UPDATE ON support_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- دالة للحصول على العناصر منخفضة المخزون
CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    category VARCHAR(100),
    quantity INTEGER,
    min_quantity INTEGER,
    price DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT i.id, i.name, i.category, i.quantity, i.min_quantity, i.price
    FROM inventory i
    WHERE i.quantity <= i.min_quantity;
END;
$$ LANGUAGE plpgsql;

-- دالة لإضافة سجل مخزون تلقائياً عند تحديث الكمية
CREATE OR REPLACE FUNCTION log_inventory_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF OLD.quantity != NEW.quantity THEN
            INSERT INTO inventory_log (
                item_id,
                action,
                quantity_change,
                previous_quantity,
                new_quantity,
                notes,
                user_id
            ) VALUES (
                NEW.id,
                'update',
                NEW.quantity - OLD.quantity,
                OLD.quantity,
                NEW.quantity,
                'Quantity updated',
                auth.uid()
            );
        END IF;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO inventory_log (
            item_id,
            action,
            quantity_change,
            previous_quantity,
            new_quantity,
            notes,
            user_id
        ) VALUES (
            NEW.id,
            'add',
            NEW.quantity,
            0,
            NEW.quantity,
            'Item added to inventory',
            auth.uid()
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO inventory_log (
            item_id,
            action,
            quantity_change,
            previous_quantity,
            new_quantity,
            notes,
            user_id
        ) VALUES (
            OLD.id,
            'delete',
            -OLD.quantity,
            OLD.quantity,
            0,
            'Item removed from inventory',
            auth.uid()
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- إنشاء trigger لتسجيل تغييرات المخزون
CREATE TRIGGER inventory_change_logger
    AFTER INSERT OR UPDATE OR DELETE ON inventory
    FOR EACH ROW EXECUTE FUNCTION log_inventory_change();

-- ===== بيانات تجريبية =====

-- إضافة بيانات تجريبية للمخزون
INSERT INTO inventory (name, category, quantity, min_quantity, price, description) VALUES
('لابتوب HP', 'إلكترونيات', 5, 2, 2500.00, 'لابتوب HP للعمل'),
('طابعة كانون', 'إلكترونيات', 3, 1, 800.00, 'طابعة كانون ملونة'),
('ورق A4', 'مستلزمات مكتبية', 50, 10, 25.00, 'ورق A4 أبيض'),
('قلم جاف', 'مستلزمات مكتبية', 100, 20, 2.50, 'قلم جاف أزرق'),
('طاولة مكتب', 'أثاث', 8, 3, 500.00, 'طاولة مكتب خشبية');

-- إضافة مهام أسبوعية تجريبية
INSERT INTO weekly_tasks (title, description, day_of_week, priority) VALUES
('فحص المخزون', 'فحص جميع عناصر المخزون وتحديث الكميات', 0, 'high'),
('نسخ احتياطي', 'عمل نسخة احتياطية من البيانات', 2, 'medium'),
('تنظيف المكتب', 'تنظيف المكتب وترتيب الأثاث', 4, 'low'),
('مراجعة التقارير', 'مراجعة تقارير الأسبوع', 6, 'high');

-- إضافة طلبات دعم تجريبية
INSERT INTO support_requests (title, description, status, priority, category) VALUES
('مشكلة في الطابعة', 'الطابعة لا تعمل بشكل صحيح', 'pending', 'medium', 'تقنية'),
('طلب أثاث جديد', 'نحتاج طاولات إضافية للمكتب', 'in_progress', 'low', 'إدارية');

COMMENT ON TABLE inventory IS 'جدول المخزون الرئيسي';
COMMENT ON TABLE inventory_log IS 'سجل جميع عمليات المخزون';
COMMENT ON TABLE weekly_tasks IS 'المهام الأسبوعية المطلوبة';
COMMENT ON TABLE support_requests IS 'طلبات الدعم والمساعدة';
COMMENT ON TABLE notifications IS 'إشعارات المستخدمين';