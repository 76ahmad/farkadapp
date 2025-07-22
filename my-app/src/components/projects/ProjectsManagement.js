import React, { useState, useEffect } from 'react';
import { 
  Building, Plus, Calendar, Users, DollarSign, 
  MapPin, Clock, Edit2, Trash2, Eye, AlertCircle,
  CheckCircle, XCircle, TrendingUp, FileText
} from 'lucide-react';
import { projectsService } from '../../services/firebaseService';

const ProjectsManagement = ({ currentUser }) => {
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // الاشتراك في المشاريع من Firebase
  useEffect(() => {
    setLoading(true);
    const unsubscribe = projectsService.subscribeToProjects(
      (data) => {
        // معالجة أولية: ضمان وجود client وsiteManager وinspector وarchitect ككائنات
        const safeData = data.map(project => ({
          ...project,
          client: project.client && typeof project.client === 'object' ? project.client : { name: 'غير محدد', phone: '' },
          siteManager: project.siteManager && typeof project.siteManager === 'object' ? project.siteManager : { name: 'غير محدد' },
          inspector: project.inspector && typeof project.inspector === 'object' ? project.inspector : { name: 'غير محدد' },
          architect: project.architect && typeof project.architect === 'object' ? project.architect : { name: 'غير محدد' },
        }));
        setProjects(safeData);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        alert('حدث خطأ أثناء تحميل المشاريع: ' + error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  // دالة تعديل المشروع
  const updateProject = async (projectId, updatedData) => {
    try {
      await projectsService.updateProject(projectId, updatedData);
    } catch (error) {
      alert('حدث خطأ أثناء تحديث المشروع: ' + error.message);
    }
  };

  // دالة حذف المشروع
  const deleteProject = async (projectId) => {
    if (!window.confirm('هل أنت متأكد من حذف المشروع؟')) return;
    try {
      await projectsService.deleteProject(projectId);
      alert('تم حذف المشروع بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء حذف المشروع: ' + error.message);
    }
  };

  // حساب الإحصائيات
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    delayedProjects: projects.filter(p => {
      if (p.status === 'completed') return false;
      const expectedDate = new Date(p.expectedEndDate);
      return expectedDate < new Date();
    }).length
  };

  // فلترة المشاريع
  const filteredProjects = projects.filter(project => {
    if (filterStatus === 'all') return true;
    return project.status === filterStatus;
  });

  // مكون تعديل المشروع
  const EditProjectForm = ({ project, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      name: project.name,
      description: project.description,
      location: project.location,
      expectedEndDate: project.expectedEndDate,
      budget: project.budget,
      status: project.status,
      progress: project.progress
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">تعديل المشروع: {project.name}</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المشروع</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الموقع</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">تاريخ التسليم المتوقع</label>
              <input
                type="date"
                value={formData.expectedEndDate}
                onChange={(e) => setFormData({...formData, expectedEndDate: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الميزانية</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الحالة</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="active">نشط</option>
                <option value="completed">مكتمل</option>
                <option value="paused">متوقف</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">نسبة الإنجاز (%)</label>
              <input
                type="number"
                value={formData.progress}
                onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
                min="0"
                max="100"
                required
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
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // مكون إضافة مشروع جديد
  const AddProjectForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      location: '',
      startDate: '',
      expectedEndDate: '',
      budget: '',
      client: { name: '', phone: '' },
      siteManager: '',
      inspector: '',
      architect: ''
    });

    // قائمة وهمية للموظفين (في الواقع ستأتي من قاعدة البيانات)
    const availableManagers = [
      { id: 1, name: 'أحمد محمد' },
      { id: 2, name: 'محمد علي' },
      { id: 3, name: 'عبدالرحمن سالم' }
    ];

    const availableInspectors = [
      { id: 1, name: 'خالد السالم' },
      { id: 2, name: 'سامي العمري' },
      { id: 3, name: 'ناصر القحطاني' }
    ];

    const availableArchitects = [
      { id: 1, name: 'سارة أحمد' },
      { id: 2, name: 'فاطمة سالم' },
      { id: 3, name: 'مريم الشمري' }
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const newProject = {
        ...formData,
        budget: parseFloat(formData.budget),
        spent: 0,
        progress: 0,
        status: 'active',
        actualEndDate: null,
        siteManager: availableManagers.find(m => m.id === parseInt(formData.siteManager)),
        inspector: availableInspectors.find(i => i.id === parseInt(formData.inspector)),
        architect: availableArchitects.find(a => a.id === parseInt(formData.architect)),
        phases: [
          { id: 1, name: 'الأساسات', progress: 0, status: 'pending' },
          { id: 2, name: 'الهيكل', progress: 0, status: 'pending' },
          { id: 3, name: 'التشطيبات', progress: 0, status: 'pending' },
          { id: 4, name: 'التسليم', progress: 0, status: 'pending' }
        ]
      };

      try {
        await projectsService.addProject(newProject);
        setShowAddProject(false);
        alert('تم إضافة المشروع بنجاح!');
      } catch (error) {
        alert('حدث خطأ أثناء إضافة المشروع: ' + error.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">إضافة مشروع جديد</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* معلومات المشروع الأساسية */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">معلومات المشروع</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم المشروع *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الموقع *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="المدينة - الحي"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">وصف المشروع</label>
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
                  <label className="block text-sm font-medium mb-1">تاريخ التسليم المتوقع *</label>
                  <input
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={(e) => setFormData({...formData, expectedEndDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الميزانية الكلية (ريال) *</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* معلومات العميل */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">معلومات العميل</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم العميل *</label>
                  <input
                    type="text"
                    value={formData.client.name}
                    onChange={(e) => setFormData({...formData, client: {...formData.client, name: e.target.value}})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    value={formData.client.phone}
                    onChange={(e) => setFormData({...formData, client: {...formData.client, phone: e.target.value}})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="05xxxxxxxx"
                    required
                  />
                </div>
              </div>
            </div>

            {/* تعيين الفريق */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">تعيين فريق العمل</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">مدير الموقع *</label>
                  <select
                    value={formData.siteManager}
                    onChange={(e) => setFormData({...formData, siteManager: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">اختر مدير الموقع</option>
                    {availableManagers.map(manager => (
                      <option key={manager.id} value={manager.id}>{manager.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المفتش *</label>
                  <select
                    value={formData.inspector}
                    onChange={(e) => setFormData({...formData, inspector: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">اختر المفتش</option>
                    {availableInspectors.map(inspector => (
                      <option key={inspector.id} value={inspector.id}>{inspector.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المهندس المعماري *</label>
                  <select
                    value={formData.architect}
                    onChange={(e) => setFormData({...formData, architect: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">اختر المهندس</option>
                    {availableArchitects.map(architect => (
                      <option key={architect.id} value={architect.id}>{architect.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة المشروع
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // مكون عرض تفاصيل المشروع
  const ProjectDetails = ({ project, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold">{project.name}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">الوصف</p>
                  <p className="font-medium">{project.description || 'لا يوجد وصف'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الموقع</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">العميل</p>
                  <p className="font-medium">{project.client?.name || 'غير محدد'}</p>
                  <p className="text-sm text-gray-600">{project.client?.phone || ''}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">المدة</p>
                  <p className="font-medium">
                    {project.startDate} إلى {project.expectedEndDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الحالة</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'active' ? 'نشط' : 
                     project.status === 'completed' ? 'مكتمل' : 'متوقف'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">التقدم العام</p>
                  <div className="mt-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>التقدم</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* الفريق */}
            <div>
              <h4 className="font-semibold mb-3">فريق العمل</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">مدير الموقع</p>
                  <p className="font-medium">{project.siteManager?.name || 'غير محدد'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">المفتش</p>
                  <p className="font-medium">{project.inspector?.name || 'غير محدد'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">المهندس المعماري</p>
                  <p className="font-medium">{project.architect?.name || 'غير محدد'}</p>
                </div>
              </div>
            </div>

            {/* المراحل */}
            <div>
              <h4 className="font-semibold mb-3">مراحل المشروع</h4>
              <div className="space-y-2">
                {project.phases.map(phase => (
                  <div key={phase.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{phase.name}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                          phase.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {phase.status === 'completed' ? 'مكتملة' :
                           phase.status === 'active' ? 'قيد التنفيذ' : 'لم تبدأ'}
                        </span>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>التقدم</span>
                          <span>{phase.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* المعلومات المالية */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                المعلومات المالية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">الميزانية الكلية</p>
                  <p className="text-xl font-bold">{project.budget.toLocaleString()} ريال</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">المصروف حتى الآن</p>
                  <p className="text-xl font-bold text-red-600">{project.spent.toLocaleString()} ريال</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">المتبقي</p>
                  <p className="text-xl font-bold text-green-600">
                    {(project.budget - project.spent).toLocaleString()} ريال
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>نسبة الصرف</span>
                  <span>{Math.round((project.spent / project.budget) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(project.spent / project.budget) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المشاريع</h2>
        <button
          onClick={() => setShowAddProject(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          مشروع جديد
        </button>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">إجمالي المشاريع</p>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
            </div>
            <Building className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">نشطة</p>
              <p className="text-2xl font-bold">{stats.activeProjects}</p>
            </div>
            <Clock className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">مكتملة</p>
              <p className="text-2xl font-bold">{stats.completedProjects}</p>
            </div>
            <CheckCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">متأخرة</p>
              <p className="text-2xl font-bold">{stats.delayedProjects}</p>
            </div>
            <AlertCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">الميزانية الكلية</p>
              <p className="text-xl font-bold">{(stats.totalBudget / 1000000).toFixed(1)}M</p>
            </div>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">المصروف</p>
              <p className="text-xl font-bold">{(stats.totalSpent / 1000000).toFixed(1)}M</p>
            </div>
            <TrendingUp className="h-8 w-8 opacity-80" />
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
          <option value="all">جميع المشاريع</option>
          <option value="active">النشطة</option>
          <option value="completed">المكتملة</option>
          <option value="paused">المتوقفة</option>
        </select>
      </div>

      {/* قائمة المشاريع */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map(project => {
          const isDelayed = project.status !== 'completed' && new Date(project.expectedEndDate) < new Date();
          
          return (
            <div key={project.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'active' ? 'نشط' : 
                     project.status === 'completed' ? 'مكتمل' : 'متوقف'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">العميل</span>
                    <span className="font-medium">{project.client?.name || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">مدير الموقع</span>
                    <span className="font-medium">{project.siteManager?.name || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">التاريخ المتوقع</span>
                    <span className={`font-medium ${isDelayed ? 'text-red-600' : ''}`}>
                      {project.expectedEndDate}
                      {isDelayed && ' (متأخر)'}
                    </span>
                  </div>
                </div>

                {/* شريط التقدم */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>التقدم</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* المعلومات المالية */}
                <div className="bg-gray-50 p-3 rounded mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">الميزانية</span>
                    <span className="font-medium">{project.budget.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المصروف</span>
                    <span className="font-medium text-red-600">{project.spent.toLocaleString()} ريال</span>
                  </div>
                </div>

                {/* الأزرار */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    عرض التفاصيل
                  </button>
                  <button
                    onClick={() => setEditingProject(project)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* نموذج إضافة مشروع */}
      {showAddProject && <AddProjectForm />}

      {/* نموذج تعديل المشروع */}
      {editingProject && (
        <EditProjectForm 
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdate={(updatedData) => {
            updateProject(editingProject.id, updatedData);
            setEditingProject(null);
            alert('تم تحديث المشروع بنجاح!');
          }}
        />
      )}

      {/* عرض تفاصيل المشروع */}
      {selectedProject && (
        <ProjectDetails 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};

export default ProjectsManagement;