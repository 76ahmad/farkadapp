import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, AlertTriangle, User, MapPin, Calendar,
  HardHat, Activity, Award, Target, Coffee, Sun, Moon,
  Bell, Settings, LogIn, LogOut, Play, Pause, CheckSquare,
  Star, ThumbsUp, Timer, Wrench, Shield, Phone
} from 'lucide-react';

const WorkerDashboard = ({ workers = [], currentUser }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorking, setIsWorking] = useState(false);
  const [workStartTime, setWorkStartTime] = useState(null);
  const [workHours, setWorkHours] = useState('00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isWorking && workStartTime) {
        const elapsed = new Date() - workStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setWorkHours(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isWorking, workStartTime]);

  // بيانات العامل الحالي
  const currentWorker = workers.find(w => w.email === currentUser?.email) || {
    id: 1,
    name: 'أحمد محمد العامل',
    role: 'عامل بناء',
    status: 'حاضر',
    project: 'برج الأعمال المركزي',
    shift: 'صباحي',
    experience: '5 سنوات',
    rating: 4.5,
    completedTasks: 48,
    safetyScore: 'ممتاز',
    phone: '05012345678',
    emergencyContact: '05087654321'
  };

  // مهام اليوم
  const todayTasks = [
    {
      id: 1,
      title: 'صب الخرسانة - الطابق الثالث',
      description: 'صب خرسانة الأعمدة والجسور',
      status: 'قيد التنفيذ',
      priority: 'عالية',
      startTime: '08:00',
      endTime: '12:00',
      location: 'الطابق الثالث - المنطقة أ',
      tools: ['خلاطة خرسانة', 'مضخة', 'أدوات تسوية'],
      safetyNotes: 'ارتداء خوذة الأمان وحزام الأمان'
    },
    {
      id: 2,
      title: 'تنظيف منطقة العمل',
      description: 'تنظيف وترتيب منطقة العمل بعد الصب',
      status: 'معلق',
      priority: 'متوسطة',
      startTime: '13:00',
      endTime: '14:00',
      location: 'الطابق الثالث',
      tools: ['أدوات تنظيف', 'حاويات قمامة'],
      safetyNotes: 'التأكد من نظافة المنطقة'
    },
    {
      id: 3,
      title: 'فحص الأدوات',
      description: 'فحص وصيانة أدوات العمل',
      status: 'مجدول',
      priority: 'منخفضة',
      startTime: '14:30',
      endTime: '15:30',
      location: 'مخزن الأدوات',
      tools: ['جميع الأدوات المخصصة'],
      safetyNotes: 'التأكد من سلامة جميع الأدوات'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'حاضر': return 'text-green-600 bg-green-100';
      case 'غائب': return 'text-red-600 bg-red-100';
      case 'متأخر': return 'text-yellow-600 bg-yellow-100';
      case 'قيد التنفيذ': return 'text-blue-600 bg-blue-100';
      case 'معلق': return 'text-yellow-600 bg-yellow-100';
      case 'مجدول': return 'text-purple-600 bg-purple-100';
      case 'مكتمل': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'عالية': return 'text-red-600 bg-red-100 border-red-200';
      case 'متوسطة': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'منخفضة': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const handleAttendance = (type) => {
    if (type === 'checkin') {
      setIsWorking(true);
      setWorkStartTime(new Date());
    } else {
      setIsWorking(false);
      setWorkStartTime(null);
      setWorkHours('00:00:00');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100" dir="rtl">
      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        
        {/* Header العامل */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-10 blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <HardHat className="h-8 w-8 text-white" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                    currentWorker.status === 'حاضر' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">مرحباً {currentWorker.name}</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    {currentWorker.role} - {currentWorker.experience}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    {currentTime.toLocaleDateString('ar-EG')} - {currentTime.toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="bg-white/50 backdrop-blur-sm border border-white/30 p-2 rounded-xl shadow hover:shadow-lg transition-all duration-300">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
                <button className="bg-white/50 backdrop-blur-sm border border-white/30 p-2 rounded-xl shadow hover:shadow-lg transition-all duration-300">
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* بطاقات الحالة الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* حالة الحضور */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">حالة الحضور</p>
              <p className={`text-lg font-bold px-3 py-1 rounded-full ${getStatusColor(currentWorker.status)}`}>
                {currentWorker.status}
              </p>
              <p className="text-xs text-gray-500 mt-2">الوردية: {currentWorker.shift}</p>
            </div>
          </div>

          {/* ساعات العمل */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-3">
                <Timer className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">ساعات العمل اليوم</p>
              <p className="text-lg font-bold text-blue-600">{workHours}</p>
              <p className="text-xs text-gray-500 mt-2">
                {isWorking ? 'جاري العمل...' : 'غير نشط'}
              </p>
            </div>
          </div>

          {/* تقييم الأداء */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">تقييم الأداء</p>
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-lg font-bold text-yellow-600">{currentWorker.rating}</span>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-xs text-gray-500">{currentWorker.completedTasks} مهمة مكتملة</p>
            </div>
          </div>
        </div>

        {/* أزرار الحضور والانصراف */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">تسجيل الحضور والانصراف</h3>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => handleAttendance('checkin')}
              disabled={isWorking}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isWorking 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <LogIn className="h-5 w-5" />
              تسجيل حضور
            </button>
            
            <button 
              onClick={() => handleAttendance('checkout')}
              disabled={!isWorking}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                !isWorking 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <LogOut className="h-5 w-5" />
              تسجيل انصراف
            </button>
          </div>
          
          {isWorking && (
            <div className="mt-4 text-center">
              <p className="text-sm text-green-600 font-medium">✅ أنت الآن في العمل منذ {workHours}</p>
            </div>
          )}
        </div>

        {/* مهام اليوم */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CheckSquare className="h-6 w-6 text-blue-600" />
                مهام اليوم
              </h3>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {todayTasks.length} مهام
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {todayTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-gray-800">{task.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{task.startTime} - {task.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span>{task.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition-all duration-300">
                      {task.status === 'قيد التنفيذ' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">الأدوات المطلوبة:</p>
                    <div className="flex flex-wrap gap-1">
                      {task.tools.map((tool, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">تعليمات السلامة:</span>
                    </div>
                    <p className="text-sm text-orange-700">{task.safetyNotes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* معلومات المشروع الحالي */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* تفاصيل المشروع */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              المشروع الحالي
            </h3>
            
            <div className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="font-semibold text-purple-800">{currentWorker.project}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-600">التخصص</p>
                  <p className="font-medium text-gray-800">{currentWorker.role}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-600">السلامة</p>
                  <p className="font-medium text-green-600">{currentWorker.safetyScore}</p>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات الاتصال والطوارئ */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              معلومات الاتصال
            </h3>
            
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-600 mb-1">رقم الهاتف</p>
                <p className="font-semibold text-blue-800">{currentWorker.phone}</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 mb-1">طوارئ</p>
                <p className="font-semibold text-red-800">{currentWorker.emergencyContact}</p>
              </div>
              
              <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300">
                🚨 الإبلاغ عن طارئ
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl shadow">
            <HardHat className="h-4 w-4 text-indigo-500" />
            <span className="text-gray-600 text-sm">لوحة تحكم العامل - السلامة أولاً</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;