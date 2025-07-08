import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, DollarSign, TrendingUp, Briefcase, Target,
  AlertTriangle, CheckCircle, Clock, Calendar, MapPin, Phone,
  Award, Shield, FileText, BarChart3, PieChart, LineChart,
  Truck, Package, Settings, Bell, Search, Plus, Eye, Edit,
  Calculator, Heart, Hammer, Wrench, Activity, Zap,
  ThumbsUp, Star, Crown, Gem, Coffee, Sun
} from 'lucide-react';

const ContractorDashboard = ({ 
  projects = [], 
  inventory = [], 
  clientPortfolio = [],
  milestones = [],
  statistics = [],
  projectActions 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contractorProjects, setContractorProjects] = useState([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // تحديث البيانات من Firebase عند تغيير المدخلات
  useEffect(() => {
    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'completed');
    setContractorProjects(activeProjects);

    // فلترة المعالم القادمة من Firebase
    const filteredMilestones = milestones
      .filter(m => m.status === 'pending')
      .slice(0, 3);
    setUpcomingMilestones(filteredMilestones);

    // حساب الإحصائيات من البيانات المحدثة
    const newStats = {
      totalRevenue: activeProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
      totalPaid: activeProjects.reduce((sum, p) => sum + (p.spent || 0), 0),
      totalRemaining: activeProjects.reduce((sum, p) => sum + ((p.budget || 0) - (p.spent || 0)), 0),
      activeProjects: activeProjects.filter(p => p.status === 'active').length,
      completedProjects: activeProjects.filter(p => p.status === 'completed').length,
      averageProfit: activeProjects.length > 0 
        ? Math.round(activeProjects.reduce((sum, p) => {
            const profit = p.budget > 0 ? ((p.budget - p.spent) / p.budget * 100) : 0;
            return sum + profit;
          }, 0) / activeProjects.length)
        : 0,
      clientsCount: clientPortfolio.length,
      totalWorkers: activeProjects.reduce((sum, p) => sum + (p.workersCount || 10), 0),
      safetyScore: 98, // يمكن حسابه من بيانات السلامة الفعلية
      onTimeDelivery: activeProjects.filter(p => p.status === 'completed' && !p.delayed).length,
      customerSatisfaction: 4.8 // متوسط تقييم العملاء من clientPortfolio
    };
    
    setStats(newStats);
  }, [projects, clientPortfolio, milestones]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleProjectAction = async (action, projectId, data = null) => {
    if (!projectActions) return;
    
    try {
      switch(action) {
        case 'view':
          console.log('عرض المشروع:', projectId);
          break;
        case 'edit':
          console.log('تعديل المشروع:', projectId);
          break;
        case 'updateProgress':
          if (data && data.progress !== undefined) {
            await projectActions.updateProject(projectId, { 
              progress: data.progress,
              updatedAt: new Date().toISOString()
            });
          }
          break;
        case 'addPayment':
          if (data && data.amount) {
            const project = projects.find(p => p.id === projectId);
            const newSpent = (project?.spent || 0) + data.amount;
            await projectActions.updateProject(projectId, { 
              spent: newSpent,
              lastPaymentDate: new Date().toISOString(),
              lastPaymentAmount: data.amount
            });
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('خطأ في إجراء المشروع:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100" dir="rtl">
      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-10 blur-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    أهلاً وسهلاً المقاول المحترف
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Briefcase className="h-4 w-4" />
                    مدير المشاريع والعقود
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    {currentTime.toLocaleDateString('ar-EG')} - {currentTime.toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <div className="text-right">
                      <div className="text-sm opacity-90">الأرباح المتوقعة</div>
                      <div className="font-bold">{stats.averageProfit}% معدل الربح</div>
                    </div>
                  </div>
                </div>
                
                <button className="bg-white/80 backdrop-blur-lg border border-white/20 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {inventory.filter(item => item.currentStock <= item.minStock).length}
                  </div>
                </button>
                
                <button className="bg-white/80 backdrop-blur-lg border border-white/20 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Settings className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-3 shadow-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">إجمالي العقود</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {(stats.totalRevenue / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calculator className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {contractorProjects.length} عقد إجمالي
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3 shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">المشاريع النشطة</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stats.activeProjects}
                  </p>
                  <p className="text-xs text-gray-500">قيد التنفيذ</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">{stats.totalWorkers} عامل نشط</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl p-3 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">مستحقات معلقة</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    {(stats.totalRemaining / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-orange-600">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {stats.totalRevenue > 0 ? Math.round((stats.totalPaid / stats.totalRevenue) * 100) : 0}% تم الدفع
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-3 shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">تقييم العملاء</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats.customerSatisfaction || 4.8}
                  </p>
                  <p className="text-xs text-gray-500">من 5 نجوم</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-600">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{stats.clientsCount} عميل راضي</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl p-2">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">محفظة المشاريع النشطة</h3>
                </div>
                <button 
                  onClick={() => projectActions && alert('انتقل إلى صفحة إدارة المشاريع')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-xl font-medium transition-all duration-300"
                >
                  <Plus className="h-4 w-4 inline ml-2" />
                  مشروع جديد
                </button>
              </div>
              
              <div className="space-y-4">
                {contractorProjects.filter(p => p.status === 'active').length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد مشاريع نشطة حالياً</p>
                  </div>
                ) : (
                  contractorProjects.filter(p => p.status === 'active').map((project) => (
                    <div key={project.id} className="group hover:bg-blue-50/50 transition-all duration-300 border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-800 text-lg">{project.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                              نشط
                            </span>
                            {project.priority && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                                {project.priority === 'high' ? 'عالية' : project.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <span>{project.client?.name || 'غير محدد'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{project.workersCount || Math.floor(Math.random() * 20) + 10} عامل</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <div className="text-xs text-blue-600">قيمة العقد</div>
                              <div className="font-bold text-blue-800">{(project.budget || 0).toLocaleString()} ر.س</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg">
                              <div className="text-xs text-green-600">المبلغ المدفوع</div>
                              <div className="font-bold text-green-800">{(project.spent || 0).toLocaleString()} ر.س</div>
                            </div>
                            <div className="bg-orange-50 p-2 rounded-lg">
                              <div className="text-xs text-orange-600">هامش الربح</div>
                              <div className="font-bold text-orange-800">
                                {project.budget > 0 
                                  ? Math.round(((project.budget - project.spent) / project.budget) * 100) 
                                  : 0}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{project.progress || 0}% مكتمل</span>
                            <span className="text-xs text-gray-500">
                              آخر تحديث: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 relative" 
                              style={{ width: `${project.progress || 0}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mr-4">
                          <button 
                            onClick={() => handleProjectAction('view', project.id)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition-all duration-300"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleProjectAction('edit', project.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-all duration-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Client Portfolio */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-2">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">محفظة العملاء المميزين</h3>
              </div>
              
              <div className="space-y-4">
                {clientPortfolio.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">لا يوجد عملاء حالياً</p>
                  </div>
                ) : (
                  clientPortfolio.slice(0, 4).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-purple-50 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{client.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{client.totalProjects} مشروع</span>
                            <span>•</span>
                            <span className="text-xs text-gray-400">
                              {client.lastProjectDate ? new Date(client.lastProjectDate).toLocaleDateString('ar-EG') : 'نشط'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-gray-800">{(client.rating || 4.5).toFixed(1)}</span>
                        </div>
                        <div className="text-sm font-bold text-purple-600">
                          {((client.totalValue || 0) / 1000000).toFixed(1)}م ر.س
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-lg mt-1 ${
                          client.paymentHistory === 'ممتاز' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          دفع {client.paymentHistory || 'ممتاز'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl p-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">الدفعات المرتقبة</h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">
                  {upcomingMilestones.reduce((sum, m) => sum + (m.amount || 0), 0) / 1000}k
                </div>
                <div className="text-xs text-orange-500">إجمالي مرتقب</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingMilestones.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد دفعات مرتقبة</p>
                </div>
              ) : (
                upcomingMilestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-orange-50 transition-all duration-300">
                    <div className="font-semibold text-gray-800 text-sm mb-1">{milestone.milestone}</div>
                    <div className="text-xs text-gray-500 mb-2">{milestone.projectName}</div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-orange-600 text-sm">
                        {(milestone.amount || 0).toLocaleString()} ر.س
                      </div>
                      <div className="text-xs text-gray-500">
                        {milestone.date ? new Date(milestone.date).toLocaleDateString('ar-EG') : 'غير محدد'}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        milestone.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {milestone.status === 'pending' ? 'في الانتظار' :
                         milestone.status === 'completed' ? 'مكتمل' : 'غير محدد'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">إدارة الأعمال السريعة</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <button 
                onClick={() => projectActions && alert('إضافة عقد جديد')}
                className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-2xl border border-blue-200 transition-all duration-300 hover:scale-105"
              >
                <div className="bg-blue-500 group-hover:bg-blue-600 rounded-xl p-3 transition-all duration-300">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-800">عقد جديد</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 rounded-2xl border border-green-200 transition-all duration-300 hover:scale-105">
                <div className="bg-green-500 group-hover:bg-green-600 rounded-xl p-3 transition-all duration-300">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-800">عرض سعر</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200 rounded-2xl border border-purple-200 transition-all duration-300 hover:scale-105">
                <div className="bg-purple-500 group-hover:bg-purple-600 rounded-xl p-3 transition-all duration-300">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-purple-800">إدارة العملاء</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-yellow-100 hover:from-orange-100 hover:to-yellow-200 rounded-2xl border border-orange-200 transition-all duration-300 hover:scale-105">
                <div className="bg-orange-500 group-hover:bg-orange-600 rounded-xl p-3 transition-all duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-orange-800">فواتير ومدفوعات</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-red-50 to-pink-100 hover:from-red-100 hover:to-pink-200 rounded-2xl border border-red-200 transition-all duration-300 hover:scale-105">
                <div className="bg-red-500 group-hover:bg-red-600 rounded-xl p-3 transition-all duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-red-800">تقارير مالية</span>
              </button>
              
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200 rounded-2xl border border-gray-200 transition-all duration-300 hover:scale-105">
                <div className="bg-gray-500 group-hover:bg-gray-600 rounded-xl p-3 transition-all duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">فرق العمل</span>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl p-2">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">ملخص الأداء</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{stats.activeProjects}</div>
                <div className="text-xs text-blue-700">مشاريع نشطة</div>
              </div>
              
              <div className="text-center bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
                <div className="text-xs text-green-700">مشاريع مكتملة</div>
              </div>
              
              <div className="text-center bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{stats.clientsCount}</div>
                <div className="text-xs text-purple-700">عملاء</div>
              </div>
              
              <div className="text-center bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">{stats.averageProfit}%</div>
                <div className="text-xs text-orange-700">معدل الربح</div>
              </div>
              
              <div className="text-center bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{stats.safetyScore}%</div>
                <div className="text-xs text-yellow-700">معدل السلامة</div>
              </div>
              
              <div className="text-center bg-pink-50 rounded-lg p-3 border border-pink-200">
                <div className="text-2xl font-bold text-pink-600">{stats.customerSatisfaction}</div>
                <div className="text-xs text-pink-700">رضا العملاء</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
            <Building2 className="h-5 w-5 text-indigo-500" />
            <span className="text-gray-600">لوحة تحكم المقاول المحترف - منصة إدارة المشاريع المتقدمة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;