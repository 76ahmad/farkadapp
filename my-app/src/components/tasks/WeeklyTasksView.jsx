import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Copy, 
  CheckSquare, Clock, Users, AlertCircle, FileText,
  Filter, Search, Download, Upload, Eye, Edit2,
  Trash2, CheckCircle, XCircle, RefreshCw, Send,
  CalendarDays, Target, TrendingUp, Layers
} from 'lucide-react';

const WeeklyTasksView = ({ 
  currentUser, 
  projects = [], 
  workers = [], 
  weeklyTasksActions,
  taskActions 
}) => {
  // حساب الأسبوع الحالي
  const getCurrentWeek = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedProject, setSelectedProject] = useState('');
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // أيام الأسبوع
  const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // حساب تواريخ الأسبوع
  const getWeekDates = (week, year) => {
    const jan1 = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7 - jan1.getDay() + 1;
    const weekStart = new Date(year, 0, 1 + daysOffset);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek, currentYear);

  // تحميل خطة الأسبوع
  useEffect(() => {
    if (selectedProject) {
      loadWeeklyPlan();
    }
  }, [currentWeek, currentYear, selectedProject]);

  const loadWeeklyPlan = async () => {
    if (!weeklyTasksActions) return;
    
    setIsLoading(true);
    try {
      const plan = await weeklyTasksActions.getWeeklyPlan(
        selectedProject, 
        currentWeek, 
        currentYear
      );
      setWeeklyPlan(plan);
    } catch (error) {
      console.error('Error loading weekly plan:', error);
    }
    setIsLoading(false);
  };

  // تغيير الأسبوع
  const changeWeek = (direction) => {
    if (direction === 'next') {
      if (currentWeek === 52) {
        setCurrentWeek(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentWeek(currentWeek + 1);
      }
    } else {
      if (currentWeek === 1) {
        setCurrentWeek(52);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentWeek(currentWeek - 1);
      }
    }
  };

  // مكون إضافة مهمة جديدة
  const AddTaskModal = ({ day, onClose, onAdd }) => {
    const [taskData, setTaskData] = useState({
      title: '',
      description: '',
      startTime: '08:00',
      endTime: '17:00',
      workersNeeded: 1,
      category: 'بناء',
      priority: 'medium',
      materials: [],
      location: '',
      requirements: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const newTask = {
        ...taskData,
        dayIndex: day,
        date: weekDates[day].toISOString(),
        projectId: selectedProject,
        weekNumber: currentWeek,
        year: currentYear,
        status: 'pending',
        createdBy: currentUser?.displayName
      };

      try {
        await onAdd(newTask);
        onClose();
      } catch (error) {
        console.error('Error adding task:', error);
        alert('حدث خطأ في إضافة المهمة');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">
              إضافة مهمة جديدة - {weekDays[day]}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {weekDates[day].toLocaleDateString('ar-SA')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان المهمة *</label>
              <input
                type="text"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">وقت البداية</label>
                <input
                  type="time"
                  value={taskData.startTime}
                  onChange={(e) => setTaskData({...taskData, startTime: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">وقت النهاية</label>
                <input
                  type="time"
                  value={taskData.endTime}
                  onChange={(e) => setTaskData({...taskData, endTime: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">عدد العمال المطلوب</label>
                <input
                  type="number"
                  value={taskData.workersNeeded}
                  onChange={(e) => setTaskData({...taskData, workersNeeded: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">التصنيف</label>
                <select
                  value={taskData.category}
                  onChange={(e) => setTaskData({...taskData, category: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="بناء">بناء</option>
                  <option value="كهرباء">كهرباء</option>
                  <option value="سباكة">سباكة</option>
                  <option value="دهان">دهان</option>
                  <option value="تشطيبات">تشطيبات</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الأولوية</label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الموقع في المشروع</label>
              <input
                type="text"
                value={taskData.location}
                onChange={(e) => setTaskData({...taskData, location: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="مثال: الطابق الثاني - غرفة النوم الرئيسية"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">المتطلبات والملاحظات</label>
              <textarea
                value={taskData.requirements}
                onChange={(e) => setTaskData({...taskData, requirements: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="2"
                placeholder="أدوات خاصة، معدات حماية، تعليمات سلامة..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة المهمة
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // مكون عرض المهمة
  const TaskCard = ({ task, onEdit, onDelete }) => {
    const getPriorityColor = (priority) => {
      switch(priority) {
        case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    const getStatusIcon = (status) => {
      switch(status) {
        case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
        case 'assigned': return <Users className="h-4 w-4 text-purple-600" />;
        default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
      }
    };

    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm">{task.title}</h4>
          <div className="flex items-center gap-1">
            {getStatusIcon(task.status)}
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority === 'urgent' ? 'عاجل' :
               task.priority === 'high' ? 'عالي' :
               task.priority === 'medium' ? 'متوسط' : 'منخفض'}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{task.startTime} - {task.endTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{task.workersNeeded} عامل - {task.category}</span>
          </div>
          {task.location && (
            <div className="text-gray-500">{task.location}</div>
          )}
        </div>

        <div className="flex justify-end gap-1 mt-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit2 className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };

  // دالة إضافة مهمة
  const handleAddTask = async (taskData) => {
    if (!weeklyTasksActions) return;
    
    try {
      await weeklyTasksActions.addWeeklyTask(taskData);
      await loadWeeklyPlan();
      alert('تمت إضافة المهمة بنجاح');
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  // دالة نسخ الأسبوع
  const copyWeekTasks = async () => {
    if (!weeklyPlan || !weeklyPlan.tasks || weeklyPlan.tasks.length === 0) {
      alert('لا توجد مهام لنسخها في هذا الأسبوع');
      return;
    }

    // eslint-disable-next-line no-restricted-globals
    if (confirm('هل تريد نسخ جميع مهام هذا الأسبوع إلى الأسبوع القادم؟')) {
      try {
        await weeklyTasksActions.copyWeekTasks(
          selectedProject,
          currentWeek,
          currentYear,
          currentWeek === 52 ? 1 : currentWeek + 1,
          currentWeek === 52 ? currentYear + 1 : currentYear
        );
        alert('تم نسخ المهام بنجاح');
      } catch (error) {
        console.error('Error copying tasks:', error);
        alert('حدث خطأ في نسخ المهام');
      }
    }
  };

  // دالة إرسال المهام لمدير الموقع
  const sendToSiteManager = async () => {
    if (!weeklyPlan || weeklyPlan.status === 'sent') {
      alert('تم إرسال هذه المهام مسبقاً');
      return;
    }

    // eslint-disable-next-line no-restricted-globals
    if (confirm('هل تريد إرسال مهام هذا الأسبوع إلى مدير الموقع؟')) {
      try {
        await weeklyTasksActions.sendWeeklyPlan(
          selectedProject,
          currentWeek,
          currentYear
        );
        await loadWeeklyPlan();
        alert('تم إرسال المهام بنجاح');
      } catch (error) {
        console.error('Error sending tasks:', error);
        alert('حدث خطأ في إرسال المهام');
      }
    }
  };

  // حساب إحصائيات الأسبوع
  const weekStats = weeklyPlan ? {
    totalTasks: weeklyPlan.tasks?.length || 0,
    completedTasks: weeklyPlan.tasks?.filter(t => t.status === 'completed').length || 0,
    totalWorkers: weeklyPlan.tasks?.reduce((sum, t) => sum + (t.workersNeeded || 0), 0) || 0,
    urgentTasks: weeklyPlan.tasks?.filter(t => t.priority === 'urgent').length || 0
  } : { totalTasks: 0, completedTasks: 0, totalWorkers: 0, urgentTasks: 0 };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-blue-600" />
            المهام الأسبوعية
          </h2>
          
          <div className="flex items-center gap-4">
            {/* اختيار المشروع */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="">اختر المشروع</option>
              {projects.filter(p => p.status === 'active').map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            {/* التنقل بين الأسابيع */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeWeek('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <div className="font-semibold">
                  الأسبوع {currentWeek} - {currentYear}
                </div>
                <div className="text-sm text-gray-500">
                  {weekDates[0].toLocaleDateString('ar-SA')} - {weekDates[6].toLocaleDateString('ar-SA')}
                </div>
              </div>
              
              <button
                onClick={() => changeWeek('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* إحصائيات الأسبوع */}
        {selectedProject && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المهام</p>
                  <p className="text-2xl font-bold text-blue-600">{weekStats.totalTasks}</p>
                </div>
                <CheckSquare className="h-8 w-8 text-blue-300" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">مكتملة</p>
                  <p className="text-2xl font-bold text-green-600">{weekStats.completedTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-300" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">عدد العمال</p>
                  <p className="text-2xl font-bold text-purple-600">{weekStats.totalWorkers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-300" />
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">مهام عاجلة</p>
                  <p className="text-2xl font-bold text-red-600">{weekStats.urgentTasks}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-300" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* أزرار الإجراءات */}
      {selectedProject && currentUser?.type === 'contractor' && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyWeekTasks}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Copy className="h-4 w-4" />
              نسخ للأسبوع القادم
            </button>
            
            <button
              onClick={sendToSiteManager}
              disabled={!weeklyPlan || weeklyPlan.status === 'sent'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                weeklyPlan?.status === 'sent' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <Send className="h-4 w-4" />
              {weeklyPlan?.status === 'sent' ? 'تم الإرسال' : 'إرسال لمدير الموقع'}
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
              <FileText className="h-4 w-4" />
              تصدير PDF
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200">
              <Upload className="h-4 w-4" />
              استيراد من Excel
            </button>
          </div>
        </div>
      )}

      {/* جدول المهام الأسبوعية */}
      {selectedProject ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* رأس الجدول - أيام الأسبوع */}
              <div className="grid grid-cols-7 bg-gray-50 border-b">
                {weekDays.map((day, index) => (
                  <div key={index} className="p-4 text-center border-r last:border-r-0">
                    <div className="font-semibold">{day}</div>
                    <div className="text-sm text-gray-500">
                      {weekDates[index].toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                ))}
              </div>

              {/* محتوى الجدول - المهام */}
              <div className="grid grid-cols-7 min-h-[400px]">
                {weekDays.map((_, dayIndex) => {
                  const dayTasks = weeklyPlan?.tasks?.filter(task => 
                    task.dayIndex === dayIndex || 
                    new Date(task.date).getDay() === dayIndex
                  ) || [];

                  return (
                    <div key={dayIndex} className="border-r last:border-r-0 p-3 bg-gray-50/50">
                      <div className="space-y-2">
                        {/* زر إضافة مهمة */}
                        {currentUser?.type === 'contractor' && (
                          <button
                            onClick={() => {
                              setSelectedDay(dayIndex);
                              setShowAddTask(true);
                            }}
                            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <Plus className="h-4 w-4 mx-auto" />
                          </button>
                        )}

                        {/* عرض المهام */}
                        {dayTasks.map(task => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={(task) => console.log('Edit task:', task)}
                            onDelete={(taskId) => console.log('Delete task:', taskId)}
                          />
                        ))}

                        {/* رسالة عدم وجود مهام */}
                        {dayTasks.length === 0 && (
                          <div className="text-center py-8 text-gray-400">
                            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">لا توجد مهام</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-16 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">يرجى اختيار مشروع لعرض المهام الأسبوعية</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المهام...</p>
          </div>
        </div>
      )}

      {/* نموذج إضافة مهمة */}
      {showAddTask && selectedDay !== null && (
        <AddTaskModal
          day={selectedDay}
          onClose={() => {
            setShowAddTask(false);
            setSelectedDay(null);
          }}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
};

export default WeeklyTasksView;