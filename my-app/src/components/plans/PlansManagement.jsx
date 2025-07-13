import React, { useState, useEffect } from 'react';
import { 
  Upload, Download, Eye, Edit2, Trash2, Plus, 
  FileText, CheckCircle, XCircle, Clock, AlertCircle,
  History, Users, Calendar, Filter, Search, RefreshCw,
  FileImage, FilePdf, FileArchive, Star, Lock, Unlock
} from 'lucide-react';

const PlansManagement = ({ 
  currentUser, 
  plans = [], 
  projects = [],
  plansActions 
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  // تصفية المخططات
  const filteredPlans = plans.filter(plan => {
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // حساب الإحصائيات
  const stats = {
    total: plans.length,
    approved: plans.filter(p => p.status === 'معتمد').length,
    pending: plans.filter(p => p.status === 'قيد المراجعة').length,
    rejected: plans.filter(p => p.status === 'مرفوض').length,
    modified: plans.filter(p => p.modifications && p.modifications.length > 0).length
  };

  // مكون رفع مخطط جديد
  const UploadPlanForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      projectId: '',
      version: '1.0',
      description: '',
      category: 'مخطط معماري',
      priority: 'medium',
      file: null,
      fileUrl: '',
      isPublic: false
    });

    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFormData({...formData, file: e.dataTransfer.files[0]});
      }
    };

    const handleFileSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
        setFormData({...formData, file: e.target.files[0]});
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setUploading(true);
      
      try {
        const planData = {
          ...formData,
          uploadDate: new Date().toISOString(),
          uploadedBy: currentUser?.displayName || currentUser?.email,
          status: 'قيد المراجعة',
          modifications: [],
          version: formData.version,
          category: formData.category,
          priority: formData.priority,
          isPublic: formData.isPublic
        };

        if (formData.file) {
          // هنا يمكن إضافة رفع الملف إلى Firebase Storage
          planData.fileName = formData.file.name;
          planData.fileSize = formData.file.size;
          planData.fileType = formData.file.type;
        }

        await plansActions.addPlan(planData);
        setShowUploadForm(false);
        alert('تم رفع المخطط بنجاح!');
      } catch (error) {
        console.error('Error uploading plan:', error);
        alert('حدث خطأ أثناء رفع المخطط');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">رفع مخطط جديد</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المخطط *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">المشروع *</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">اختر المشروع</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">النسخة</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({...formData, version: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">النوع</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="مخطط معماري">مخطط معماري</option>
                  <option value="مخطط إنشائي">مخطط إنشائي</option>
                  <option value="مخطط كهربائي">مخطط كهربائي</option>
                  <option value="مخطط ميكانيكي">مخطط ميكانيكي</option>
                  <option value="مخطط تفصيلي">مخطط تفصيلي</option>
                </select>
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
                  <option value="urgent">عاجلة</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="وصف المخطط والتفاصيل المهمة..."
              />
            </div>

            {/* منطقة رفع الملف */}
            <div>
              <label className="block text-sm font-medium mb-1">ملف المخطط</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formData.file ? (
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 text-green-500 mx-auto" />
                    <p className="font-medium">{formData.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, file: null})}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      إزالة الملف
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-gray-600">اسحب الملف هنا أو انقر للاختيار</p>
                    <p className="text-sm text-gray-500">PDF, DWG, JPG, PNG (الحد الأقصى 10MB)</p>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.dwg,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-700"
                    >
                      اختيار ملف
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="isPublic" className="text-sm">
                متاح للجميع (غير محمي بكلمة مرور)
              </label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                disabled={uploading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={uploading || !formData.name || !formData.projectId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'جاري الرفع...' : 'رفع المخطط'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // مكون عرض تفاصيل المخطط
  const PlanDetails = ({ plan, onClose }) => {
    const [showModificationForm, setShowModificationForm] = useState(false);

    const handleStatusUpdate = async (newStatus) => {
      try {
        await plansActions.updatePlan(plan.id, { 
          status: newStatus,
          lastModified: new Date().toISOString(),
          modifiedBy: currentUser?.displayName || currentUser?.email
        });
        alert('تم تحديث حالة المخطط بنجاح!');
        onClose();
      } catch (error) {
        console.error('Error updating plan status:', error);
        alert('حدث خطأ أثناء تحديث الحالة');
      }
    };

    const handleAddModification = async (modificationData) => {
      try {
        const modifications = plan.modifications || [];
        modifications.push({
          ...modificationData,
          date: new Date().toISOString(),
          modifiedBy: currentUser?.displayName || currentUser?.email
        });

        await plansActions.updatePlan(plan.id, { 
          modifications,
          lastModified: new Date().toISOString()
        });
        
        setShowModificationForm(false);
        alert('تم إضافة التعديل بنجاح!');
      } catch (error) {
        console.error('Error adding modification:', error);
        alert('حدث خطأ أثناء إضافة التعديل');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-sm text-gray-500">نسخة {plan.version}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">المشروع</p>
                <p className="font-medium">{plan.projectName || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">النوع</p>
                <p className="font-medium">{plan.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ الرفع</p>
                <p className="font-medium">{new Date(plan.uploadDate).toLocaleDateString('ar-SA')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">الحالة</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  plan.status === 'معتمد' ? 'bg-green-100 text-green-700' :
                  plan.status === 'مرفوض' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {plan.status}
                </span>
              </div>
            </div>
            
            {plan.description && (
              <div>
                <p className="text-sm text-gray-500 mb-2">الوصف</p>
                <p className="font-medium bg-gray-50 p-3 rounded-lg">{plan.description}</p>
              </div>
            )}

            {/* معلومات الملف */}
            {plan.fileName && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">{plan.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {(plan.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* التعديلات */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">التعديلات</h4>
                <button
                  onClick={() => setShowModificationForm(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  إضافة تعديل
                </button>
              </div>
              
              {plan.modifications && plan.modifications.length > 0 ? (
                <div className="space-y-3">
                  {plan.modifications.map((mod, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{mod.title}</p>
                          <p className="text-sm text-gray-500">{mod.description}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(mod.date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        {mod.modifiedBy}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد تعديلات</p>
              )}
            </div>
            
            {/* أزرار التحكم */}
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleStatusUpdate('معتمد')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                اعتماد
              </button>
              <button
                onClick={() => handleStatusUpdate('مرفوض')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                رفض
              </button>
              <button
                onClick={() => handleStatusUpdate('قيد المراجعة')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                إعادة للمراجعة
              </button>
            </div>
          </div>

          {/* نموذج إضافة تعديل */}
          {showModificationForm && (
            <ModificationForm 
              onSubmit={handleAddModification}
              onClose={() => setShowModificationForm(false)}
            />
          )}
        </div>
      </div>
    );
  };

  // مكون إضافة تعديل
  const ModificationForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      type: 'تعديل بسيط',
      priority: 'medium'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">إضافة تعديل</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان التعديل *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">نوع التعديل</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="تعديل بسيط">تعديل بسيط</option>
                <option value="تعديل كبير">تعديل كبير</option>
                <option value="إضافة">إضافة</option>
                <option value="حذف">حذف</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">الوصف *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
                required
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
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
                إضافة التعديل
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة المخططات</h2>
          <p className="text-gray-600">رفع وإدارة مخططات المشاريع</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          رفع مخطط جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المخططات</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">معتمدة</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">قيد المراجعة</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">معدلة</p>
              <p className="text-2xl font-bold text-purple-600">{stats.modified}</p>
            </div>
            <History className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في المخططات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="معتمد">معتمدة</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="مرفوض">مرفوضة</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">المخططات ({filteredPlans.length})</h3>
        </div>
        
        <div className="divide-y">
          {filteredPlans.map(plan => (
            <div key={plan.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{plan.name}</h4>
                    <p className="text-sm text-gray-500">
                      {plan.projectName} • {plan.category} • نسخة {plan.version}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        plan.status === 'معتمد' ? 'bg-green-100 text-green-700' :
                        plan.status === 'مرفوض' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {plan.status}
                      </span>
                      {plan.modifications && plan.modifications.length > 0 && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {plan.modifications.length} تعديل
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {plan.fileName && (
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPlans.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد مخططات</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUploadForm && <UploadPlanForm />}
      {selectedPlan && (
        <PlanDetails 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
        />
      )}
    </div>
  );
};

export default PlansManagement;