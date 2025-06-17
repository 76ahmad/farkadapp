// أنشئ ملف جديد: src/components/workers/WorkersManagement.js

import React, { useState } from 'react';
import { 
  Users, Plus, Edit2, Trash2, Phone, Mail, MapPin, 
  Calendar, Search, Filter, UserCheck, UserX, 
  HardHat, Wrench, Zap, Paintbrush, Home, 
  DollarSign, Clock, AlertCircle, Save, X
} from 'lucide-react';

const WorkersManagement = ({ currentUser }) => {
  // البيانات التجريبية للعمال
  const [workers, setWorkers] = useState([
    {
      id: 1,
      name: 'أحمد محمد علي',
      email: 'ahmed@example.com',
      phone: '0791234567',
      role: 'عامل بناء',
      specialization: 'بناء',
      status: 'نشط',
      joinDate: '2023-05-15',
      salary: 500,
      address: 'عمان - الزرقاء',
      nationalId: '9901234567',
      emergencyContact: '0791234568',
      projects: ['فيلا الأحمد', 'عمارة النور']
    },
    {
      id: 2,
      name: 'محمد خالد سالم',
      email: 'mohammed@example.com',
      phone: '0797654321',
      role: 'كهربائي',
      specialization: 'كهرباء',
      status: 'نشط',
      joinDate: '2023-08-20',
      salary: 600,
      address: 'عمان - جبل الحسين',
      nationalId: '9902345678',
      emergencyContact: '0797654322',
      projects: ['فيلا الأحمد']
    },
    {
      id: 3,
      name: 'عمر يوسف أحمد',
      email: 'omar@example.com',
      phone: '0785555555',
      role: 'سباك',
      specialization: 'سباكة',
      status: 'غير نشط',
      joinDate: '2023-03-10',
      salary: 550,
      address: 'عمان - ماركا',
      nationalId: '9903456789',
      emergencyContact: '0785555556',
      projects: []
    }
  ]);

  const [showAddWorker, setShowAddWorker] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  // التخصصات المتاحة
  const specializations = [
    { value: 'بناء', label: 'بناء', icon: HardHat },
    { value: 'كهرباء', label: 'كهرباء', icon: Zap },
    { value: 'سباكة', label: 'سباكة', icon: Wrench },
    { value: 'دهان', label: 'دهان', icon: Paintbrush },
    { value: 'تشطيبات', label: 'تشطيبات', icon: Home },
    { value: 'عام', label: 'عامل عام', icon: Users }
  ];

  // حساب الإحصائيات
  const stats = {
    total: workers.length,
    active: workers.filter(w => w.status === 'نشط').length,
    inactive: workers.filter(w => w.status === 'غير نشط').length,
    totalSalaries: workers.reduce((sum, w) => sum + w.salary, 0)
  };

  // فلترة العمال
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.phone.includes(searchTerm) ||
      worker.nationalId.includes(searchTerm);
    
    const matchesStatus = 
      filterStatus === 'all' || worker.status === filterStatus;
    
    const matchesSpecialization = 
      filterSpecialization === 'all' || worker.specialization === filterSpecialization;
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  // حذف عامل
  const handleDeleteWorker = (workerId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العامل؟')) {
      setWorkers(prev => prev.filter(w => w.id !== workerId));
    }
  };

  // مكون إضافة/تعديل عامل
  const WorkerForm = ({ worker, onClose }) => {
    const [formData, setFormData] = useState({
      name: worker?.name || '',
      email: worker?.email || '',
      phone: worker?.phone || '',
      role: worker?.role || '',
      specialization: worker?.specialization || 'بناء',
      status: worker?.status || 'نشط',
      salary: worker?.salary || '',
      address: worker?.address || '',
      nationalId: worker?.nationalId || '',
      emergencyContact: worker?.emergencyContact || '',
      joinDate: worker?.joinDate || new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // التحقق من البيانات
      if (!formData.name || !formData.phone || !formData.nationalId) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
      }

      if (worker) {
        // تعديل عامل موجود
        setWorkers(prev => prev.map(w => 
          w.id === worker.id 
            ? { ...w, ...formData, salary: parseFloat(formData.salary) }
            : w
        ));
      } else {
        // إضافة عامل جديد
        const newWorker = {
          id: Date.now(),
          ...formData,
          salary: parseFloat(formData.salary),
          projects: []
        };
        setWorkers(prev => [...prev, newWorker]);
      }

      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">
              {worker ? 'تعديل بيانات العامل' : 'إضافة عامل جديد'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الاسم */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              {/* الرقم الوطني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الرقم الوطني *
                </label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              {/* الهاتف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              {/* هاتف الطوارئ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  هاتف الطوارئ
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* التخصص */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التخصص *
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  {specializations.map(spec => (
                    <option key={spec.value} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* المسمى الوظيفي */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* الراتب */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الراتب الشهري (د.أ) *
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              {/* الحالة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الحالة
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="نشط">نشط</option>
                  <option value="غير نشط">غير نشط</option>
                </select>
              </div>

              {/* تاريخ الانضمام */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الانضمام
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* العنوان */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="2"
              />
            </div>

            {/* الأزرار */}
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
                {worker ? 'حفظ التعديلات' : 'إضافة العامل'}
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
        <h2 className="text-2xl font-bold">إدارة العمال</h2>
        <button
          onClick={() => setShowAddWorker(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          إضافة عامل جديد
        </button>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">إجمالي العمال</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">عمال نشطون</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <UserCheck className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">غير نشطين</p>
              <p className="text-3xl font-bold">{stats.inactive}</p>
            </div>
            <UserX className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">إجمالي الرواتب</p>
              <p className="text-2xl font-bold">{stats.totalSalaries.toLocaleString()} د.أ</p>
            </div>
            <DollarSign className="h-10 w-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* البحث والفلترة */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث بالاسم، الهاتف، الرقم الوطني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border rounded-lg"
            />
            <Search className="absolute right-2 top-3 h-4 w-4 text-gray-400" />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="all">جميع الحالات</option>
            <option value="نشط">نشط</option>
            <option value="غير نشط">غير نشط</option>
          </select>

          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="all">جميع التخصصات</option>
            {specializations.map(spec => (
              <option key={spec.value} value={spec.value}>
                {spec.label}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            عرض {filteredWorkers.length} من {workers.length} عامل
          </div>
        </div>
      </div>

      {/* قائمة العمال */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العامل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التخصص
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  معلومات الاتصال
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الراتب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المشاريع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkers.map((worker) => {
                const SpecIcon = specializations.find(s => s.value === worker.specialization)?.icon || Users;
                
                return (
                  <tr key={worker.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <SpecIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {worker.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {worker.nationalId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{worker.role}</div>
                      <div className="text-sm text-gray-500">{worker.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {worker.phone}
                      </div>
                      {worker.email && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {worker.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {worker.salary} د.أ
                      </div>
                      <div className="text-sm text-gray-500">شهري</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        worker.status === 'نشط' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {worker.projects.length > 0 ? (
                          <div>
                            {worker.projects.join(', ')}
                            <span className="text-gray-500"> ({worker.projects.length})</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">لا يوجد</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingWorker(worker)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWorker(worker.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* نماذج الإضافة والتعديل */}
      {showAddWorker && (
        <WorkerForm onClose={() => setShowAddWorker(false)} />
      )}
      
      {editingWorker && (
        <WorkerForm 
          worker={editingWorker} 
          onClose={() => setEditingWorker(null)} 
        />
      )}
    </div>
  );
};

export default WorkersManagement;