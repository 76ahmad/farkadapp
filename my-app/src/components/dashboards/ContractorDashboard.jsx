import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, DollarSign, TrendingUp, Briefcase, Target,
  AlertTriangle, CheckCircle, Clock, Calendar, MapPin, Phone,
  Award, Shield, FileText, BarChart3, PieChart, LineChart,
  Truck, Package, Settings, Bell, Search, Plus, Eye, Edit,
  Calculator, Heart, Hammer, Wrench, Activity, Zap,
  ThumbsUp, Star, Crown, Gem, Coffee, Sun
} from 'lucide-react';

const ContractorDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const contractorProjects = [
    { 
      id: 1, 
      name: 'برج الأعمال المركزي', 
      client: 'شركة التطوير العقاري الحديث',
      contractValue: 2500000, 
      paidAmount: 1625000,
      remainingAmount: 875000,
      progress: 65,
      location: 'الرياض - حي الملك فهد',
      status: 'جاري',
      profitMargin: 18,
      teamSize: 28
    },
    { 
      id: 2, 
      name: 'مجمع الياسمين السكني', 
      client: 'مؤسسة الإسكان التنموية',
      contractValue: 1800000, 
      paidAmount: 720000,
      remainingAmount: 1080000,
      progress: 40,
      location: 'جدة - حي النزهة',
      status: 'جاري',
      profitMargin: 22,
      teamSize: 35
    },
    { 
      id: 3, 
      name: 'فيلا العائلة الملكية', 
      client: 'المهندس سعد العتيبي',
      contractValue: 850000, 
      paidAmount: 850000,
      remainingAmount: 0,
      progress: 100,
      location: 'الدمام - حي الشاطئ',
      status: 'مكتمل',
      profitMargin: 25,
      teamSize: 0
    }
  ];

  const clientPortfolio = [
    { 
      id: 1, 
      name: 'شركة التطوير العقاري الحديث', 
      totalProjects: 3, 
      totalValue: 4200000, 
      rating: 4.8, 
      paymentHistory: 'ممتاز'
    },
    { 
      id: 2, 
      name: 'مؤسسة الإسكان التنموية', 
      totalProjects: 2, 
      totalValue: 2800000, 
      rating: 4.5, 
      paymentHistory: 'جيد'
    },
    { 
      id: 3, 
      name: 'المهندس سعد العتيبي', 
      totalProjects: 5, 
      totalValue: 3200000, 
      rating: 5.0, 
      paymentHistory: 'ممتاز'
    }
  ];

  const upcomingMilestones = [
    { id: 1, project: 'برج الأعمال المركزي', milestone: 'إنجاز الطابق العاشر', date: '2024-12-25', amount: 150000 },
    { id: 2, project: 'مجمع الياسمين السكني', milestone: 'إكمال الأساسات', date: '2024-12-30', amount: 200000 },
    { id: 3, project: 'مكاتب الشركة التجارية', milestone: 'اعتماد التصاميم', date: '2025-01-15', amount: 80000 }
  ];

  const stats = {
    totalRevenue: contractorProjects.reduce((sum, p) => sum + p.contractValue, 0),
    totalPaid: contractorProjects.reduce((sum, p) => sum + p.paidAmount, 0),
    totalRemaining: contractorProjects.reduce((sum, p) => sum + p.remainingAmount, 0),
    activeProjects: contractorProjects.filter(p => p.status === 'جاري').length,
    averageProfit: Math.round(contractorProjects.reduce((sum, p) => sum + p.profitMargin, 0) / contractorProjects.length),
    clientsCount: clientPortfolio.length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'جاري': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'مكتمل': return 'bg-green-100 text-green-800 border-green-200';
      case 'معلق': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">4</div>
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
                  <span className="text-sm font-medium">عمال نشطين</span>
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
                    {Math.round((stats.totalPaid / stats.totalRevenue) * 100)}% تم الدفع
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
                    4.8
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
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-xl font-medium transition-all duration-300">
                  <Plus className="h-4 w-4 inline ml-2" />
                  مشروع جديد
                </button>
              </div>
              
              <div className="space-y-4">
                {contractorProjects.filter(p => p.status === 'جاري').map((project) => (
                  <div key={project.id} className="group hover:bg-blue-50/50 transition-all duration-300 border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-800 text-lg">{project.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{project.client}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{project.teamSize} عامل</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <div className="text-xs text-blue-600">قيمة العقد</div>
                            <div className="font-bold text-blue-800">{project.contractValue.toLocaleString()} ر.س</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded-lg">
                            <div className="text-xs text-green-600">المبلغ المدفوع</div>
                            <div className="font-bold text-green-800">{project.paidAmount.toLocaleString()} ر.س</div>
                          </div>
                          <div className="bg-orange-50 p-2 rounded-lg">
                            <div className="text-xs text-orange-600">هامش الربح</div>
                            <div className="font-bold text-orange-800">{project.profitMargin}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{project.progress}% مكتمل</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 relative" 
                            style={{ width: `${project.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mr-4">
                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition-all duration-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-all duration-300">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                {clientPortfolio.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-purple-50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{client.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{client.totalProjects} مشروع</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-800">{client.rating}</span>
                      </div>
                      <div className="text-sm font-bold text-purple-600">
                        {(client.totalValue / 1000000).toFixed(1)}م ر.س
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-lg mt-1 ${
                        client.paymentHistory === 'ممتاز' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        دفع {client.paymentHistory}
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="text-lg font-bold text-orange-600">430k</div>
                <div className="text-xs text-orange-500">إجمالي مرتقب</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-orange-50 transition-all duration-300">
                  <div className="font-semibold text-gray-800 text-sm mb-1">{milestone.milestone}</div>
                  <div className="text-xs text-gray-500 mb-2">{milestone.project}</div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-orange-600 text-sm">
                      {milestone.amount.toLocaleString()} ر.س
                    </div>
                    <div className="text-xs text-gray-500">{milestone.date}</div>
                  </div>
                </div>
              ))}
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
              <button className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-2xl border border-blue-200 transition-all duration-300 hover:scale-105">
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