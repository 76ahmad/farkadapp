import React, { useState } from 'react';
import { 
  CheckSquare, Square, Plus, Trash2, Clock, AlertCircle, 
  Calendar, Filter, Search 
} from 'lucide-react';

// استيراد المكونات المطلوبة
import SiteManagerTasksView from './SiteManagerTasksView';
import WeeklyTasksView from './WeeklyTasksView';

const TasksView = ({ currentUser, inventory = [], workers = [] }) => {
  // نقل جميع الـ hooks إلى أعلى المكون - قبل أي شروط
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'طلب حديد تسليح للمشروع',
      description: 'طلب 5 طن حديد من المورد الرئيسي',
      priority: 'high',
      dueDate: '2024-06-20',
      completed: false,
      project: 'فيلا الأحمد',
      createdBy: 'المقاول',
      createdAt: '2024-06-15'
    },
    {
      id: 2,
      title: 'فحص جودة البلاط',
      description: 'التأكد من جودة البلاط قبل التركيب',
      priority: 'medium',
      dueDate: '2024-06-18',
      completed: true,
      project: 'فيلا الأحمد',
      createdBy: 'مدير الموقع',
      createdAt: '2024-06-14'
    }
  ]);

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
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);
    
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // تبديل حالة المهمة
  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // حذف مهمة
  const deleteTask = (taskId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
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
      project: 'فيلا الأحمد'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!formData.title || !formData.dueDate) {
        alert('يرجى ملء العنوان وتاريخ الاستحقاق');
        return;
      }

      const newTask = {
        id: Date.now(),
        ...formData,
        completed: false,
        createdBy: currentUser?.displayName || 'مستخدم',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setTasks(prev => [newTask, ...prev]);
      setShowAddTask(false);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        project: 'فيلا الأحمد'
      });
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
            
            <input
              type="text"
              placeholder="المشروع"
              value={formData.project}
              onChange={(e) => setFormData({...formData, project: e.target.value})}
              className="w-full p-2 border rounded"
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
      />
    );
  }

  // إذا كان عامل، اعرض واجهة بسيطة
  if (currentUser?.type === 'worker') {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">مهام العامل</h2>
          <p className="text-sm text-gray-500">
            مرحباً {currentUser?.displayName || currentUser?.name}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            واجهة العامل قيد التطوير
          </h3>
          <p className="text-gray-600 mb-4">
            هذه الواجهة ستتضمن المهام المكلف بها والجدول الزمني
          </p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 سيتم إضافة المزيد من الميزات قريباً
            </p>
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