-- supabase-schema-extended.sql - مخطط قاعدة البيانات الموسع مع جميع الجداول
-- قم بتنفيذ هذا الملف في Supabase SQL Editor

-- ===== الجداول الموجودة (تم إنشاؤها مسبقاً) =====
-- inventory, inventory_log, weekly_tasks, support_requests, notifications

-- ===== الجداول المفقودة =====

-- جدول المشاريع
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2) DEFAULT 0.00,
    client_name VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- جدول العمال
CREATE TABLE IF NOT EXISTS workers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    position VARCHAR(100),
    salary DECIMAL(10,2) DEFAULT 0.00,
    hire_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    project_id UUID REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المخططات
CREATE TABLE IF NOT EXISTS plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id UUID REFERENCES projects(id),
    plan_type VARCHAR(50) DEFAULT 'weekly' CHECK (plan_type IN ('daily', 'weekly', 'monthly')),
    week_number INTEGER,
    year INTEGER,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- جدول المخططات الأسبوعية
CREATE TABLE IF NOT EXISTS weekly_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
    plan_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    UNIQUE(project_id, week_number, year)
);

-- جدول المهام
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id UUID REFERENCES projects(id),
    worker_id UUID REFERENCES workers(id),
    plan_id UUID REFERENCES plans(id),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    estimated_hours INTEGER DEFAULT 0,
    actual_hours INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- جدول السجلات اليومية
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    worker_id UUID REFERENCES workers(id),
    task_id UUID REFERENCES tasks(id),
    log_date DATE NOT NULL,
    hours_worked DECIMAL(4,2) DEFAULT 0.00,
    work_description TEXT,
    materials_used TEXT,
    issues_encountered TEXT,
    weather_conditions VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- جدول الحضور
CREATE TABLE IF NOT EXISTS attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id UUID REFERENCES workers(id),
    project_id UUID REFERENCES projects(id),
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    total_hours DECIMAL(4,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    UNIQUE(worker_id, attendance_date)
);

-- جدول محفظة العملاء
CREATE TABLE IF NOT EXISTS client_portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    total_projects INTEGER DEFAULT 0,
    total_value DECIMAL(12,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- جدول المعالم
CREATE TABLE IF NOT EXISTS milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completion_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
    percentage_complete INTEGER DEFAULT 0 CHECK (percentage_complete >= 0 AND percentage_complete <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- جدول الإحصائيات
CREATE TABLE IF NOT EXISTS statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stat_type VARCHAR(100) NOT NULL,
    stat_value JSONB,
    stat_date DATE,
    project_id UUID REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== إنشاء الفهارس =====

-- فهارس المشاريع
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- فهارس العمال
CREATE INDEX IF NOT EXISTS idx_workers_project_id ON workers(project_id);
CREATE INDEX IF NOT EXISTS idx_workers_status ON workers(status);
CREATE INDEX IF NOT EXISTS idx_workers_position ON workers(position);

-- فهارس المخططات
CREATE INDEX IF NOT EXISTS idx_plans_project_id ON plans(project_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_week_year ON plans(week_number, year);

-- فهارس المخططات الأسبوعية
CREATE INDEX IF NOT EXISTS idx_weekly_plans_project_id ON weekly_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_week_year ON weekly_plans(week_number, year);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_status ON weekly_plans(status);

-- فهارس المهام
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_worker_id ON tasks(worker_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- فهارس السجلات اليومية
CREATE INDEX IF NOT EXISTS idx_daily_logs_project_id ON daily_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_worker_id ON daily_logs(worker_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(log_date);

-- فهارس الحضور
CREATE INDEX IF NOT EXISTS idx_attendance_worker_id ON attendance(worker_id);
CREATE INDEX IF NOT EXISTS idx_attendance_project_id ON attendance(project_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);

-- فهارس محفظة العملاء
CREATE INDEX IF NOT EXISTS idx_client_portfolio_status ON client_portfolio(status);
CREATE INDEX IF NOT EXISTS idx_client_portfolio_created_at ON client_portfolio(created_at);

-- فهارس المعالم
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_due_date ON milestones(due_date);

-- فهارس الإحصائيات
CREATE INDEX IF NOT EXISTS idx_statistics_type ON statistics(stat_type);
CREATE INDEX IF NOT EXISTS idx_statistics_date ON statistics(stat_date);
CREATE INDEX IF NOT EXISTS idx_statistics_project_id ON statistics(project_id);

-- ===== تفعيل Row Level Security (RLS) =====

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- ===== سياسات الأمان =====

-- سياسات المشاريع
CREATE POLICY "Users can view all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات العمال
CREATE POLICY "Users can view all workers" ON workers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage workers" ON workers FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات المخططات
CREATE POLICY "Users can view all plans" ON plans FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage plans" ON plans FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات المخططات الأسبوعية
CREATE POLICY "Users can view all weekly plans" ON weekly_plans FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage weekly plans" ON weekly_plans FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات المهام
CREATE POLICY "Users can view all tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage tasks" ON tasks FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات السجلات اليومية
CREATE POLICY "Users can view all daily logs" ON daily_logs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage daily logs" ON daily_logs FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات الحضور
CREATE POLICY "Users can view all attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage attendance" ON attendance FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات محفظة العملاء
CREATE POLICY "Users can view all client portfolio" ON client_portfolio FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage client portfolio" ON client_portfolio FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات المعالم
CREATE POLICY "Users can view all milestones" ON milestones FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage milestones" ON milestones FOR ALL USING (auth.uid() IS NOT NULL);

-- سياسات الإحصائيات
CREATE POLICY "Users can view all statistics" ON statistics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage statistics" ON statistics FOR ALL USING (auth.uid() IS NOT NULL);

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
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_plans_updated_at BEFORE UPDATE ON weekly_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_portfolio_updated_at BEFORE UPDATE ON client_portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== بيانات تجريبية =====

-- إضافة مشاريع تجريبية
INSERT INTO projects (name, description, status, start_date, end_date, budget, client_name, location) VALUES
('بناء فيلا سكنية', 'بناء فيلا فاخرة في الرياض', 'active', '2024-01-01', '2024-12-31', 500000.00, 'أحمد محمد', 'الرياض'),
('تطوير مركز تجاري', 'تطوير مركز تجاري في جدة', 'active', '2024-02-01', '2024-11-30', 800000.00, 'شركة التجارة المتحدة', 'جدة'),
('صيانة مدرسة', 'صيانة شاملة لمدرسة ابتدائية', 'completed', '2024-01-15', '2024-06-15', 150000.00, 'وزارة التعليم', 'الدمام');

-- إضافة عمال تجريبيين
INSERT INTO workers (name, phone, email, position, salary, hire_date, status, project_id) VALUES
('محمد علي', '+966501234567', 'mohamed@example.com', 'مهندس مدني', 8000.00, '2024-01-01', 'active', (SELECT id FROM projects LIMIT 1)),
('أحمد حسن', '+966502345678', 'ahmed@example.com', 'عامل بناء', 4000.00, '2024-01-15', 'active', (SELECT id FROM projects LIMIT 1)),
('علي محمد', '+966503456789', 'ali@example.com', 'كهربائي', 6000.00, '2024-02-01', 'active', (SELECT id FROM projects LIMIT 1 OFFSET 1));

-- إضافة مخططات تجريبية
INSERT INTO plans (title, description, project_id, plan_type, week_number, year, status) VALUES
('مخطط الأسبوع الأول', 'مخطط العمل للأسبوع الأول من المشروع', (SELECT id FROM projects LIMIT 1), 'weekly', 1, 2024, 'approved'),
('مخطط الأسبوع الثاني', 'مخطط العمل للأسبوع الثاني من المشروع', (SELECT id FROM projects LIMIT 1), 'weekly', 2, 2024, 'draft');

-- إضافة مهام تجريبية
INSERT INTO tasks (title, description, project_id, worker_id, priority, status, start_date, end_date, estimated_hours) VALUES
('حفر الأساسات', 'حفر الأساسات للمبنى الرئيسي', (SELECT id FROM projects LIMIT 1), (SELECT id FROM workers LIMIT 1), 'high', 'in_progress', '2024-01-01', '2024-01-07', 40),
('صب الخرسانة', 'صب الخرسانة للأساسات', (SELECT id FROM projects LIMIT 1), (SELECT id FROM workers LIMIT 1), 'high', 'pending', '2024-01-08', '2024-01-14', 35);

-- إضافة سجلات يومية تجريبية
INSERT INTO daily_logs (project_id, worker_id, task_id, log_date, hours_worked, work_description, weather_conditions) VALUES
((SELECT id FROM projects LIMIT 1), (SELECT id FROM workers LIMIT 1), (SELECT id FROM tasks LIMIT 1), '2024-01-01', 8.0, 'بدء حفر الأساسات', 'مشمس'),
((SELECT id FROM projects LIMIT 1), (SELECT id FROM workers LIMIT 1), (SELECT id FROM tasks LIMIT 1), '2024-01-02', 7.5, 'استكمال حفر الأساسات', 'غائم');

-- إضافة سجلات حضور تجريبية
INSERT INTO attendance (worker_id, project_id, attendance_date, check_in_time, check_out_time, total_hours, status) VALUES
((SELECT id FROM workers LIMIT 1), (SELECT id FROM projects LIMIT 1), '2024-01-01', '08:00:00', '17:00:00', 8.0, 'present'),
((SELECT id FROM workers LIMIT 1), (SELECT id FROM projects LIMIT 1), '2024-01-02', '08:00:00', '16:30:00', 7.5, 'present');

-- إضافة محفظة عملاء تجريبية
INSERT INTO client_portfolio (client_name, contact_person, phone, email, address, total_projects, total_value, status) VALUES
('شركة البناء المتحدة', 'أحمد محمد', '+966501234567', 'ahmed@company.com', 'الرياض، المملكة العربية السعودية', 5, 2500000.00, 'active'),
('مؤسسة التطوير العقاري', 'محمد علي', '+966502345678', 'mohamed@realestate.com', 'جدة، المملكة العربية السعودية', 3, 1800000.00, 'active');

-- إضافة معالم تجريبية
INSERT INTO milestones (project_id, title, description, due_date, status, percentage_complete) VALUES
((SELECT id FROM projects LIMIT 1), 'إنجاز الأساسات', 'إكمال جميع أعمال الأساسات', '2024-01-31', 'in_progress', 60),
((SELECT id FROM projects LIMIT 1), 'إنجاز الهيكل الخرساني', 'إكمال الهيكل الخرساني للمبنى', '2024-03-31', 'pending', 0);

COMMENT ON TABLE projects IS 'جدول المشاريع';
COMMENT ON TABLE workers IS 'جدول العمال';
COMMENT ON TABLE plans IS 'جدول المخططات';
COMMENT ON TABLE weekly_plans IS 'جدول المخططات الأسبوعية';
COMMENT ON TABLE tasks IS 'جدول المهام';
COMMENT ON TABLE daily_logs IS 'جدول السجلات اليومية';
COMMENT ON TABLE attendance IS 'جدول الحضور';
COMMENT ON TABLE client_portfolio IS 'جدول محفظة العملاء';
COMMENT ON TABLE milestones IS 'جدول المعالم';
COMMENT ON TABLE statistics IS 'جدول الإحصائيات';