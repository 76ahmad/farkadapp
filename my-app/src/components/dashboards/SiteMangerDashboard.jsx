import React, { useState, useEffect } from 'react';
import { 
  HardHat, Users, Package, CheckSquare, Clock, 
  AlertTriangle, Shield, Wrench, Hammer, Truck,
  Activity, Calendar, MapPin, Phone, AlertCircle,
  UserCheck, ClipboardList, Settings, Bell, Search,
  Plus, Eye, Edit, Trash2, Coffee, Sun, Moon,
  Target, TrendingUp, Award, Zap, ThumbsUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts';

const SiteManagerDashboard = ({ currentUser, projects = [], inventory = [], workers = [], tasks = [] }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState('all');
  const [weatherData, setWeatherData] = useState({ temp: 32, condition: 'sunny', humidity: 45 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // بيانات مدير الموقع
  const sampleProjects = projects.length > 0 ? projects : [
    { id: 1, name: 'فيلا الأحمد', progress: 75, totalWorkers: 12, activeWorkers: 10, location: 'الرياض', phase: 'التشطيبات' },
    { id: 2, name: 'مجمع الوادي', progress: 45, totalWorkers: 25, activeWorkers: 22, location: 'جدة', phase: 'الهيكل' }
  ];

  const sampleWorkers = workers.length > 0 ? workers : [
    { id: 1, name: 'أحمد محمد', role: 'عامل بناء', status: 'present', project: 'فيلا الأحمد', shift: 'صباحي', safety: 'جيد', experience: '5 سنوات' },
    { id: 2, name: 'سعد العلي', role: 'نجار', status: 'present', project: 'فيلا الأحمد', shift: 'صباحي', safety: 'ممتاز', experience: '8 سنوات' },
    { id: 3, name: 'محمد الشمري', role: 'كهربائي', status: 'absent', project: 'مجمع الوادي', shift: 'مسائي', safety: 'جيد', experience: '3 سنوات' },
    { id: 4, name: 'عبدالله القحطاني', role: 'سباك', status: 'present', project: 'مجمع الوادي', shift: 'صباحي', safety: 'ممتاز', experience: '6 سنوات' },
    { id: 5, name: 'فهد الدوسري', role: 'عامل بناء', status: 'late', project: 'فيلا الأحمد', shift: 'صباحي', safety: 'متوسط', experience: '2 سنة' }
  ];

  const sampleInventory = inventory.length > 0 ? inventory : [
    { id: 1, name: 'حديد تسليح', currentStock: 15, minStock: 20, unit: 'طن', status: 'low', location: 'مخزن أ' },
    { id: 2, name: 'أسمنت', currentStock: 120, minStock: 50, unit: 'كيس', status: 'good', location: 'مخزن ب' },
    { id: 3, name: 'بلاط سيراميك', currentStock: 5, minStock: 30, unit: 'متر²', status: 'critical', location: 'مخزن ج' },
    { id: 4, name: 'كابلات كهربائية', currentStock: 45, minStock: 25, unit: 'متر', status: 'good', location: 'مخزن د' },
    { id: 5, name: 'أنابيب PVC', currentStock: 8, minStock: 15, unit: 'قطعة', status: 'low', location: 'مخزن هـ' }
  ];

  const todayTasks = [
    { id: 1, title: 'فحص أعمال الصب', priority: 'high', assignedTo: 'أحمد محمد', status: 'pending', time: '08:00' },
    { id: 2, title: 'تركيب التمديدات الكهربائية', priority: 'medium', assignedTo: 'محمد الشمري', status: 'in-progress', time: '10:00' },
    { id: 3, title: 'فحص السلامة', priority: 'high', assignedTo: 'مشرف السلامة', status: 'completed', time: '07:00' },
    { id: 4, title: 'استلام مواد البناء', priority: 'medium', assignedTo: 'عبدالله القحطاني', status: 'pending', time: '14:00' }
  ];

  // إحصائيات الحضور الأسبوعية
  const weeklyAttendance = [
    { day: 'الجمعة', present: 22, absent: 3, late: 1 },
    { day: 'الخميس', present: 24, absent: 1, late: 1 },
    { day: 'الاربعاء', present: 23, absent: 2, late: 1 },
    { day: 'الثلاثاء', present: 25, absent: 1, late: 0 },
    { day: 'الاثنين', present: 24, absent: 1, late: 1 },
    { day: 'الأحد', present: 23, absent: 2, late: 1 }
    
  ];

  // حساب الإحصائيات
  const stats = {
    totalWorkers: sampleWorkers.length,
    presentWorkers: sampleWorkers.filter(w => w.status === 'present').length,
    absentWorkers: sampleWorkers.filter(w => w.status === 'absent').length,
    lateWorkers: sampleWorkers.filter(w => w.status === 'late').length,
    criticalStock: sampleInventory.filter(i => i.status === 'critical').length,
    lowStock: sampleInventory.filter(i => i.status === 'low').length,
    pendingTasks: todayTasks.filter(t => t.status === 'pending').length,
    completedTasks: todayTasks.filter(t => t.status === 'completed').length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockStatusColor = (status) => {
    switch(status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header مدير الموقع */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-10 blur-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <HardHat className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    مرحباً {currentUser?.displayName || 'مدير الموقع'}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <HardHat className="h-4 w-4" />
                    مشرف العمليات والسلامة
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    {currentTime.toLocaleDateString('ar-EG')} - {currentTime.toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* حالة الطقس */}
                <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    <div className="text-right">
                      <div className="text-sm opacity-90">الطقس اليوم</div>
                      <div className="font-bold">{weatherData.temp}°م - مشمس</div>
                    </div>
                  </div>
                </div>
                
                <button className="bg-white/80 backdrop-blur-lg border border-white/20 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</div>
                </button>
                
                <button className="bg-white/80 backdrop-blur-lg border border-white/20 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Settings className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* بطاقات الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* العمال الحاضرين */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3 shadow-lg">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">العمال الحاضرين</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stats.presentWorkers}
                  </p>
                  <p className="text-xs text-gray-500">من أصل {stats.totalWorkers}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {Math.round((stats.presentWorkers / stats.totalWorkers) * 100)}% نسبة الحضور
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* المهام المعلقة */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-3 shadow-lg">
                  <ClipboardList className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">المهام المعلقة</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {stats.pendingTasks}
                  </p>
                  <p className="text-xs text-gray-500">مهمة اليوم</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{stats.completedTasks} مكتملة</span>
                </div>
              </div>
            </div>
          </div>

          {/* المخزون المنخفض */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-3 shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">تنبيهات المخزون</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {stats.criticalStock + stats.lowStock}
                  </p>
                  <p className="text-xs text-gray-500">صنف يحتاج تجديد</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{stats.criticalStock} حرج</span>
                </div>
              </div>
            </div>
          </div>

          {/* معدل السلامة */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-3 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">معدل السلامة</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    98%
                  </p>
                  <p className="text-xs text-gray-500">هذا الشهر</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full w-[98%] transition-all duration-1000" />
                </div>
                <Award className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* قسم إدارة العمال والحضور */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* حضور العمال اليومي */}
          <div className="xl:col-span-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl p-2">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">حضور العمال - اليوم</h3>
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-white/50 border border-gray-200 rounded-xl px-3 py-2 text-sm">
                    <option>جميع المشاريع</option>
                    <option>فيلا الأحمد</option>
                    <option>مجمع الوادي</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-2 font-semibold text-gray-700">العامل</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">التخصص</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">المشروع</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">الوردية</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">الحالة</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">السلامة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleWorkers.map((worker) => (
                      <tr key={worker.id} className="hover:bg-blue-50/50 transition-all duration-300 border-b border-gray-100">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {worker.name.split(' ')[0][0]}{worker.name.split(' ')[1][0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{worker.name}</div>
                              <div className="text-xs text-gray-500">{worker.experience}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-sm font-medium">
                            {worker.role}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center text-sm font-medium text-gray-700">
                          {worker.project}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm font-medium">
                            {worker.shift}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(worker.status)}`}>
                            {worker.status === 'present' ? '🟢 حاضر' : 
                             worker.status === 'absent' ? '🔴 غائب' : '🟡 متأخر'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              worker.safety === 'ممتاز' ? 'bg-green-500' :
                              worker.safety === 'جيد' ? 'bg-yellow-500' : 'bg-orange-500'
                            }`} />
                            <span className="text-sm font-medium text-gray-700">{worker.safety}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* إحصائيات الحضور الأسبوعية */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-2">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">الحضور الأسبوعي</h3>
              </div>
              
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyAttendance} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '11px', fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '11px', fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="present" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="حاضر" />
                  <Bar dataKey="late" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="متأخر" />
                  <Bar dataKey="absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="غائب" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="text-lg font-bold text-green-700">92%</div>
                  <div className="text-xs text-green-600">معدل الحضور</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="text-lg font-bold text-yellow-700">5%</div>
                  <div className="text-xs text-yellow-600">التأخير</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="text-lg font-bold text-red-700">3%</div>
                  <div className="text-xs text-red-600">الغياب</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* قسم إدارة المخزون والمهام */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* حالة المخزون */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-2">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">حالة المخزون</h3>
              </div>
              
              <div className="space-y-3">
                {sampleInventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{item.currentStock}</span>
                        <span className="text-sm text-gray-500">{item.unit}</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStockStatusColor(item.status)}`}>
                          {item.status === 'critical' ? 'حرج' :
                           item.status === 'low' ? 'منخفض' : 'جيد'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">الحد الأدنى: {item.minStock}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">تنبيهات المخزون</span>
                </div>
                <div className="text-sm text-orange-700">
                  {stats.criticalStock} صنف في حالة حرجة، {stats.lowStock} صنف منخفض
                </div>
              </div>
            </div>
          </div>

          {/* مهام اليوم */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-2">
                    <CheckSquare className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">مهام اليوم</h3>
                </div>
                <button className="bg-purple-100 hover:bg-purple-200 text-purple-600 p-2 rounded-lg transition-all duration-300">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      task.status === 'completed' ? 'bg-green-500 border-green-500' :
                      task.status === 'in-progress' ? 'bg-blue-500 border-blue-500' :
                      'border-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className={`font-semibold ${
                        task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{task.assignedTo}</span>
                        <span>•</span>
                        <span>{task.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority === 'high' ? 'عالية' :
                         task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <div className="text-lg font-bold text-blue-700">{stats.pendingTasks}</div>
                  <div className="text-xs text-blue-600">معلقة</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                  <div className="text-lg font-bold text-yellow-700">2</div>
                  <div className="text-xs text-yellow-600">قيد التنفيذ</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                  <div className="text-lg font-bold text-green-700">{stats.completedTasks}</div>
                  <div className="text-xs text-green-600">مكتملة</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الإجراءات السريعة */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">الإجراءات السريعة</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-2xl border border-blue-200 transition-all duration-300 hover:scale-105">
                <div className="bg-blue-500 group-hover:bg-blue-600 rounded-xl p-3 transition-all duration-300">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-800">تسجيل حضور</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 rounded-2xl border border-green-200 transition-all duration-300 hover:scale-105">
                <div className="bg-green-500 group-hover:bg-green-600 rounded-xl p-3 transition-all duration-300">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-800">مهمة جديدة</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200 rounded-2xl border border-orange-200 transition-all duration-300 hover:scale-105">
                <div className="bg-orange-500 group-hover:bg-orange-600 rounded-xl p-3 transition-all duration-300">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-orange-800">طلب مواد</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200 rounded-2xl border border-purple-200 transition-all duration-300 hover:scale-105">
                <div className="bg-purple-500 group-hover:bg-purple-600 rounded-xl p-3 transition-all duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-purple-800">تقرير سلامة</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-amber-100 hover:from-yellow-100 hover:to-amber-200 rounded-2xl border border-yellow-200 transition-all duration-300 hover:scale-105">
                <div className="bg-yellow-500 group-hover:bg-yellow-600 rounded-xl p-3 transition-all duration-300">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-yellow-800">تقرير يومي</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200 rounded-2xl border border-gray-200 transition-all duration-300 hover:scale-105">
                <div className="bg-gray-500 group-hover:bg-gray-600 rounded-xl p-3 transition-all duration-300">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">الإعدادات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
            <HardHat className="h-5 w-5 text-indigo-500" />
            <span className="text-gray-600">لوحة تحكم مدير الموقع - منصة البناء الذكي</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteManagerDashboard;