import React, { useState } from 'react';
import { 
  Calendar, Users, Package, Clock, CheckCircle, 
  AlertCircle, ChevronDown, ChevronRight, Plus,
  ClipboardList, UserCheck, Send, Eye, Star
} from 'lucide-react';

const SiteManagerTasksView = ({ currentUser, inventory = [], workers = [] }) => {
  // المهام الأسبوعية المستلمة من المقاول
  const [weeklyTasks] = useState([
    {
      id: 1,
      title: 'صب سقف الطابق الأول',
      description: 'صب السقف الخرساني للطابق الأول مع التسليح',
      startDate: '2024-06-17',
      endDate: '2024-06-23',
      priority: 'high',
      status: 'active',
      budget: 15000,
      assignedBy: 'المقاول',
      requiredMaterials: [
        { materialId: 1, name: 'حديد تسليح 12مم', quantity: 5, unit: 'طن', available: true },
        { materialId: 2, name: 'إسمنت', quantity: 50, unit: 'كيس', available: false }
      ],
      requiredWorkers: [
        { specialization: 'بناء', count: 5 },
        { specialization: 'حدادة', count: 3 }
      ],
      progress: 30
    },
    {
      id: 2,
      title: 'تركيب البلاط - الطابق الأرضي',
      description: 'تركيب البلاط للصالات والغرف',
      startDate: '2024-06-20',
      endDate: '2024-06-26',
      priority: 'medium',
      status: 'pending',
      budget: 8000,
      assignedBy: 'المقاول',
      requiredMaterials: [
        { materialId: 3, name: 'بلاط سيراميك', quantity: 200, unit: 'متر مربع', available: true }
      ],
      requiredWorkers: [
        { specialization: 'بلاط', count: 4 }
      ],
      progress: 0
    }
  ]);

  // المهام اليومية التي قسمها مدير الموقع
  const [dailyTasks, setDailyTasks] = useState([
    {
      id: 1,
      weeklyTaskId: 1,
      date: '2024-06-17',
      title: 'تجهيز القوالب الخشبية',
      assignedWorkers: [1, 2, 3],
      status: 'completed',
      notes: 'تم الإنجاز بنجاح'
    },
    {
      id: 2,
      weeklyTaskId: 1,
      date: '2024-06-18',
      title: 'وضع حديد التسليح',
      assignedWorkers: [4, 5],
      status: 'in_progress',
      notes: ''
    }
  ]);

  const [expandedTask, setExpandedTask] = useState(null);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [selectedWeeklyTask, setSelectedWeeklyTask] = useState(null);

  // حساب الإحصائيات
  const stats = {
    totalWeeklyTasks: weeklyTasks.length,
    activeTasks: weeklyTasks.filter(t => t.status === 'active').length,
    pendingTasks: weeklyTasks.filter(t => t.status === 'pending').length,
    todayTasks: dailyTasks.filter(t => t.date === new Date().toISOString().split('T')[0]).length,
    assignedWorkers: new Set(dailyTasks.flatMap(t => t.assignedWorkers)).size
  };

  // مكون تقسيم المهمة على الأيام والعمال
  const AssignDailyTask = ({ weeklyTask, onClose }) => {
    const [formData, setFormData] = useState({
      date: '',
      title: '',
      selectedWorkers: [],
      notes: ''
    });

    // فلترة العمال المتاحين حسب التخصص المطلوب
    const availableWorkers = workers.filter(w => 
      w.status === 'active' && 
      weeklyTask.requiredWorkers.some(req => req.specialization === w.specialization)
    );

    // حساب العمال المطلوبين حسب التخصص
    const workersBySpecialization = {};
    weeklyTask.requiredWorkers.forEach(req => {
      workersBySpecialization[req.specialization] = {
        required: req.count,
        available: workers.filter(w => w.status === 'active' && w.specialization === req.specialization)
      };
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (formData.selectedWorkers.length === 0) {
        alert('يجب اختيار عامل واحد على الأقل');
        return;
      }

      const newDailyTask = {
        id: Date.now(),
        weeklyTaskId: weeklyTask.id,
        date: formData.date,
        title: formData.title,
        assignedWorkers: formData.selectedWorkers,
        status: 'pending',
        notes: formData.notes
      };

      setDailyTasks(prev => [...prev, newDailyTask]);
      alert(`تم تعيين المهمة بنجاح لـ ${formData.selectedWorkers.length} عامل`);
      onClose();
    };

    const toggleWorker = (workerId) => {
      setFormData(prev => ({
        ...prev,
        selectedWorkers: prev.selectedWorkers.includes(workerId)
          ? prev.selectedWorkers.filter(id => id !== workerId)
          : [...prev.selectedWorkers, workerId]
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">تقسيم المهمة: {weeklyTask.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              الفترة: {weeklyTask.startDate} إلى {weeklyTask.endDate}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">التاريخ *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                min={weeklyTask.startDate}
                max={weeklyTask.endDate}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">وصف المهمة اليومية *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="مثال: تجهيز القوالب للصب"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">اختر العمال *</label>
              
              {/* عرض العمال حسب التخصص */}
              {Object.entries(workersBySpecialization).map(([specialization, data]) => (
                <div key={specialization} className="mb-4">
                  <div className="bg-gray-50 p-2 rounded-t font-medium text-sm">
                    {specialization} - مطلوب: {data.required} عمال
                  </div>
                  <div className="border border-t-0 rounded-b p-3">
                    {data.available.length === 0 ? (
                      <p className="text-gray-500 text-sm">لا يوجد عمال متاحين في هذا التخصص</p>
                    ) : (
                      <div className="space-y-2">
                        {data.available.map(worker => (
                          <label key={worker.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={formData.selectedWorkers.includes(worker.id)}
                              onChange={() => toggleWorker(worker.id)}
                              className="rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{worker.name}</span>
                                {worker.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-xs text-gray-600">{worker.rating}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {worker.phone} | مشاريع: {worker.totalProjects || 0}
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">{worker.dailyRate}</span> د.أ/يوم
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* ملخص العمال المختارين */}
              {formData.selectedWorkers.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm font-medium text-blue-800">
                    تم اختيار {formData.selectedWorkers.length} عامل
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.selectedWorkers.map(workerId => {
                      const worker = workers.find(w => w.id === workerId);
                      return (
                        <span key={workerId} className="bg-white px-2 py-1 rounded text-xs">
                          {worker?.name} ({worker?.specialization})
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ملاحظات</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="أي تعليمات خاصة للعمال..."
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
                disabled={formData.selectedWorkers.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                تعيين المهمة
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // دالة لتحديث حالة المهمة اليومية
  const updateDailyTaskStatus = (taskId, newStatus) => {
    setDailyTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المهام - مدير الموقع</h2>
        <p className="text-sm text-gray-500">
          {currentUser?.displayName}
        </p>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">المهام الأسبوعية</p>
              <p className="text-2xl font-bold">{stats.totalWeeklyTasks}</p>
            </div>
            <Calendar className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">نشطة</p>
              <p className="text-2xl font-bold">{stats.activeTasks}</p>
            </div>
            <CheckCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">معلقة</p>
              <p className="text-2xl font-bold">{stats.pendingTasks}</p>
            </div>
            <Clock className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">مهام اليوم</p>
              <p className="text-2xl font-bold">{stats.todayTasks}</p>
            </div>
            <ClipboardList className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">عمال مكلفين</p>
              <p className="text-2xl font-bold">{stats.assignedWorkers}</p>
            </div>
            <Users className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* المهام الأسبوعية المستلمة من المقاول */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">المهام الأسبوعية المستلمة</h3>
        
        {weeklyTasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedTask === task.id ? <ChevronDown /> : <ChevronRight />}
                  <div>
                    <h4 className="font-semibold text-lg">{task.title}</h4>
                    <p className="text-sm text-gray-600">
                      من: {task.assignedBy} | {task.startDate} إلى {task.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">التقدم</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{task.progress}%</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWeeklyTask(task);
                      setShowAssignTask(true);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    تقسيم
                  </button>
                </div>
              </div>
            </div>

            {expandedTask === task.id && (
              <div className="border-t p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* المواد المطلوبة */}
                  <div>
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      المواد المطلوبة
                    </h5>
                    <div className="space-y-1">
                      {task.requiredMaterials.map((mat, index) => (
                        <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                          <span>{mat.name}</span>
                          <span className={mat.available ? 'text-green-600' : 'text-red-600'}>
                            {mat.quantity} {mat.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* العمال المطلوبين */}
                  <div>
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      العمال المطلوبين
                    </h5>
                    <div className="space-y-1">
                      {task.requiredWorkers.map((req, index) => (
                        <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                          <span>{req.specialization}</span>
                          <span>{req.count} عمال</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* المهام اليومية المقسمة */}
                <div>
                  <h5 className="font-semibold mb-2">المهام اليومية المقسمة</h5>
                  <div className="space-y-2">
                    {dailyTasks
                      .filter(dt => dt.weeklyTaskId === task.id)
                      .map(dailyTask => {
                        const assignedWorkersDetails = dailyTask.assignedWorkers.map(wId => 
                          workers.find(w => w.id === wId)
                        ).filter(Boolean);

                        return (
                          <div key={dailyTask.id} className="border rounded p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">{dailyTask.title}</p>
                                <p className="text-sm text-gray-600">
                                  التاريخ: {dailyTask.date}
                                </p>
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">العمال المكلفين:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {assignedWorkersDetails.map(worker => (
                                      <span key={worker.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                        {worker.name} ({worker.specialization})
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {dailyTask.notes && (
                                  <p className="text-xs text-gray-500 mt-2">{dailyTask.notes}</p>
                                )}
                              </div>
                              <div className="flex flex-col gap-2 items-end">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  dailyTask.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  dailyTask.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {dailyTask.status === 'completed' ? 'مكتملة' :
                                   dailyTask.status === 'in_progress' ? 'قيد التنفيذ' : 'معلقة'}
                                </span>
                                
                                {dailyTask.status !== 'completed' && (
                                  <select
                                    value={dailyTask.status}
                                    onChange={(e) => updateDailyTaskStatus(dailyTask.id, e.target.value)}
                                    className="text-xs border rounded px-2 py-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="pending">معلقة</option>
                                    <option value="in_progress">قيد التنفيذ</option>
                                    <option value="completed">مكتملة</option>
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* نموذج تقسيم المهام */}
      {showAssignTask && selectedWeeklyTask && (
        <AssignDailyTask 
          weeklyTask={selectedWeeklyTask}
          onClose={() => {
            setShowAssignTask(false);
            setSelectedWeeklyTask(null);
          }}
        />
      )}
    </div>
  );
};

export default SiteManagerTasksView;