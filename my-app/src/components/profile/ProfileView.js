import React, { useState } from 'react';
import { 
  User, Mail, Phone, Building, Calendar, 
  Edit2, Save, X, Award, Briefcase, MapPin, DollarSign
} from 'lucide-react';

const ProfileView = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '0501234567',
    address: 'الرياض، المملكة العربية السعودية',
    joinDate: '2023-01-15',
    specialization: currentUser?.specialization || 'بناء', // للعامل
    experience: '5', // سنوات الخبرة
    dailyRate: '250', // الأجر اليومي للعامل
    emergencyContact: {
      name: 'أحمد محمد',
      phone: '0502345678',
      relation: 'أخ'
    }
  });

  const specializations = [
    'بناء',
    'كهرباء',
    'سباكة',
    'حدادة',
    'دهان',
    'بلاط',
    'نجارة',
    'تكييف',
    'عزل',
    'زجاج وألمنيوم'
  ];

  const handleSave = () => {
    // هنا يتم حفظ البيانات في قاعدة البيانات
    console.log('Saving profile:', profile);
    setIsEditing(false);
    alert('تم حفظ التغييرات بنجاح!');
  };

  const userTypeLabels = {
    contractor: 'مقاول',
    architect: 'مهندس معماري',
    worker: 'عامل',
    site_manager: 'مدير موقع',
    inspector: 'مفتش/بلدية',
    client: 'عميل/مالك'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الملف الشخصي</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit2 className="h-5 w-5" />
            تعديل
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              حفظ
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                // إعادة البيانات الأصلية
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              إلغاء
            </button>
          </div>
        )}
      </div>

      {/* البطاقة الرئيسية */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{profile.displayName}</h3>
            <p className="text-gray-600">{userTypeLabels[currentUser?.type]}</p>
            <p className="text-sm text-gray-500">انضم في {profile.joinDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* المعلومات الأساسية */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2">المعلومات الأساسية</h4>
            
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <User className="h-4 w-4" />
                الاسم الكامل
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="font-medium">{profile.displayName}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="font-medium">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Phone className="h-4 w-4" />
                رقم الهاتف
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="font-medium">{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <MapPin className="h-4 w-4" />
                العنوان
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="font-medium">{profile.address}</p>
              )}
            </div>
          </div>

          {/* معلومات العمل */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2">معلومات العمل</h4>
            
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Building className="h-4 w-4" />
                نوع المستخدم
              </label>
              <p className="font-medium">{userTypeLabels[currentUser?.type]}</p>
            </div>

            {/* التخصص للعامل فقط */}
            {currentUser?.type === 'worker' && (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Briefcase className="h-4 w-4" />
                    التخصص
                  </label>
                  {isEditing ? (
                    <select
                      value={profile.specialization}
                      onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    >
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium">{profile.specialization}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Award className="h-4 w-4" />
                    سنوات الخبرة
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profile.experience}
                      onChange={(e) => setProfile({...profile, experience: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      min="0"
                    />
                  ) : (
                    <p className="font-medium">{profile.experience} سنوات</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    الأجر اليومي
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profile.dailyRate}
                      onChange={(e) => setProfile({...profile, dailyRate: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      min="0"
                    />
                  ) : (
                    <p className="font-medium">{profile.dailyRate} ريال/يوم</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                تاريخ الانضمام
              </label>
              <p className="font-medium">{profile.joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* جهة اتصال الطوارئ */}
      {currentUser?.type === 'worker' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">جهة اتصال الطوارئ</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">الاسم</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.emergencyContact.name}
                  onChange={(e) => setProfile({...profile, emergencyContact: {...profile.emergencyContact, name: e.target.value}})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="font-medium">{profile.emergencyContact.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">رقم الهاتف</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.emergencyContact.phone}
                  onChange={(e) => setProfile({...profile, emergencyContact: {...profile.emergencyContact, phone: e.target.value}})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="font-medium">{profile.emergencyContact.phone}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">صلة القرابة</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.emergencyContact.relation}
                  onChange={(e) => setProfile({...profile, emergencyContact: {...profile.emergencyContact, relation: e.target.value}})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="font-medium">{profile.emergencyContact.relation}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;