import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, CheckSquare, AlertCircle, 
  UserCheck, Clock, Wrench, HardHat, Zap, 
  Paintbrush, Home, ChevronRight, ChevronLeft,
  Send, Save, RefreshCw, Filter, Search,
  DragHandle, Info, Target, Layers, Award
} from 'lucide-react';
import { tasksService } from '../../services/firebaseService';

const TaskDistributionView = ({ 
  currentUser, 
  projects = [], 
  workers = [], 
  weeklyTasksActions,
  workerActions 
}) => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedProject, setSelectedProject] = useState('');
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [taskAssignments, setTaskAssignments] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [draggedWorker, setDraggedWorker] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // حساب الأسبوع الحالي
  function getCurrentWeek() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  // أيام الأسبوع
  const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // أيقونات التخصصات
  const specializationIcons = {
    'بناء': HardHat,
    'كهرباء': Zap,
    'سباكة': Wrench,
    'دهان': Paintbrush,
    'تشطيبات': Home,
    'عام': Users
  };

  // ألوان الأولويات
  const priorityColors = {
    urgent: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50'
  };

  // تحميل المهام الأسبوعية
  useEffect(() => {
    if (selectedProject && currentUser?.type === 'site_manager') {
      loadWeeklyTasks();
    }
  }, [selectedProject, currentWeek, currentYear]);

  // تحميل العمال المتاحين
  useEffect(() => {
    if (selectedProject) {
      const projectWorkers = workers.filter(worker => 
        worker.status === 'نشط' && 
        (!worker.projects || worker.projects.length === 0 || 
         worker.projects.includes(selectedProject))
      );
      setAvailableWorkers(projectWorkers);
    }
  }, [selectedProject, workers]);

  const loadWeeklyTasks = async () => {
    if (!weeklyTasksActions) return;
    
    setIsLoading(true);
    try {
      const plan = await weeklyTasksActions.getWeeklyPlan(
        selectedProject,
        currentWeek,
        currentYear
      );
      
      if (plan && plan.tasks) {
        setWeeklyTasks(plan.tasks);
        
        // تحميل التوزيعات الحالية
        const assignments = {};
        plan.tasks.forEach(task => {
          if (task.assignedWorkers && task.assignedWorkers.length > 0) {
            assignments[task.id] = task.assignedWorkers;
          }
        });
        setTaskAssignments(assignments);
      }
    } catch (error) {
      console.error('Error loading weekly tasks:', error);
    }
    setIsLoading(false);
  };

  // التوزيع التلقائي للمهام
  const autoDistributeTasks = () => {
    const newAssignments = { ...taskAssignments };
    const workerTaskCount = {};
    
    // حساب عدد المهام الحالية لكل عامل
    availableWorkers.forEach(worker => {
      workerTaskCount[worker.id] = 0;
    });
    
    Object.values(newAssignments).forEach(workerIds => {
      workerIds.forEach(workerId => {
        if (workerTaskCount[workerId] !== undefined) {
          workerTaskCount[workerId]++;
        }
      });
    });
    
    // توزيع المهام غير المكلفة
    weeklyTasks.forEach(task => {
      if (!newAssignments[task.id] || newAssignments[task.id].length === 0) {
        // البحث عن عمال مناسبين
        const suitableWorkers = availableWorkers
          .filter(worker => 
            worker.specialization === task.category || 
            worker.specialization === 'عام'
          )
          .sort((a, b) => workerTaskCount[a.id] - workerTaskCount[b.id]);
        
        // تعيين العدد المطلوب من العمال
        const assignedWorkers = [];
        for (let i = 0; i < task.workersNeeded && i < suitableWorkers.length; i++) {
          assignedWorkers.push(suitableWorkers[i].id);
          workerTaskCount[suitableWorkers[i].id]++;
        }
        
        if (assignedWorkers.length > 0) {
          newAssignments[task.id] = assignedWorkers;
        }
      }
    });
    
    setTaskAssignments(newAssignments);
  };

  // إضافة عامل لمهمة
  const assignWorkerToTask = (taskId, workerId) => {
    const task = weeklyTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const currentAssigned = taskAssignments[taskId] || [];
    
    // التحقق من عدم تجاوز العدد المطلوب
    if (currentAssigned.length >= task.workersNeeded) {
      alert(`هذه المهمة تحتاج ${task.workersNeeded} عامل فقط`);
      return;
    }
    
    // التحقق من عدم تكرار العامل
    if (currentAssigned.includes(workerId)) {
      alert('هذا العامل مكلف بالفعل بهذه المهمة');
      return;
    }
    
    setTaskAssignments({
      ...taskAssignments,
      [taskId]: [...currentAssigned, workerId]
    });
  };

  // إزالة عامل من مهمة
  const removeWorkerFromTask = (taskId, workerId) => {
    const currentAssigned = taskAssignments[taskId] || [];
    setTaskAssignments({
      ...taskAssignments,
      [taskId]: currentAssigned.filter(id => id !== workerId)
    });
  };

  // حفظ التوزيعات
  const saveDistributions = async () => {
    if (!weeklyTasksActions) return;
    
    setIsLoading(true);
    try {
      // حفظ كل توزيع
      for (const [taskId, workerIds] of Object.entries(taskAssignments)) {
        await weeklyTasksActions.assignTaskToWorkers(taskId, workerIds);
        // تحديث المهمة في مجموعة tasks (المهام الرئيسية)
        if (workerIds.length > 0) {
          // اختر أول عامل (أو يمكنك التوزيع على أكثر من عامل حسب الحاجة)
          await tasksService.updateTask(taskId, { assignedTo: workerIds[0] });
        }
      }
      
      alert('تم حفظ التوزيعات بنجاح');
      await loadWeeklyTasks();
    } catch (error) {
      console.error('Error saving distributions:', error);
      alert('حدث خطأ في حفظ التوزيعات');
    }
    setIsLoading(false);
  };

  // إرسال التوزيعات للعمال
  const sendToWorkers = async () => {
    if (window.confirm('هل تريد إرسال المهام المكلفة إلى العمال؟')) {
      await saveDistributions();
      // يمكن إضافة منطق إرسال الإشعارات هنا
      alert('تم إرسال المهام إلى العمال');
    }
  };

  // فلترة العمال
  const filteredWorkers = availableWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          worker.specialization === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // حساب إحصائيات التوزيع
  const distributionStats = {
    totalTasks: weeklyTasks.length,
    assignedTasks: Object.keys(taskAssignments).filter(taskId => 
      taskAssignments[taskId] && taskAssignments[taskId].length > 0
    ).length,
    totalWorkersNeeded: weeklyTasks.reduce((sum, task) => sum + task.workersNeeded, 0),
    assignedWorkers: Object.values(taskAssignments).flat().filter((v, i, a) => a.indexOf(v) === i).length
  };

  // مكون بطاقة المهمة
  const TaskCard = ({ task, assignedWorkers = [] }) => {
    const Icon = specializationIcons[task.category] || Users;
    const neededWorkers = task.workersNeeded - assignedWorkers.length;
    
    return (
      <div 
        className={`border-2 rounded-lg p-4 mb-3 ${priorityColors[task.priority]} ${
          neededWorkers > 0 ? 'border-dashed' : 'border-solid'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedWorker) {
            assignWorkerToTask(task.id, draggedWorker.id);
          }
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-600" />
            <h4 className="font-semibold">{task.title}</h4>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.priority === 'urgent' ? 'bg-red-200 text-red-700' :
            task.priority === 'high' ? 'bg-orange-200 text-orange-700' :
            task.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' :
            'bg-green-200 text-green-700'
          }`}>
            {task.priority === 'urgent' ? 'عاجل' :
             task.priority === 'high' ? 'عالي' :
             task.priority === 'medium' ? 'متوسط' : 'منخفض'}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{task.startTime} - {task.endTime}</span>
          </div>
          {task.location && (
            <div className="text-gray-500">{task.location}</div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">العمال المطلوبين:</span>
            <span className={`font-semibold ${
              neededWorkers > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {assignedWorkers.length} / {task.workersNeeded}
            </span>
          </div>
          
          {/* العمال المكلفين */}
          <div className="flex flex-wrap gap-2">
            {assignedWorkers.map(worker => (
              <div
                key={worker.id}
                className="bg-white rounded-full px-3 py-1 text-sm flex items-center gap-1 shadow-sm"
              >
                <UserCheck className="h-3 w-3 text-green-500" />
                <span>{worker.name}</span>
                <button
                  onClick={() => removeWorkerFromTask(task.id, worker.id)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            
            {neededWorkers > 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-full px-3 py-1 text-sm text-gray-500">
                + {neededWorkers} عامل
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // مكون بطاقة العامل
  const WorkerCard = ({ worker }) => {
    const Icon = specializationIcons[worker.specialization] || Users;
    const assignedTasksCount = Object.values(taskAssignments)
      .filter(workerIds => workerIds.includes(worker.id)).length;
    
    return (
      <div
        draggable
        onDragStart={() => setDraggedWorker(worker)}
        onDragEnd={() => setDraggedWorker(null)}
        className="bg-white rounded-lg p-3 shadow cursor-move hover:shadow-md transition-shadow border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-sm">{worker.name}</h5>
            <p className="text-xs text-gray-500">{worker.specialization}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-blue-600">
              {assignedTasksCount}
            </div>
            <div className="text-xs text-gray-500">مهام</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            توزيع المهام الأسبوعية
          </h2>
          
          <div className="flex items-center gap-4">
            {/* اختيار المشروع */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="">اختر المشروع</option>
              {projects.filter(p => 
                p.status === 'active' && 
                p.siteManager?.id === currentUser?.id
              ).map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            {/* التنقل بين الأسابيع */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentWeek === 1) {
                    setCurrentWeek(52);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentWeek(currentWeek - 1);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <div className="font-semibold">
                  الأسبوع {currentWeek} - {currentYear}
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (currentWeek === 52) {
                    setCurrentWeek(1);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentWeek(currentWeek + 1);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* إحصائيات التوزيع */}
        {selectedProject && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">المهام الكلية</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {distributionStats.totalTasks}
                  </p>
                </div>
                <CheckSquare className="h-8 w-8 text-blue-300" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">تم التوزيع</p>
                  <p className="text-2xl font-bold text-green-600">
                    {distributionStats.assignedTasks}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-300" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">العمال المطلوبين</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {distributionStats.totalWorkersNeeded}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-300" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">العمال المكلفين</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {distributionStats.assignedWorkers}
                  </p>
                </div>
                <Award className="h-8 w-8 text-orange-300" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* أزرار الإجراءات */}
      {selectedProject && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={autoDistributeTasks}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <RefreshCw className="h-4 w-4" />
              توزيع تلقائي
            </button>
            
            <button
              onClick={saveDistributions}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              <Save className="h-4 w-4" />
              حفظ التوزيعات
            </button>
            
            <button
              onClick={sendToWorkers}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
            >
              <Send className="h-4 w-4" />
              إرسال للعمال
            </button>
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      {selectedProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* قائمة العمال */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow h-full">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg mb-3">العمال المتاحين</h3>
                
                {/* البحث والفلترة */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ابحث عن عامل..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 pl-8 border rounded-lg text-sm"
                    />
                    <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="all">جميع التخصصات</option>
                    <option value="بناء">بناء</option>
                    <option value="كهرباء">كهرباء</option>
                    <option value="سباكة">سباكة</option>
                    <option value="دهان">دهان</option>
                    <option value="تشطيبات">تشطيبات</option>
                    <option value="عام">عام</option>
                  </select>
                </div>
              </div>
              
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {filteredWorkers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>لا يوجد عمال متاحين</p>
                  </div>
                ) : (
                  filteredWorkers.map((worker, index) => (
                    <WorkerCard key={worker.id || index} worker={worker} />
                  ))
                )}
              </div>
              
              <div className="p-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  <Info className="h-4 w-4 inline ml-1" />
                  اسحب وأفلت العمال على المهام لتوزيعهم
                </div>
              </div>
            </div>
          </div>

          {/* جدول المهام */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">مهام الأسبوع</h3>
              </div>
              
              <div className="p-4">
                {weeklyTasks.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">لا توجد مهام لهذا الأسبوع</p>
                    <p className="text-sm mt-2">تواصل مع المقاول لإرسال المهام</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {weekDays.map((day, dayIndex) => {
                      const dayTasks = weeklyTasks.filter(task => 
                        task.dayIndex === dayIndex
                      );
                      
                      if (dayTasks.length === 0) return null;
                      
                      return (
                        <div key={dayIndex} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            {day}
                          </h4>
                          <div className="space-y-2">
                            {dayTasks.map((task, taskIndex) => {
                              const assignedWorkerIds = taskAssignments[task.id] || [];
                              const assignedWorkerObjects = assignedWorkerIds.map(id => 
                                availableWorkers.find(w => w.id === id)
                              ).filter(Boolean);
                              
                              return (
                                <TaskCard
                                  key={task.id || taskIndex}
                                  task={task}
                                  assignedWorkers={assignedWorkerObjects}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-16 text-center">
          <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">يرجى اختيار مشروع لعرض وتوزيع المهام</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDistributionView;