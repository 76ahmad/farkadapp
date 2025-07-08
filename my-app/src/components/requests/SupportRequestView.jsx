import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Clock, Calendar, Send, Plus, 
  AlertTriangle, CheckCircle, XCircle, Eye,
  FileText, User, Building, MessageSquare,
  Filter, Search, Download, Upload, Edit2,
  Trash2, RefreshCw, Bell, Star, Flag
} from 'lucide-react';

const SupportRequestView = ({ 
  currentUser, 
  projects = [], 
  supportRequestActions 
}) => {
  const [requests, setRequests] = useState([]);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // تحميل الطلبات
  useEffect(() => {
    if (supportRequestActions) {
      loadRequests();
    }
  }, [supportRequestActions]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await supportRequestActions.getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
    setIsLoading(false);
  };

  // فلترة الطلبات
  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.type === filterType;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  // مكون إضافة طلب جديد
  const AddRequestModal = ({ onClose, onAdd }) => {
    const [requestData, setRequestData] = useState({
      type: 'support',
      title: '',
      description: '',
      priority: 'medium',
      projectId: '',
      category: 'material',
      expectedDate: '',
      budget: '',
      attachments: []
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const newRequest = {
        ...requestData,
        requestedBy: currentUser?.uid,
        requestedByName: currentUser?.displayName,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        await onAdd(newRequest);
        onClose();
        await loadRequests();
      } catch (error) {
        console.error('Error adding request:', error);
        alert('حدث خطأ في إضافة الطلب');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">إضافة طلب جديد</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">نوع الطلب *</label>
                <select
                  value={requestData.type}
                  onChange={(e) => setRequestData({...requestData, type: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="support">طلب دعم</option>
                  <option value="extension">طلب تمديد</option>
                  <option value="material">طلب مواد</option>
                  <option value="equipment">طلب معدات</option>
                  <option value="worker">طلب عمالة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المشروع *</label>
                <select
                  value={requestData.projectId}
                  onChange={(e) => setRequestData({...requestData, projectId: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">اختر المشروع</option>
                  {projects.filter(p => p.status === 'active').map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">عنوان الطلب *</label>
              <input
                type="text"
                value={requestData.title}
                onChange={(e) => setRequestData({...requestData, title: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="مثال: طلب دعم مادي لشراء إسمنت إضافي"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">وصف الطلب *</label>
              <textarea
                value={requestData.description}
                onChange={(e) => setRequestData({...requestData, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="4"
                placeholder="اشرح تفاصيل الطلب والأسباب..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">الأولوية</label>
                <select
                  value={requestData.priority}
                  onChange={(e) => setRequestData({...requestData, priority: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">عاجلة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">التاريخ المطلوب</label>
                <input
                  type="date"
                  value={requestData.expectedDate}
                  onChange={(e) => setRequestData({...requestData, expectedDate: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {requestData.type !== 'extension' && (
              <div>
                <label className="block text-sm font-medium mb-1">الميزانية المقدرة (ريال)</label>
                <input
                  type="number"
                  value={requestData.budget}
                  onChange={(e) => setRequestData({...requestData, budget: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                />
              </div>
            )}

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
                إرسال الطلب
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // مكون عرض تفاصيل الطلب
  const RequestDetailsModal = ({ request, onClose, onUpdate }) => {
    const [response, setResponse] = useState('');
    const [newStatus, setNewStatus] = useState(request.status);

    const handleUpdateStatus = async () => {
      try {
        await onUpdate(request.id, {
          status: newStatus,
          response: response,
          respondedBy: currentUser?.uid,
          respondedByName: currentUser?.displayName,
          respondedAt: new Date().toISOString()
        });
        onClose();
        await loadRequests();
      } catch (error) {
        console.error('Error updating request:', error);
        alert('حدث خطأ في تحديث الطلب');
      }
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'approved': return 'bg-green-100 text-green-700';
        case 'rejected': return 'bg-red-100 text-red-700';
        case 'in-progress': return 'bg-blue-100 text-blue-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const getTypeIcon = (type) => {
      switch(type) {
        case 'support': return <HelpCircle className="h-5 w-5" />;
        case 'extension': return <Clock className="h-5 w-5" />;
        case 'material': return <FileText className="h-5 w-5" />;
        case 'equipment': return <Building className="h-5 w-5" />;
        case 'worker': return <User className="h-5 w-5" />;
        default: return <MessageSquare className="h-5 w-5" />;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {getTypeIcon(request.type)}
                  {request.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  طلب رقم: {request.id} | تاريخ الإنشاء: {new Date(request.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                {request.status === 'pending' ? 'قيد المراجعة' :
                 request.status === 'approved' ? 'موافق عليه' :
                 request.status === 'rejected' ? 'مرفوض' :
                 request.status === 'in-progress' ? 'قيد التنفيذ' : request.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* تفاصيل الطلب */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">نوع الطلب</label>
                <p className="mt-1">
                  {request.type === 'support' ? 'طلب دعم' :
                   request.type === 'extension' ? 'طلب تمديد' :
                   request.type === 'material' ? 'طلب مواد' :
                   request.type === 'equipment' ? 'طلب معدات' :
                   request.type === 'worker' ? 'طلب عمالة' : request.type}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">الأولوية</label>
                <p className="mt-1">
                  {request.priority === 'urgent' ? 'عاجلة' :
                   request.priority === 'high' ? 'عالية' :
                   request.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">طالب الطلب</label>
                <p className="mt-1">{request.requestedByName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">التاريخ المطلوب</label>
                <p className="mt-1">
                  {request.expectedDate ? new Date(request.expectedDate).toLocaleDateString('ar-SA') : 'غير محدد'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">وصف الطلب</label>
              <p className="mt-1 p-3 bg-gray-50 rounded-lg">{request.description}</p>
            </div>

            {request.budget && (
              <div>
                <label className="block text-sm font-medium text-gray-600">الميزانية المقدرة</label>
                <p className="mt-1">{Number(request.budget).toLocaleString()} ريال</p>
              </div>
            )}

            {/* رد المقاول */}
            {currentUser?.type === 'contractor' && request.status === 'pending' && (
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">الرد على الطلب</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">حالة الطلب</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="pending">قيد المراجعة</option>
                      <option value="approved">موافق عليه</option>
                      <option value="rejected">مرفوض</option>
                      <option value="in-progress">قيد التنفيذ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">الرد والملاحظات</label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                      placeholder="اكتب ردك وملاحظاتك هنا..."
                    />
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    حفظ الرد
                  </button>
                </div>
              </div>
            )}

            {/* عرض الرد إذا كان موجود */}
            {request.response && (
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-2">رد المقاول</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p>{request.response}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    بواسطة: {request.respondedByName} | 
                    تاريخ الرد: {new Date(request.respondedAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  };

  // مكون بطاقة الطلب
  const RequestCard = ({ request }) => {
    const getStatusColor = (status) => {
      switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'approved': return 'bg-green-100 text-green-700 border-green-200';
        case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
        case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    const getPriorityColor = (priority) => {
      switch(priority) {
        case 'urgent': return 'text-red-600';
        case 'high': return 'text-orange-600';
        case 'medium': return 'text-yellow-600';
        case 'low': return 'text-green-600';
        default: return 'text-gray-600';
      }
    };

    const getTypeIcon = (type) => {
      switch(type) {
        case 'support': return <HelpCircle className="h-4 w-4" />;
        case 'extension': return <Clock className="h-4 w-4" />;
        case 'material': return <FileText className="h-4 w-4" />;
        case 'equipment': return <Building className="h-4 w-4" />;
        case 'worker': return <User className="h-4 w-4" />;
        default: return <MessageSquare className="h-4 w-4" />;
      }
    };

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(request.type)}
            <h3 className="font-semibold">{request.title}</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(request.status)}`}>
            {request.status === 'pending' ? 'قيد المراجعة' :
             request.status === 'approved' ? 'موافق عليه' :
             request.status === 'rejected' ? 'مرفوض' :
             request.status === 'in-progress' ? 'قيد التنفيذ' : request.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {request.requestedByName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(request.createdAt).toLocaleDateString('ar-SA')}
            </span>
            <span className={`flex items-center gap-1 ${getPriorityColor(request.priority)}`}>
              <Flag className="h-3 w-3" />
              {request.priority === 'urgent' ? 'عاجلة' :
               request.priority === 'high' ? 'عالية' :
               request.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
            </span>
          </div>
          <button
            onClick={() => setSelectedRequest(request)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <Eye className="h-3 w-3" />
            عرض
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            طلبات الدعم والتمديد
          </h2>
          
          {currentUser?.type === 'site_manager' && (
            <button
              onClick={() => setShowAddRequest(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              طلب جديد
            </button>
          )}
        </div>

        {/* فلاتر البحث */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">موافق عليه</option>
            <option value="rejected">مرفوض</option>
            <option value="in-progress">قيد التنفيذ</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">جميع الأنواع</option>
            <option value="support">طلب دعم</option>
            <option value="extension">طلب تمديد</option>
            <option value="material">طلب مواد</option>
            <option value="equipment">طلب معدات</option>
            <option value="worker">طلب عمالة</option>
          </select>
          
          <button
            onClick={loadRequests}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* قائمة الطلبات */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-16 text-center">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">لا توجد طلبات</p>
            {currentUser?.type === 'site_manager' && (
              <button
                onClick={() => setShowAddRequest(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة طلب جديد
              </button>
            )}
          </div>
        )}
      </div>

      {/* نموذج إضافة طلب */}
      {showAddRequest && (
        <AddRequestModal
          onClose={() => setShowAddRequest(false)}
          onAdd={supportRequestActions?.addRequest}
        />
      )}

      {/* نموذج عرض تفاصيل الطلب */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={supportRequestActions?.updateRequest}
        />
      )}
    </div>
  );
};

export default SupportRequestView;

