// أنشئ ملف جديد: src/components/profile/ProfileView.js

import React, { useState } from 'react';
import { 
  User, Mail, Phone, Briefcase, Calendar, MapPin, 
  Edit2, Save, X, Camera, Shield, Bell, Eye, EyeOff 
} from 'lucide-react';

const ProfileView = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // بيانات المستخدم
  const [userData, setUserData] = useState({
    name: currentUser?.displayName || 'اسم المستخدم',
    email: currentUser?.email || 'user@example.com',
    phone: '079-123-4567',
    role: currentUser?.type || 'contractor',
    department: 'إدارة المشاريع',
    location: 'عمان - الأردن',
    joinDate: '2024-01-15',
    bio: 'مدير مشاريع بخبرة 10 سنوات في مجال البناء والتشييد',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // إعدادات الإشعارات
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    taskReminders: true,
    dailyReport: false,
    weeklyReport: true
  });

  // أسماء الأدوار بالعربية
  const roleNames = {
    contractor: 'مقاول',
    architect: 'مهندس معماري',
    worker: 'عامل',
    site_manager: 'مدير موقع',
    inspector: 'مفتش',
    client: 'عميل'
  };

  // معالج تغيير البيانات
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // معالج تغيير الإشعارات
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // معالج رفع الصورة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // حفظ التغييرات
  const handleSave = () => {
    // التحقق من كلمة المرور
    if (userData.newPassword) {
      if (userData.newPassword !== userData.confirmPassword) {
        alert('كلمات المرور غير متطابقة!');
        return;
      }
      if (userData.newPassword.length < 6) {
        alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل!');
        return;
      }
    }
    
    alert('تم حفظ التغييرات بنجاح!');
    setIsEditing(false);
    // إعادة تعيين كلمات المرور
    setUserData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  // إلغاء التعديل
  const handleCancel = () => {
    setIsEditing(false);
    // إعادة تعيين كلمات المرور
    setUserData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold">الملف الشخصي</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* البطاقة الشخصية */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              {/* صورة الملف الشخصي */}
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                )}
              </div>

              {/* الاسم والدور */}
              <h3 className="text-xl font-bold mt-4">{userData.name}</h3>
              <p className="text-gray-600">{roleNames[userData.role]}</p>
              <p className="text-sm text-gray-500">{userData.department}</p>

              {/* الإحصائيات */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">تاريخ الانضمام</span>
                  <span className="font-medium">{new Date(userData.joinDate).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">المشاريع النشطة</span>
                  <span className="font-medium text-blue-600">3</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">المهام المكتملة</span>
                  <span className="font-medium text-green-600">24</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات الحساب */}
        <div className="lg:col-span-2 space-y-6">
          {/* المعلومات الأساسية */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="h-4 w-4" />
                  تعديل
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Save className="h-4 w-4" />
                    حفظ
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    <X className="h-4 w-4" />
                    إلغاء
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Mail className="h-4 w-4" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Phone className="h-4 w-4" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    الموقع
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={userData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Briefcase className="h-4 w-4" />
                  نبذة عني
                </label>
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className={`w-full p-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>
            </div>
          </div>

          {/* تغيير كلمة المرور */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  تغيير كلمة المرور
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">كلمة المرور الحالية</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-2 top-2.5 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* إعدادات الإشعارات */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <span>إشعارات البريد الإلكتروني</span>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                    className="h-4 w-4 text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <span>إشعارات الرسائل النصية</span>
                  <input
                    type="checkbox"
                    checked={notifications.smsNotifications}
                    onChange={() => handleNotificationChange('smsNotifications')}
                    className="h-4 w-4 text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <span>تنبيهات نقص المخزون</span>
                  <input
                    type="checkbox"
                    checked={notifications.lowStockAlerts}
                    onChange={() => handleNotificationChange('lowStockAlerts')}
                    className="h-4 w-4 text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <span>تذكيرات المهام</span>
                  <input
                    type="checkbox"
                    checked={notifications.taskReminders}
                    onChange={() => handleNotificationChange('taskReminders')}
                    className="h-4 w-4 text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <span>التقرير اليومي</span>
                  <input
                    type="checkbox"
                    checked={notifications.dailyReport}
                    onChange={() => handleNotificationChange('dailyReport')}
                    className="h-4 w-4 text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <span>التقرير الأسبوعي</span>
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReport}
                    onChange={() => handleNotificationChange('weeklyReport')}
                    className="h-4 w-4 text-blue-600"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;