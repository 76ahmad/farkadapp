import React from 'react';
import { Package, DollarSign, ClipboardList, AlertCircle } from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const StatisticsView = ({ inventory = [], tasks = [] }) => {
  // ألوان للرسوم البيانية
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  // بيانات حالة المخزون
  const stockData = [
    { name: 'مخزون طبيعي', value: 10, color: '#10B981' },
    { name: 'مخزون منخفض', value: 3, color: '#F59E0B' },
    { name: 'نفد المخزون', value: 2, color: '#EF4444' }
  ];

  // بيانات أداء المهام الأسبوعي
  const weeklyTasksData = [
    { day: 'السبت', completed: 5, pending: 3 },
    { day: 'الأحد', completed: 3, pending: 4 },
    { day: 'الإثنين', completed: 7, pending: 2 },
    { day: 'الثلاثاء', completed: 4, pending: 5 },
    { day: 'الأربعاء', completed: 6, pending: 3 },
    { day: 'الخميس', completed: 8, pending: 1 },
    { day: 'الجمعة', completed: 2, pending: 2 }
  ];

  // بيانات الأداء المالي
  const financialData = [
    { month: 'يناير', revenue: 45000, expenses: 35000 },
    { month: 'فبراير', revenue: 52000, expenses: 38000 },
    { month: 'مارس', revenue: 48000, expenses: 42000 },
    { month: 'أبريل', revenue: 61000, expenses: 45000 },
    { month: 'مايو', revenue: 58000, expenses: 41000 },
    { month: 'يونيو', revenue: 65000, expenses: 48000 }
  ];

  // بيانات أكثر المواد استخداماً
  const topMaterials = [
    { name: 'حديد تسليح', usage: 85 },
    { name: 'إسمنت', usage: 72 },
    { name: 'رمل', usage: 65 },
    { name: 'بلاط', usage: 58 },
    { name: 'طلاء', usage: 45 }
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold">لوحة الإحصائيات</h2>

      {/* الإحصائيات العامة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">إجمالي المواد</p>
              <p className="text-3xl font-bold">15</p>
              <p className="text-xs mt-1 opacity-75">في المخزون</p>
            </div>
            <Package className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">قيمة المخزون</p>
              <p className="text-2xl font-bold">75,000</p>
              <p className="text-xs mt-1 opacity-75">دينار أردني</p>
            </div>
            <DollarSign className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">مهام قيد التنفيذ</p>
              <p className="text-3xl font-bold">8</p>
              <p className="text-xs mt-1">من 12 مهمة</p>
            </div>
            <ClipboardList className="h-12 w-12 opacity-90" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">تنبيهات</p>
              <p className="text-3xl font-bold">3</p>
              <p className="text-xs mt-1 opacity-75">تحتاج انتباه</p>
            </div>
            <AlertCircle className="h-12 w-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* الصف الأول من الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* حالة المخزون */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">حالة المخزون</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-around">
            {stockData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-sm">{item.name}</span>
                </div>
                <p className="font-bold text-lg mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* أداء المهام الأسبوعي */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">أداء المهام الأسبوعي</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTasksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" name="مكتملة" fill="#10B981" />
              <Bar dataKey="pending" name="قيد التنفيذ" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* الصف الثاني من الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الأداء المالي */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">الأداء المالي الشهري</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} د.أ`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="الإيرادات" 
                stroke="#10B981" 
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                name="المصروفات" 
                stroke="#EF4444" 
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* أكثر المواد استخداماً */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">أكثر المواد استخداماً</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topMaterials} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="usage" fill="#3B82F6">
                {topMaterials.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${220 - index * 15}, 70%, 50%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ملخص الأداء */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <p className="text-sm text-blue-600">معدل إنجاز المهام</p>
          <p className="text-2xl font-bold text-blue-800">67%</p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-600">كفاءة المخزون</p>
          <p className="text-2xl font-bold text-green-800">85%</p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">استخدام الميزانية</p>
          <p className="text-2xl font-bold text-yellow-800">72%</p>
          <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '72%' }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <p className="text-sm text-purple-600">رضا العملاء</p>
          <p className="text-2xl font-bold text-purple-800">92%</p>
          <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;