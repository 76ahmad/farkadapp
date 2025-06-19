import React, { useState } from 'react';
import { Plus, FileText, CheckCircle, Clock, AlertCircle, Download, Upload, Eye } from 'lucide-react';

const ArchitectDashboard = ({ plans = [], plansActions }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // حساب الإحصائيات
  const stats = {
    totalPlans: plans.length,
    approved: plans.filter(p => p.status === 'معتمد').length,
    pending: plans.filter(p => p.status === 'قيد المراجعة').length,
    rejected: plans.filter(p => p.status === 'مرفوض').length
  };

  // مكون رفع مخطط جديد
  const UploadPlanForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      projectName: '',
      version: '1.0',
      description: '',
      fileUrl: '',
      status: 'قيد المراجعة'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        await plansActions.addPlan({
          ...formData,
          uploadDate: new Date().toISOString().split('T')[0],
          uploadedBy: 'المهندس المعماري'
        });
        
        setShowUploadForm(false);
        alert('تم رفع المخطط بنجاح!');
      } catch (error) {
        console.error('Error uploading plan:', error);
        alert('حدث خطأ أثناء رفع المخطط');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">رفع مخطط جديد</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              <label className="block text-sm font-medium mb-1">اسم المشروع *</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">رقم النسخة</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({...formData, version: e.target.value})}
                className="w-full p-2 border rounded-lg"
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
              <label className="block text-sm font-medium mb-1">رابط الملف</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="https://..."
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                رفع المخطط
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // مكون عرض تفاصيل المخطط
  const PlanDetails = ({ plan, onClose }) => {
    const handleStatusUpdate = async (newStatus) => {
      try {
        await plansActions.updatePlan(plan.id, { status: newStatus });
        alert('تم تحديث حالة المخطط بنجاح!');
        onClose();
      } catch (error) {
        console.error('Error updating plan status:', error);
        alert('حدث خطأ أثناء تحديث الحالة');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">المشروع</p>
                <p className="font-medium">{plan.projectName || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">النسخة</p>
                <p className="font-medium">{plan.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ الرفع</p>
                <p className="font-medium">{plan.uploadDate}</p>
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
                <p className="text-sm text-gray-500">الوصف</p>
                <p className="font-medium">{plan.description}</p>
              </div>
            )}
            
            {plan.fileUrl && (
              <div>
                <a 
                  href={plan.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Download className="h-4 w-4" />
                  تحميل المخطط
                </a>
              </div>
            )}
            
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleStatusUpdate('معتمد')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                اعتماد
              </button>
              <button
                onClick={() => handleStatusUpdate('مرفوض')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                رفض
              </button>
              <button
                onClick={() => handleStatusUpdate('قيد المراجعة')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                قيد المراجعة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">لوحة تحكم المهندس المعماري</h2>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload className="h-5 w-5" />
          رفع مخطط جديد
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">المخططات المرفوعة</h3>
              <p className="text-2xl font-bold">{stats.totalPlans}</p>
            </div>
            <FileText className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">معتمدة</h3>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">قيد المراجعة</h3>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">مرفوضة</h3>
              <p className="text-2xl font-bold">{stats.rejected}</p>
            </div>
            <AlertCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">المخططات</h3>
        </div>
        <div className="p-4">
          {plans.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد مخططات مرفوعة</p>
              <p className="text-sm text-gray-400">اضغط على "رفع مخطط جديد" للبدء</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map(plan => (
                <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{plan.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {plan.projectName || 'مشروع غير محدد'} • النسخة: {plan.version}
                      </p>
                      <p className="text-sm text-gray-500">
                        تاريخ الرفع: {plan.uploadDate}
                      </p>
                      {plan.description && (
                        <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        plan.status === 'معتمد' ? 'bg-green-100 text-green-700' :
                        plan.status === 'مرفوض' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {plan.status}
                      </span>
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
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

export default ArchitectDashboard;