import React, { useState } from 'react';
import { 
  Calendar, Plus, Clock, Users, Package, AlertCircle,
  ChevronDown, ChevronRight, Edit2, Trash2, CheckCircle,
  XCircle, Send, FileText, DollarSign, Flag
} from 'lucide-react';

const WeeklyTasksView = ({ currentUser, inventory = [], workers = [], isContractor = false }) => {
  // المهام الأسبوعية
  const [weeklyTasks, setWeeklyTasks] = useState([
    {
      id: 1,
      title: 'صب سقف الطابق الأول',
      description: 'صب السقف الخرساني للطابق الأول مع التسليح',
      startDate: '2024-06-17',
      endDate: '2024-06-23',
      priority: 'high',
      status: 'draft',
      budget: 15000,
      assignedManager: 'مدير الموقع - أحمد',
      managerId: 1,
      requiredMaterials: [
        { materialId: 1, name: 'حديد تسليح 12مم', quantity: 5, unit: 'طن', available: true },
        { materialId: 2, name: 'إسمنت', quantity: 50, unit: 'كيس', available: false }
      ],
      requiredWorkers: [
        { specialization: 'بناء', count: 5 },
        { specialization: 'حدادة', count: 3 }
      ],
      progress: 30,
      dailyTasks: [
        { id: 1, date: '2024-06-17', title: 'تجهيز القوالب', workers: [1, 2], completed: true },
        { id: 2, date: '2024-06-18', title: 'وضع حديد التسليح', workers: [3, 4], completed: false }
      ],
      requests: [
        {
          id: 1,
          type: 'extension',
          days: 2,
          reason: 'تأخر وصول الإسمنت',
          status: 'pending',
          date: '2024-06-19'
        }
      ],
      dailyReports: []
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // حساب الإحصائيات
  const stats = {
    total: weeklyTasks.length,
    draft: weeklyTasks.filter(t => t.status === 'draft').length,
    pending: weeklyTasks.filter(t => t.status === 'pending').length,
    active: weeklyTasks.filter(t => t.status === 'active').length,
    completed: weeklyTasks.filter(t => t.status === 'completed').length,
    delayed: weeklyTasks.filter(t => t.requests.some(r => r.type === 'extension' && r.status === 'approved')).length,
    totalBudget: weeklyTasks.reduce((sum, t) => sum + t.budget, 0)
  };

  // فلترة المهام
  const filteredTasks = weeklyTasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  // معالج الطلبات
  const handleRequest = (taskId, requestId, action) => {
    setWeeklyTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          requests: task.requests.map(req => 
            req.id === requestId ? { ...req, status: action } : req
          )
        };
      }
      return task;
    }));

    // إشعار مدير الموقع
    alert(`تم ${action === 'approved' ? 'الموافقة على' : 'رفض'} الطلب`);
  };

  // مكون إضافة مهمة أسبوعية
  const AddWeeklyTask = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      priority: 'medium',
      budget: '',
      assignedManager: '',
      requiredMaterials: [],
      requiredWorkers: []
    });

    const [newMaterial, setNewMaterial] = useState({ materialId: '', quantity: '' });
    const [newWorkerReq, setNewWorkerReq] = useState({ specialization: 'بناء', count: '' });

    const handleAddMaterial = () => {
      if (newMaterial.materialId && newMaterial.quantity) {
        const material = inventory.find(item => item.id === parseInt(newMaterial.materialId));
        setFormData(prev => ({
          ...prev,
          requiredMaterials: [...prev.requiredMaterials, {
            materialId: material.id,
            name: material.name,
            quantity: parseInt(newMaterial.quantity),
            unit: material.unit,
            available: material.currentStock >= parseInt(newMaterial.quantity)
          }]
        }));
        setNewMaterial({ materialId: '', quantity: '' });
      }
    };

    const handleAddWorkerReq = () => {
      if (newWorkerReq.count) {
        setFormData(prev => ({
          ...prev,
          requiredWorkers: [...prev.requiredWorkers, {
            specialization: newWorkerReq.specialization,
            count: parseInt(newWorkerReq.count)
          }]
        }));
        setNewWorkerReq({ specialization: 'بناء', count: '' });
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const newTask = {
        id: Date.now(),
        ...formData,
        budget: parseFloat(formData.budget),
        status: 'draft', // تبدأ كمسودة
        progress: 0,
        dailyTasks: [],
        requests: [],
        dailyReports: []
      };

      setWeeklyTasks(prev => [...prev, newTask]);
      setShowAddTask(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">إضافة مهمة أسبوعية جديدة</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* المعلومات الأساسية */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">المعلومات الأساسية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان المهمة *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الأولوية</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">الوصف التفصيلي</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ البداية *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ النهاية *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الميزانية التقديرية (د.أ)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">مدير الموقع المسؤول *</label>
                <select
                  value={formData.assignedManager}
                  onChange={(e) => setFormData({...formData, assignedManager: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">اختر مدير الموقع</option>
                  <option value="مدير الموقع - أحمد">مدير الموقع - أحمد</option>
                  <option value="مدير الموقع - محمد">مدير الموقع - محمد</option>
                </select>
              </div>
            </div>

            {/* المواد المطلوبة */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">المواد المطلوبة من المخزون</h4>
              
              <div className="flex gap-2">
                <select
                  value={newMaterial.materialId}
                  onChange={(e) => setNewMaterial({...newMaterial, materialId: e.target.value})}
                  className="flex-1 p-2 border rounded-lg"
                >
                  <option value="">اختر المادة</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (متوفر: {item.currentStock} {item.unit})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="الكمية"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
                  className="w-32 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إضافة
                </button>
              </div>

              {formData.requiredMaterials.length > 0 && (
                <div className="space-y-2">
                  {formData.requiredMaterials.map((mat, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{mat.name}</span>
                      <span className="font-medium">
                        {mat.quantity} {mat.unit}
                        <span className={`mr-2 text-sm ${mat.available ? 'text-green-600' : 'text-red-600'}`}>
                          ({mat.available ? 'متوفر' : 'غير متوفر'})
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* العمال المطلوبين */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">العمال المطلوبين</h4>
              
              <div className="flex gap-2">
                <select
                  value={newWorkerReq.specialization}
                  onChange={(e) => setNewWorkerReq({...newWorkerReq, specialization: e.target.value})}
                  className="flex-1 p-2 border rounded-lg"
                >
                  <option value="بناء">بناء</option>
                  <option value="كهرباء">كهرباء</option>
                  <option value="سباكة">سباكة</option>
                  <option value="حدادة">حدادة</option>
                  <option value="دهان">دهان</option>
                  <option value="بلاط">بلاط</option>
                </select>
                <input
                  type="number"
                  placeholder="العدد"
                  value={newWorkerReq.count}
                  onChange={(e) => setNewWorkerReq({...newWorkerReq, count: e.target.value})}
                  className="w-32 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddWorkerReq}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إضافة
                </button>
              </div>

              {formData.requiredWorkers.length > 0 && (
                <div className="space-y-2">
                  {formData.requiredWorkers.map((req, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{req.specialization}</span>
                      <span className="font-medium">{req.count} عمال</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* الأزرار */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إنشاء المهمة
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">المهام الأسبوعية - المقاول</h2>
        {isContractor && (
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            مهمة أسبوعية جديدة
          </button>
        )}
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">إجمالي المهام</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">مسودة</p>
              <p className="text-2xl font-bold">{stats.draft}</p>
            </div>
            <FileText className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">في الانتظار</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">نشطة</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">الميزانية</p>
              <p className="text-xl font-bold">{stats.totalBudget.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* فلترة */}
      <div className="bg-white rounded-lg shadow p-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-64 p-2 border rounded-lg"
        >
          <option value="all">جميع المهام</option>
          <option value="draft">مسودة</option>
          <option value="pending">في انتظار مدير الموقع</option>
          <option value="active">النشطة</option>
          <option value="completed">المكتملة</option>
          <option value="cancelled">الملغية</option>
        </select>
      </div>

      {/* قائمة المهام */}
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow">
            {/* رأس المهمة */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedTask === task.id ? <ChevronDown /> : <ChevronRight />}
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {task.title}
                      {task.priority === 'high' && <Flag className="h-4 w-4 text-red-500" />}
                      {task.priority === 'medium' && <Flag className="h-4 w-4 text-yellow-500" />}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {task.assignedManager} | {task.startDate} إلى {task.endDate} | 
                      الميزانية: {task.budget.toLocaleString()} د.أ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* شريط التقدم */}
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span>التقدم</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* الطلبات المعلقة */}
                  {task.requests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {task.requests.filter(r => r.status === 'pending').length} طلب معلق
                    </span>
                  )}

                  {/* الأزرار */}
                  <div className="flex gap-2">
                    {task.status === 'draft' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('هل تريد إرسال هذه المهمة لمدير الموقع؟')) {
                            setWeeklyTasks(prev => prev.map(t => 
                              t.id === task.id ? { ...t, status: 'pending' } : t
                            ));
                            alert('تم إرسال المهمة لمدير الموقع');
                          }
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <Send className="h-4 w-4" />
                        إرسال
                      </button>
                    )}
                    
                    {task.status === 'draft' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // يمكن إضافة وظيفة التعديل هنا
                          alert('ميزة التعديل قيد التطوير');
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        تعديل
                      </button>
                    )}
                  </div>

                  {/* الحالة */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'active' ? 'bg-green-100 text-green-800' :
                    task.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    task.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status === 'active' ? 'نشطة' : 
                     task.status === 'completed' ? 'مكتملة' : 
                     task.status === 'pending' ? 'في انتظار مدير الموقع' :
                     task.status === 'draft' ? 'مسودة' : 'ملغية'}
                  </span>
                </div>
              </div>
            </div>

            {/* تفاصيل المهمة */}
            {expandedTask === task.id && (
              <div className="border-t">
                <div className="p-4 space-y-4">
                  {/* الوصف */}
                  {task.description && (
                    <div>
                      <h4 className="font-semibold mb-2">الوصف</h4>
                      <p className="text-gray-600">{task.description}</p>
                    </div>
                  )}

                  {/* المواد والعمال */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* المواد المطلوبة */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        المواد المطلوبة
                      </h4>
                      <div className="space-y-2">
                        {task.requiredMaterials.map((mat, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span>{mat.name}</span>
                            <span className={`font-medium ${mat.available ? 'text-green-600' : 'text-red-600'}`}>
                              {mat.quantity} {mat.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* العمال المطلوبين */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        العمال المطلوبين
                      </h4>
                      <div className="space-y-2">
                        {task.requiredWorkers.map((req, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span>{req.specialization}</span>
                            <span className="font-medium">{req.count} عمال</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* الطلبات */}
                  {task.requests.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">الطلبات الخاصة</h4>
                      <div className="space-y-2">
                        {task.requests.map(request => (
                          <div key={request.id} className="bg-yellow-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {request.type === 'extension' ? 'طلب تمديد' : 
                                   request.type === 'workers' ? 'طلب عمال إضافيين' :
                                   'طلب مواد إضافية'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {request.type === 'extension' && `${request.days} أيام - ${request.reason}`}
                                </p>
                                <p className="text-xs text-gray-500">{request.date}</p>
                              </div>
                              
                              {request.status === 'pending' && isContractor && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleRequest(task.id, request.id, 'approved')}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                  >
                                    موافقة
                                  </button>
                                  <button
                                    onClick={() => handleRequest(task.id, request.id, 'rejected')}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                  >
                                    رفض
                                  </button>
                                </div>
                              )}
                              
                              {request.status === 'approved' && (
                                <span className="text-green-600 font-medium">موافق عليه</span>
                              )}
                              
                              {request.status === 'rejected' && (
                                <span className="text-red-600 font-medium">مرفوض</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الميزانية */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-semibold">الميزانية التقديرية</span>
                    <span className="text-lg font-bold">{task.budget.toLocaleString()} د.أ</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* نموذج إضافة مهمة */}
      {showAddTask && <AddWeeklyTask />}
    </div>
  );
};

export default WeeklyTasksView;