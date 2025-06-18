import React from 'react';
import { 
  TrendingUp, DollarSign, Users, Package, 
  CheckCircle, Clock, AlertCircle, Building,
  BarChart3, PieChart, Activity, Briefcase,
  Sparkles, Star, Award, Target
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts';

const StatisticsView = ({ currentUser, inventory = [], projects = [], tasks = [] }) => {
  // إذا لم يكن المستخدم مقاول، اعرض رسالة
  if (currentUser?.type !== 'contractor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 px-4 py-6">
        <div className="max-w-2xl mx-auto pt-20">
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 shadow-lg">
                <Activity className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                الإحصائيات للمقاول فقط
              </h3>
              <p className="text-gray-600 leading-relaxed">
                عذراً، هذه الصفحة متاحة فقط للمقاول لاحتوائها على معلومات مالية حساسة
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Star className="h-4 w-4" />
                واجهة حصرية
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // دوال الحماية (نفس الكود السابق)
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  const safeToLocaleString = (value) => {
    const num = safeNumber(value);
    return num.toLocaleString();
  };

  // بيانات المشاريع
  const projectStatusData = [
    { 
      name: 'نشطة', 
      value: safeProjects.filter(p => p?.status === 'active').length, 
      color: '#10b981',
      gradient: 'from-emerald-400 to-green-500'
    },
    { 
      name: 'مكتملة', 
      value: safeProjects.filter(p => p?.status === 'completed').length, 
      color: '#3b82f6',
      gradient: 'from-blue-400 to-indigo-500'
    },
    { 
      name: 'متوقفة', 
      value: safeProjects.filter(p => p?.status === 'paused').length, 
      color: '#6b7280',
      gradient: 'from-gray-400 to-slate-500'
    }
  ];

  // بيانات المصروفات الشهرية
  const monthlyExpenses = [
    { month: 'يناير', amount: 120000, color: '#3b82f6' },
    { month: 'فبراير', amount: 145000, color: '#6366f1' },
    { month: 'مارس', amount: 180000, color: '#8b5cf6' },
    { month: 'أبريل', amount: 165000, color: '#a855f7' },
    { month: 'مايو', amount: 195000, color: '#d946ef' },
    { month: 'يونيو', amount: 210000, color: '#ec4899' }
  ];

  // بيانات استخدام المواد
  const materialsUsage = safeInventory
    .filter(item => item && typeof item === 'object')
    .map(item => ({
      name: item.name || 'غير محدد',
      used: Math.max(0, safeNumber(item.minStock) * 2 - safeNumber(item.currentStock)),
      remaining: safeNumber(item.currentStock)
    }))
    .slice(0, 5);

  // حساب الإحصائيات المالية
  const financialStats = {
    totalBudget: safeProjects.reduce((sum, p) => sum + safeNumber(p?.budget), 0),
    totalSpent: safeProjects.reduce((sum, p) => sum + safeNumber(p?.spent), 0),
    totalProfit: safeProjects.reduce((sum, p) => {
      const budget = safeNumber(p?.budget);
      const spent = safeNumber(p?.spent);
      return sum + (budget - spent);
    }, 0),
    avgProjectBudget: safeProjects.length > 0 
      ? safeProjects.reduce((sum, p) => sum + safeNumber(p?.budget), 0) / safeProjects.length 
      : 0
  };

  const avgProgress = safeProjects.length > 0 
    ? Math.round(safeProjects.reduce((sum, p) => sum + safeNumber(p?.progress), 0) / safeProjects.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header مع تأثيرات */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-10 blur-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  الإحصائيات والتقارير المالية
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  آخر تحديث: اليوم - {new Date().toLocaleDateString('ar-EG')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold">المقاول المتميز</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* بطاقات الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* إجمالي الميزانية */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl p-3 shadow-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">إجمالي الميزانية</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {(financialStats.totalBudget / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+12.5% من الشهر الماضي</span>
              </div>
            </div>
          </div>

          {/* إجمالي المصروفات */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl p-3 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">إجمالي المصروفات</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    {(financialStats.totalSpent / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {financialStats.totalBudget > 0 
                    ? Math.round((financialStats.totalSpent / financialStats.totalBudget) * 100) 
                    : 0}% من الميزانية
                </span>
              </div>
            </div>
          </div>

          {/* صافي الربح */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-3 shadow-lg">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">صافي الربح</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {(financialStats.totalProfit / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">هامش ربح ممتاز</span>
              </div>
            </div>
          </div>

          {/* متوسط الإنجاز */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl p-3 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">متوسط الإنجاز</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    {avgProgress}%
                  </p>
                  <p className="text-xs text-gray-500">لجميع المشاريع</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-violet-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${avgProgress}%` }}
                  />
                </div>
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* توزيع المشاريع */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl p-2">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">توزيع المشاريع حسب الحالة</h3>
              </div>
              
              {projectStatusData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={350}>
                  <RePieChart>
                    <defs>
                      {projectStatusData.map((entry, index) => (
                        <linearGradient key={index} id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: entry.color, stopOpacity: 0.8}} />
                          <stop offset="100%" style={{stopColor: entry.color, stopOpacity: 1}} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="#fff"
                      strokeWidth={3}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#gradient${index})`} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-350 flex flex-col items-center justify-center text-gray-500">
                  <Building className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">لا توجد مشاريع لعرضها</p>
                  <p className="text-sm">قم بإضافة مشاريع جديدة لرؤية التوزيع</p>
                </div>
              )}
            </div>
          </div>

          {/* المصروفات الشهرية */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-pink-400 to-red-500 rounded-xl p-2">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">المصروفات الشهرية</h3>
              </div>
              
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyExpenses} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#be185d" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px', fill: '#6b7280' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${safeToLocaleString(value)} ريال`, 'المصروفات']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* جدول المشاريع المالي المحدث */}
        {safeProjects.length > 0 ? (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-xl p-2">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">التفاصيل المالية للمشاريع</h3>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-right font-semibold text-gray-700">المشروع</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-700">الميزانية</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-700">المصروف</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-700">المتبقي</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-700">نسبة الصرف</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-700">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeProjects.map((project, index) => {
                      if (!project || typeof project !== 'object') return null;
                      
                      const budget = safeNumber(project.budget);
                      const spent = safeNumber(project.spent);
                      const remaining = budget - spent;
                      const spentPercentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
                      
                      return (
                        <tr 
                          key={project.id || Math.random()} 
                          className="hover:bg-blue-50/50 transition-all duration-300 border-b border-gray-100"
                        >
                          <td className="px-6 py-5">
                            <div className="font-semibold text-gray-800">{project.name || 'غير محدد'}</div>
                            <div className="text-sm text-gray-500">{project.location || ''}</div>
                          </td>
                          <td className="px-6 py-5 text-center font-medium text-gray-800">
                            {safeToLocaleString(budget)} ريال
                          </td>
                          <td className="px-6 py-5 text-center font-medium text-red-600">
                            {safeToLocaleString(spent)} ريال
                          </td>
                          <td className="px-6 py-5 text-center font-medium text-emerald-600">
                            {safeToLocaleString(remaining)} ريال
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-sm font-bold text-gray-700 min-w-[3rem]">{spentPercentage}%</span>
                              <div className="w-24 bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-1000"
                                  style={{ width: `${Math.min(100, Math.max(0, spentPercentage))}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${
                              project.status === 'active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                              project.status === 'completed' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                              {project.status === 'active' ? '🟢 نشط' : 
                               project.status === 'completed' ? '🔵 مكتمل' : '⚫ متوقف'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-slate-500 rounded-3xl opacity-10 blur-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center shadow-2xl">
              <Building className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">لا توجد مشاريع حالياً</h3>
              <p className="text-gray-500 mb-6">قم بإضافة مشاريع جديدة لعرض الإحصائيات المالية التفصيلية</p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Building className="h-5 w-5" />
                <span className="font-semibold">إضافة مشروع جديد</span>
              </div>
            </div>
          </div>
        )}

        {/* ملخص محدث */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl p-2">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                ملخص مالي شامل
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-emerald-500 rounded-lg p-2">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-emerald-800 font-semibold">المشاريع النشطة</span>
                </div>
                <div className="text-3xl font-bold text-emerald-700 mb-1">
                  {projectStatusData[0]?.value || 0}
                </div>
                <div className="text-sm text-emerald-600">مشروع قيد التنفيذ</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500 rounded-lg p-2">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-blue-800 font-semibold">متوسط ميزانية المشروع</span>
                </div>
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {safeToLocaleString(Math.round(financialStats.avgProjectBudget / 1000))}K
                </div>
                <div className="text-sm text-blue-600">ريال سعودي</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-500 rounded-lg p-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-purple-800 font-semibold">نسبة الربح</span>
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {financialStats.totalBudget > 0 
                    ? Math.round((financialStats.totalProfit / financialStats.totalBudget) * 100) 
                    : 0}%
                </div>
                <div className="text-sm text-purple-600">هامش ربح إجمالي</div>
              </div>
            </div>
            
            {/* إضافة مؤشرات الأداء */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    مؤشرات الأداء الرئيسية
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">معدل إنجاز المشاريع</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${avgProgress}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-800 min-w-[3rem]">{avgProgress}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">كفاءة الميزانية</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${financialStats.totalBudget > 0 
                                ? Math.min(100, (financialStats.totalSpent / financialStats.totalBudget) * 100) 
                                : 0}%` 
                            }}
                          />
                        </div>
                        <span className="font-semibold text-gray-800 min-w-[3rem]">
                          {financialStats.totalBudget > 0 
                            ? Math.round((financialStats.totalSpent / financialStats.totalBudget) * 100) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">معدل نجاح المشاريع</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full w-4/5 transition-all duration-1000" />
                        </div>
                        <span className="font-semibold text-gray-800 min-w-[3rem]">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    إنجازات مميزة
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="bg-emerald-500 rounded-lg p-2">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-800">مشاريع مكتملة في الوقت</div>
                        <div className="text-sm text-emerald-600">{projectStatusData[1]?.value || 0} مشروع</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="bg-blue-500 rounded-lg p-2">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-800">أفضل هامش ربح</div>
                        <div className="text-sm text-blue-600">
                          {financialStats.totalBudget > 0 
                            ? Math.round((financialStats.totalProfit / financialStats.totalBudget) * 100) 
                            : 0}% من إجمالي الميزانية
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="bg-purple-500 rounded-lg p-2">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-purple-800">تقييم الأداء العام</div>
                        <div className="text-sm text-purple-600">ممتاز - 4.8/5.0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer مع معلومات إضافية */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="text-gray-600">تم إنشاء التقرير بواسطة</span>
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              منصة البناء الذكي
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;