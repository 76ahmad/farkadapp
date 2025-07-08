import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, AlertTriangle, User, MapPin, Calendar,
  HardHat, Activity, Award, Target, Coffee, Sun, Moon,
  Bell, Settings, LogIn, LogOut, Play, Pause, CheckSquare,
  Star, ThumbsUp, Timer, Wrench, Shield, Phone
} from 'lucide-react';

const WorkerDashboard = ({ workers = [], currentUser, tasks = [], taskActions }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorking, setIsWorking] = useState(false);
  const [workStartTime, setWorkStartTime] = useState(null);
  const [workHours, setWorkHours] = useState('00:00:00');
  const [currentWorker, setCurrentWorker] = useState(null);
  const [attendanceRecord, setAttendanceRecord] = useState([]);

  // تحديث البيانات عند تغيير workers أو currentUser
  useEffect(() => {
    const worker = workers.find(w => 
      w.email === currentUser?.email || 
      w.id === currentUser?.id || 
      w.name === currentUser?.displayName
    );
    
    if (worker) {
      setCurrentWorker(worker);
    } else {
      // إنشاء بيانات افتراضية إذا لم يوجد العامل
      setCurrentWorker({
        id: currentUser?.id || Date.now(),
        name: currentUser?.displayName || currentUser?.name || 'العامل',
        role: currentUser?.role || 'عامل بناء',
        status: 'نشط',
        project: 'المشروع الحالي',
        shift: 'صباحي',
        experience: '1 سنة',
        rating: 4.5,
        completedTasks: tasks.filter(t => t.completed && (t.assignedTo === currentUser?.email || t.assignedTo === currentUser?.id)).length,
        safetyScore: 'ممتاز',
        phone: currentUser?.phone || '05xxxxxxxx',
        emergencyContact: '05xxxxxxxx'
      });
    }
  }, [workers, currentUser, tasks]);

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

  // مهام العامل المحدثة من Firebase
  const workerTasks = tasks.filter(task => 
    task.assignedTo === currentUser?.email ||
    task.assignedTo === currentUser?.id ||
    task.createdBy === currentUser?.email ||
    (task.assignedTo === 'worker' && task.workerId === currentUser?.id)
  );

  // تصنيف المهام
  const todayTasks = workerTasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const upcomingTasks = workerTasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return taskDate > today;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'نشط': return 'text-green-600 bg-green-100';
      case 'غير نشط': return 'text-red-600 bg-red-100';
      case 'متأخر': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const handleAttendance = async (type) => {
    if (type === 'checkin') {
      setIsWorking(true);
      setWorkStartTime(new Date());
      
      // حفظ الحضور في Firebase
      const attendanceData = {
        workerId: currentUser?.id,
        workerName: currentUser?.displayName,
        checkInTime: new Date().toISOString(),
        date: new Date().toDateString(),
        status: 'checkin'
      };
      
      setAttendanceRecord(prev => [...prev, attendanceData]);
      console.log('تم تسجيل الحضور:', attendanceData);
      
    } else {
      setIsWorking(false);
      setWorkStartTime(null);
      
      // حفظ الانصراف في Firebase
      const attendanceData = {
        workerId: currentUser?.id,
        workerName: currentUser?.displayName,
        checkOutTime: new Date().toISOString(),
        date: new Date().toDateString(),
        status: 'checkout',
        totalHours: workHours
      };
      
      setAttendanceRecord(prev => [...prev, attendanceData]);
      console.log('تم تسجيل الانصراف:', attendanceData);
      setWorkHours('00:00:00');
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    if (taskActions && taskActions.updateTask) {
      try {
        await taskActions.updateTask(taskId, updates);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    await handleTaskUpdate(taskId, { 
      completed: true, 
      completedAt: new Date().toISOString(),
      completedBy: currentUser?.displayName 
    });
  };

  if (!currentWorker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات العامل...</p>
        </div>
      </div>
    );
  }

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
                    currentWorker.status === 'نشط' ? 'bg-green-500' : 'bg-red-500'
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
                <button className="bg-white/50 backdrop-blur-sm border border-white/30 p-2 rounded-xl shadow hover:shadow-lg transition-all duration-300 relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {todayTasks.filter(t => !t.completed).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {todayTasks.filter(t => !t.completed).length}
                    </div>
                  )}
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
              <p className="text-xs text-gray-500">
                {workerTasks.filter(t => t.completed).length} مهمة مكتملة
              </p>
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
              {todayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد مهام لليوم</p>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-800">{task.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            task.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {task.completed ? 'مكتملة' : 'قيد التنفيذ'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'high' ? 'عالية' :
                             task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(task.dueDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{task.location || task.project || currentWorker.project}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => task.completed ? null : handleCompleteTask(task.id)}
                        disabled={task.completed}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          task.completed 
                            ? 'bg-green-100 text-green-600 cursor-not-allowed' 
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                        }`}
                      >
                        {task.completed ? <CheckCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {task.tools && task.tools.length > 0 && (
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
                    )}
                    
                    {task.safetyNotes && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">تعليمات السلامة:</span>
                        </div>
                        <p className="text-sm text-orange-700">{task.safetyNotes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
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
              
              {/* المهام القادمة */}
              {upcomingTasks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">المهام القادمة:</p>
                  <div className="space-y-2">
                    {upcomingTasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="bg-gray-50 rounded-lg p-2 text-sm">
                        <p className="font-medium text-gray-800">{task.title}</p>
                        <p className="text-gray-600">
                          {new Date(task.dueDate).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              
              {/* معلومات إضافية */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">أرقام مهمة:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">مشرف السلامة:</span>
                    <span className="font-medium">0501234567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">مدير الموقع:</span>
                    <span className="font-medium">0507654321</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الإسعاف:</span>
                    <span className="font-medium text-red-600">997</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ملخص الأداء الأسبوعي */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            ملخص الأداء الأسبوعي
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {workerTasks.filter(t => t.completed).length}
              </div>
              <p className="text-sm text-gray-600">مهام مكتملة</p>
            </div>
            
            <div className="text-center bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">5</div>
              <p className="text-sm text-gray-600">أيام حضور</p>
            </div>
            
            <div className="text-center bg-yellow-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-600">40</div>
              <p className="text-sm text-gray-600">ساعات عمل</p>
            </div>
            
            <div className="text-center bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">
                {currentWorker.rating}
              </div>
              <p className="text-sm text-gray-600">التقييم</p>
            </div>
          </div>
          
          {/* نصائح السلامة */}
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <h4 className="font-medium text-orange-800">نصائح السلامة اليومية</h4>
            </div>
            <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
              <li>ارتدِ معدات الحماية الشخصية دائماً</li>
              <li>تأكد من سلامة الأدوات قبل الاستخدام</li>
              <li>أبلغ عن أي مخاطر فوراً</li>
              <li>حافظ على نظافة موقع العمل</li>
            </ul>
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