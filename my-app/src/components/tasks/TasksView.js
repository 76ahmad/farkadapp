import React, { useState } from 'react';
import { 
  CheckSquare, Square, Plus, Trash2, Clock, AlertCircle, 
  Calendar, Filter, Search, User, MapPin, Briefcase
} from 'lucide-react';

// استيراد المكونات المطلوبة
import SiteManagerTasksView from './SiteManagerTasksView';
import WeeklyTasksView from './WeeklyTasksView';

const TasksView = ({ currentUser, inventory = [], workers = [], tasks = [], projects = [], taskActions }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // حساب الإحصائيات
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
  };

  // فلترة المهام
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // تبديل حالة المهمة
  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && taskActions) {
      try {
        await taskActions.updateTask(taskId, { completed: !task.completed });
      } catch (error) {
        console.error('Error updating task:', error);
        alert('حدث خطأ أثناء تحديث المهمة');
      }
    }
  };

  // حذف مهمة
  const deleteTask = async (taskId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      try {
        await taskActions.deleteTask(taskId);
        alert('تم حذف المهمة بنجاح!');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('حدث خطأ أثناء حذف المهمة');
      }
    }
  };

  // دالة تحديد لون الأولوية
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // دالة تحديد حالة التأخير
  const isOverdue = (dueDate, completed) => {
    return !completed && new Date(dueDate) < new Date();
  };

  // مكون إضافة مهمة جديدة
  const AddTaskForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      projectId: projects[0]?.id || '',
      assignedTo: '',
    });

    // عند اختيار مشروع، ابحث عن مدير الموقع الخاص به
    const handleProjectChange = (e) => {
      const selectedProjectId = e.target.value;
      setFormData({ ...formData, projectId: selectedProjectId });
      // ابحث عن مدير الموقع الخاص بالمشروع
      const project = projects.find(p => p.id === selectedProjectId);
      if (project && project.siteManagerId) {
        setFormData(f => ({ ...f, assignedTo: project.siteManagerId }));
      } else {
        setFormData(f => ({ ...f, assignedTo: '' }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.title || !formData.dueDate || !formData.projectId) {
        alert('يرجى ملء العنوان وتاريخ الاستحقاق واختيار المشروع');
        return;
      }
      try {
        await taskActions.addTask({
          ...formData,
          completed: false,
          createdBy: currentUser?.displayName || 'مستخدم',
          createdById: currentUser?.id || '',
          createdAt: new Date().toISOString(),
        });
        setShowAddTask(false);
        alert('تم إضافة المهمة بنجاح!');
      } catch (error) {
        console.error('Error adding task:', error);
        alert('حدث خطأ أثناء إضافة المهمة');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">إضافة مهمة جديدة</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="عنوان المهمة *"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="وصف المهمة (اختياري)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded h-20"
              rows="3"
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="low">أولوية منخفضة</option>
              <option value="medium">أولوية متوسطة</option>
              <option value="high">أولوية عالية</option>
            </select>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            {/* اختيار المشروع */}
            <select
              value={formData.projectId}
              onChange={handleProjectChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">اختر المشروع</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            {/* تعيين مدير الموقع تلقائيًا */}
            <input
              type="text"
              value={formData.assignedTo ? workers.find(w => w.id === formData.assignedTo)?.name || '' : ''}
              placeholder="سيتم تعيين المهمة لمدير الموقع تلقائيًا"
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // إذا كان المقاول، اعرض واجهة المهام الأسبوعية
  if (currentUser?.type === 'contractor') {
    return (
      <WeeklyTasksView 
        currentUser={currentUser} 
        inventory={inventory}
        workers={workers}
        tasks={tasks}
        taskActions={taskActions}
        isContractor={true}
      />
    );
  }

  // إذا كان مدير موقع، اعرض واجهة مدير الموقع
  if (currentUser?.type === 'site_manager') {
    return (
      <SiteManagerTasksView 
        currentUser={currentUser} 
        inventory={inventory}
        workers={workers}
        tasks={tasks}
        taskActions={taskActions}
      />
    );
  }

  // إذا كان عامل، اعرض واجهة العامل المطورة
  if (currentUser?.type === 'worker') {
    // فلترة المهام المخصصة للعامل فقط
    const workerTasks = tasks.filter(task => task.assignedTo === 'worker');
    const workerFilteredTasks = workerTasks.filter(task => {
      const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && task.completed) ||
                           (filterStatus === 'pending' && !task.completed);
      
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    const workerStats = {
      total: workerTasks.length,
      completed: workerTasks.filter(t => t.completed).length,
      pending: workerTasks.filter(t => !t.completed).length,
      overdue: workerTasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
    };

    return (
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* رأس الصفحة */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">مهام العامل</h2>
              <p className="text-gray-600">مرحباً {currentUser?.displayName || currentUser?.name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {currentUser?.specialization || 'عامل'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  فيلا الأحمد
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* إحصائيات العامل */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">مهامي</h3>
                <p className="text-2xl font-bold">{workerStats.total}</p>
              </div>
              <CheckSquare className="h-8 w-8" />
            </div>
          </div>
          
          <div className="bg-green-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">مكتملة</h3>
                <p className="text-2xl font-bold">{workerStats.completed}</p>
              </div>
              <CheckSquare className="h-8 w-8" />
            </div>
          </div>
          
          <div className="bg-yellow-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">قيد التنفيذ</h3>
                <p className="text-2xl font-bold">{workerStats.pending}</p>
              </div>
              <Clock className="h-8 w-8" />
            </div>
          </div>
          
          <div className="bg-red-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">متأخرة</h3>
                <p className="text-2xl font-bold">{workerStats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* البحث والفلترة */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في مهامي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-8 border rounded"
              />
              <Search className="absolute right-2 top-3 h-4 w-4 text-gray-400" />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">كل المهام</option>
              <option value="completed">المكتملة</option>
              <option value="pending">قيد التنفيذ</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">كل الأولويات</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>
          </div>
        </div>

        {/* قائمة مهام العامل */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">مهامي المكلف بها ({workerFilteredTasks.length})</h3>
          </div>
          
          <div className="p-4 space-y-3">
            {workerFilteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد مهام مكلف بها حالياً</p>
              </div>
            ) : (
              workerFilteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 ${
                    task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                  } ${isOverdue(task.dueDate, task.completed) ? 'border-red-300 bg-red-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1"
                    >
                      {task.completed ? (
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}>
                          {task.title}
                        </h4>
                        {isOverdue(task.dueDate, task.completed) && (
                          <span className="text-red-600 font-medium text-sm bg-red-100 px-2 py-1 rounded">
                            متأخرة!
                          </span>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? 'عالية' : 
                           task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                        
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString('ar-EG')}
                        </span>
                        
                        <span className="text-gray-500">
                          من: {task.createdBy}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // للمقاول والمهندس والأنواع الأخرى - قائمة المهام العامة
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">قائمة المهام</h2>
        <p className="text-sm text-gray-500">
          مرحباً {currentUser?.displayName || currentUser?.name}
        </p>
      </div>
      
      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">إجمالي المهام</h3>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <CheckSquare className="h-8 w-8" />
          </div>
        </div>
        
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">مكتملة</h3>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <CheckSquare className="h-8 w-8" />
          </div>
        </div>
        
        <div className="bg-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">قيد التنفيذ</h3>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8" />
          </div>
        </div>
        
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">متأخرة</h3>
              <p className="text-2xl font-bold">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* البحث والفلترة */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في المهام..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border rounded"
            />
            <Search className="absolute right-2 top-3 h-4 w-4 text-gray-400" />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">كل المهام</option>
            <option value="completed">المكتملة</option>
            <option value="pending">قيد التنفيذ</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">كل الأولويات</option>
            <option value="high">عالية</option>
            <option value="medium">متوسطة</option>
            <option value="low">منخفضة</option>
          </select>
          
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            مهمة جديدة
          </button>
        </div>
      </div>

      {/* قائمة المهام */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">المهام ({filteredTasks.length})</h3>
        </div>
        
        <div className="p-4 space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد مهام</p>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`border rounded-lg p-4 ${
                  task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                } ${isOverdue(task.dueDate, task.completed) ? 'border-red-300' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-1"
                  >
                    {task.completed ? (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium ${
                        task.completed ? 'line-through text-gray-500' : ''
                      }`}>
                        {task.title}
                      </h4>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'عالية' : 
                         task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </span>
                      
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString('ar-EG')}
                      </span>
                      
                      <span className="text-gray-500">
                        {task.project}
                      </span>
                      
                      {isOverdue(task.dueDate, task.completed) && (
                        <span className="text-red-600 font-medium">متأخرة!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddTask && <AddTaskForm />}
    </div>
  );
};

export default TasksView;