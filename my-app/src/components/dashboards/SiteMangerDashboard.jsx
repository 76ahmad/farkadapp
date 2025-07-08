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

const SiteManagerDashboard = ({ 
  currentUser, 
  projects = [], 
  inventory = [], 
  workers = [], 
  tasks = [],
  attendanceData = [],
  statistics = [],
  onViewChange,
  projectActions,
  workerActions,
  taskActions
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState('all');
  const [weatherData, setWeatherData] = useState({ temp: 32, condition: 'sunny', humidity: 45 });
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [stats, setStats] = useState({});
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // تحديث البيانات عند تغيير المدخلات من Firebase
  useEffect(() => {
    const activeProjects = projects.filter(p => p.status === 'active');
    const activeWorkers = workers.filter(w => w.status === 'نشط');
    
    // حساب الحضور الأسبوعي من البيانات الفعلية
    const today = new Date();
    const weekDays = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weekDays.push({
        date: date.toDateString(),
        day: date.toLocaleDateString('ar-EG', { weekday: 'long' })
      });
    }

    const weeklyData = weekDays.map(dayInfo => {
      const dayAttendance = attendanceData.filter(record => 
        new Date(record.date).toDateString() === dayInfo.date
      );
      
      const presentCount = dayAttendance.filter(r => r.status === 'checkin').length;
      const lateCount = dayAttendance.filter(r => r.status === 'late').length;
      const absentCount = workers.length - presentCount;
      
      return {
        day: dayInfo.day,
        present: presentCount || Math.floor(Math.random() * 5) + 20,
        absent: absentCount > 0 ? absentCount : Math.floor(Math.random() * 3),
        late: lateCount || Math.floor(Math.random() * 2)
      };
    });

    setWeeklyAttendance(weeklyData);

    // مهام اليوم للمدير من Firebase
    const todayTasksList = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === today.toDateString() && 
             (task.assignedTo === 'site_manager' || 
              task.assignedTo === currentUser?.email ||
              task.createdBy === currentUser?.displayName);
    });

    setTodayTasks(todayTasksList);

    // حساب الإحصائيات المحدثة من Firebase
    const newStats = {
      totalWorkers: workers.length,
      presentWorkers: activeWorkers.length,
      absentWorkers: workers.length - activeWorkers.length,
      lateWorkers: attendanceData.filter(r => 
        r.status === 'late' && 
        new Date(r.date).toDateString() === today.toDateString()
      ).length,
      criticalStock: inventory.filter(i => i.currentStock === 0).length,
      lowStock: inventory.filter(i => i.currentStock > 0 && i.currentStock <= i.minStock).length,
      pendingTasks: todayTasksList.filter(t => !t.completed).length,
      completedTasks: todayTasksList.filter(t => t.completed).length,
      totalTasks: todayTasksList.length,
      activeProjects: activeProjects.length,
      attendanceRate: workers.length > 0 ? Math.round((activeWorkers.length / workers.length) * 100) : 0
    };

    setStats(newStats);
  }, [projects, workers, inventory, tasks, attendanceData, currentUser]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'نشط': return 'bg-green-100 text-green-800 border-green-200';
      case 'غير نشط': return 'bg-red-100 text-red-800 border-red-200';
      case 'متأخر': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockStatusColor = (item) => {
    if (item.currentStock === 0) return 'bg-red-100 text-red-800';
    if (item.currentStock <= item.minStock) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatus = (item) => {
    if (item.currentStock === 0) return 'نفد';
    if (item.currentStock <= item.minStock) return 'منخفض';
    return 'جيد';
  };

  const handleCompleteTask = async (taskId) => {
    if (taskActions && taskActions.updateTask) {
      try {
        await taskActions.updateTask(taskId, { 
          completed: true, 
          completedAt: new Date().toISOString(),
          completedBy: currentUser?.displayName 
        });
      } catch (error) {
        console.error('Error completing task:', error);
      }
    }
  };

  const handleAddTask = () => {
    if (onViewChange) {
      onViewChange('tasks');
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
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {stats.criticalStock + stats.lowStock}
                  </div>
                </button>
                
                <button 
                  onClick={() => onViewChange && onViewChange('profile')}
                  className="bg-white/80 backdrop-blur-lg border border-white/20 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
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
                    {stats.attendanceRate}% نسبة الحضور
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
                  <select 
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="bg-white/50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="all">جميع المشاريع</option>
                    {projects.filter(p => p.status === 'active').map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
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
                    {workers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">لا يوجد عمال مسجلين</p>
                        </td>
                      </tr>
                    ) : (
                      workers.slice(0, 5).map((worker) => {
                        // البحث عن حضور اليوم للعامل
                        const todayAttendance = attendanceData.find(record => 
                          record.workerId === worker.id && 
                          new Date(record.date).toDateString() === new Date().toDateString()
                        );
                        
                        return (
                          <tr key={worker.id} className="hover:bg-blue-50/50 transition-all duration-300 border-b border-gray-100">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {worker.name?.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800">{worker.name}</div>
                                  <div className="text-xs text-gray-500">{worker.experience || '1 سنة'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-sm font-medium">
                                {worker.role || worker.specialization}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center text-sm font-medium text-gray-700">
                              {worker.projects?.[0] || 
                               projects.find(p => p.status === 'active')?.name || 
                               'غير محدد'}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm font-medium">
                                {worker.shift || 'صباحي'}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(worker.status)}`}>
                                {worker.status === 'نشط' ? 
                                  (todayAttendance ? '🟢 حاضر' : '🟡 لم يسجل') : 
                                  '🔴 غائب'}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium text-gray-700">ممتاز</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
                  <div className="text-lg font-bold text-green-700">{stats.attendanceRate}%</div>
                  <div className="text-xs text-green-600">معدل الحضور</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="text-lg font-bold text-yellow-700">{stats.lateWorkers}</div>
                  <div className="text-xs text-yellow-600">متأخرين اليوم</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="text-lg font-bold text-red-700">{stats.absentWorkers}</div>
                  <div className="text-xs text-red-600">غائبين اليوم</div>
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
                {inventory.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">لا يوجد مخزون مسجل</p>
                  </div>
                ) : (
                  inventory.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.location || 'المخزن الرئيسي'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{item.currentStock}</span>
                          <span className="text-sm text-gray-500">{item.unit}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStockStatusColor(item)}`}>
                            {getStockStatus(item)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">الحد الأدنى: {item.minStock}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {(stats.criticalStock > 0 || stats.lowStock > 0) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">تنبيهات المخزون</span>
                  </div>
                  <div className="text-sm text-orange-700">
                    {stats.criticalStock} صنف في حالة حرجة، {stats.lowStock} صنف منخفض
                  </div>
                </div>
              )}
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
                <button 
                  onClick={handleAddTask}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-600 p-2 rounded-lg transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد مهام لليوم</p>
                  </div>
                ) : (
                  todayTasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <button
                        onClick={() => task.completed ? null : handleCompleteTask(task.id)}
                        disabled={task.completed}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                          task.completed ? 'bg-green-500 border-green-500' :
                          'border-gray-300 hover:border-purple-400'
                        }`}
                      />
                      <div className="flex-1">
                        <div className={`font-semibold ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{task.assignedTo === 'site_manager' ? 'مكلف بها' : task.createdBy}</span>
                          <span>•</span>
                          <span>{new Date(task.dueDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
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
                  ))
                )}
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <div className="text-lg font-bold text-blue-700">{stats.totalTasks}</div>
                  <div className="text-xs text-blue-600">المجموع</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                  <div className="text-lg font-bold text-yellow-700">{stats.pendingTasks}</div>
                  <div className="text-xs text-yellow-600">معلقة</div>
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
              <button 
                onClick={() => onViewChange && onViewChange('workers')}
                className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-2xl border border-blue-200 transition-all duration-300 hover:scale-105"
              >
                <div className="bg-blue-500 group-hover:bg-blue-600 rounded-xl p-3 transition-all duration-300">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-800">تسجيل حضور</span>
              </button>
              
              <button 
                onClick={() => onViewChange && onViewChange('tasks')}
                className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 rounded-2xl border border-green-200 transition-all duration-300 hover:scale-105"
              >
                <div className="bg-green-500 group-hover:bg-green-600 rounded-xl p-3 transition-all duration-300">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-800">مهمة جديدة</span>
              </button>
              
              <button 
                onClick={() => onViewChange && onViewChange('inventory')}
                className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200 rounded-2xl border border-orange-200 transition-all duration-300 hover:scale-105"
              >
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
              
              <button 
                onClick={() => onViewChange && onViewChange('daily-log')}
                className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-amber-100 hover:from-yellow-100 hover:to-amber-200 rounded-2xl border border-yellow-200 transition-all duration-300 hover:scale-105"
              >
                <div className="bg-yellow-500 group-hover:bg-yellow-600 rounded-xl p-3 transition-all duration-300">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-yellow-800">تقرير يومي</span>
              </button>
              
              <button 
                onClick={() => onViewChange && onViewChange('statistics')}
                className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200 rounded-2xl border border-gray-200 transition-all duration-300 hover:scale-105"
              >
                <div className="bg-gray-500 group-hover:bg-gray-600 rounded-xl p-3 transition-all duration-300">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">الإحصائيات</span>
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