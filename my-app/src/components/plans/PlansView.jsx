import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Upload, Edit, Trash2, Plus, 
  Search, Filter, Eye, Calendar, User, Tag
} from 'lucide-react';

const PlansView = ({ currentUser, plans = [], planActions }) => {
  const [filteredPlans, setFilteredPlans] = useState(plans);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    version: '',
    projectId: '',
    architect: '',
    uploadDate: '',
    status: 'active'
  });

  useEffect(() => {
    let filtered = plans;
    
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.architect.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(plan => plan.category === categoryFilter);
    }
    
    setFilteredPlans(filtered);
  }, [plans, searchTerm, categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        ...formData,
        uploadDate: formData.uploadDate || new Date().toISOString().split('T')[0],
        fileUrl: selectedFile ? await uploadFile(selectedFile) : editingPlan?.fileUrl
      };

      if (editingPlan) {
        await planActions.updatePlan(editingPlan.id, planData);
        setEditingPlan(null);
      } else {
        await planActions.addPlan(planData);
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      category: plan.category,
      version: plan.version,
      projectId: plan.projectId || '',
      architect: plan.architect,
      uploadDate: plan.uploadDate,
      status: plan.status
    });
    setShowAddModal(true);
  };

  const handleDelete = async (planId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المخطط؟')) {
      try {
        await planActions.deletePlan(planId);
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const uploadFile = async (file) => {
    // This would typically upload to Firebase Storage
    // For now, we'll simulate the upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/plans/${file.name}`);
      }, 1000);
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      version: '',
      projectId: '',
      architect: '',
      uploadDate: '',
      status: 'active'
    });
    setSelectedFile(null);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'structural':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'electrical':
        return <FileText className="h-5 w-5 text-yellow-600" />;
      case 'plumbing':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'architectural':
        return <FileText className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'structural': return 'إنشائي';
      case 'electrical': return 'كهربائي';
      case 'plumbing': return 'سباكة';
      case 'architectural': return 'معماري';
      default: return 'أخرى';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'draft': return 'مسودة';
      case 'archived': return 'مؤرشف';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة المخططات</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          إضافة مخطط جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في المخططات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع الفئات</option>
            <option value="architectural">معماري</option>
            <option value="structural">إنشائي</option>
            <option value="electrical">كهربائي</option>
            <option value="plumbing">سباكة</option>
          </select>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {getCategoryIcon(plan.category)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(plan.fileUrl, '_blank')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="عرض المخطط"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(plan)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="تعديل"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="h-4 w-4" />
                <span className="text-sm">{getCategoryText(plan.category)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm">{plan.architect}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(plan.uploadDate).toLocaleDateString('ar-SA')}
                </span>
              </div>
              
              {plan.version && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">الإصدار: {plan.version}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                plan.status === 'active' ? 'bg-green-100 text-green-800' :
                plan.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(plan.status)}
              </span>
              
              <button
                onClick={() => window.open(plan.fileUrl, '_blank')}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Download className="h-4 w-4" />
                تحميل
              </button>
            </div>
          </div>
        ))}
        
        {filteredPlans.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد مخططات</h3>
            <p className="text-gray-500">قم بإضافة مخطط جديد للبدء</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingPlan ? 'تعديل المخطط' : 'إضافة مخطط جديد'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان المخطط
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الفئة
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر الفئة</option>
                    <option value="architectural">معماري</option>
                    <option value="structural">إنشائي</option>
                    <option value="electrical">كهربائي</option>
                    <option value="plumbing">سباكة</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المعماري
                  </label>
                  <input
                    type="text"
                    value={formData.architect}
                    onChange={(e) => setFormData({...formData, architect: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الإصدار
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 1.0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملف المخطط
                </label>
                <input
                  type="file"
                  accept=".pdf,.dwg,.dxf,.jpg,.png"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!editingPlan}
                />
                <p className="text-xs text-gray-500 mt-1">
                  الصيغ المدعومة: PDF, DWG, DXF, JPG, PNG
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ الرفع
                  </label>
                  <input
                    type="date"
                    value={formData.uploadDate}
                    onChange={(e) => setFormData({...formData, uploadDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الحالة
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">نشط</option>
                    <option value="draft">مسودة</option>
                    <option value="archived">مؤرشف</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPlan(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPlan ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansView;