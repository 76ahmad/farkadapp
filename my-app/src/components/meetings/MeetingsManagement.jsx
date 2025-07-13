import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, MapPin, FileText, Plus, 
  Edit2, Trash2, Eye, Download, Send, CheckCircle,
  AlertCircle, Video, Phone, MessageSquare, Camera,
  Filter, Search, RefreshCw, Star, Lock, Unlock,
  CalendarDays, Target, TrendingUp, Layers
} from 'lucide-react';

const MeetingsManagement = ({ 
  currentUser, 
  meetings = [], 
  projects = [],
  workers = [],
  meetingsActions 
}) => {
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showSummaryForm, setShowSummaryForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // تصفية الاجتماعات
  const filteredMeetings = meetings.filter(meeting => {
    const matchesStatus = filterStatus === 'all' || meeting.status === filterStatus;
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || meeting.date === selectedDate;
    return matchesStatus && matchesSearch && matchesDate;
  });

  // حساب الإحصائيات
  const stats = {
    total: meetings.length,
    upcoming: meetings.filter(m => new Date(m.date) > new Date()).length,
    completed: meetings.filter(m => m.status === 'مكتمل').length,
    cancelled: meetings.filter(m => m.status === 'ملغي').length,
    today: meetings.filter(m => m.date === new Date().toISOString().split('T')[0]).length
  };

  // مكون إنشاء اجتماع جديد
  const MeetingForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      projectId: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'اجتماع عادي',
      location: '',
      description: '',
      attendees: [],
      agenda: '',
      isOnline: false,
      meetingLink: '',
      priority: 'medium'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const meetingData = {
          ...formData,
          createdBy: currentUser?.displayName || currentUser?.email,
          status: 'مجدول',
          attendees: formData.attendees,
          agenda: formData.agenda,
          createdAt: new Date().toISOString()
        };

        await meetingsActions.addMeeting(meetingData);
        setShowMeetingForm(false);
        alert('تم إنشاء الاجتماع بنجاح!');
      } catch (error) {
        console.error('Error creating meeting:', error);
        alert('حدث خطأ أثناء إنشاء الاجتماع');
      }
    };

    const addAttendee = () => {
      const attendeeName = prompt('اسم الحضور:');
      if (attendeeName) {
        setFormData(prev => ({
          ...prev,
          attendees: [...prev.attendees, {
            id: Date.now(),
            name: attendeeName,
            role: 'حضور',
            confirmed: false
          }]
        }));
      }
    };

    const removeAttendee = (attendeeId) => {
      setFormData(prev => ({
        ...prev,
        attendees: prev.attendees.filter(a => a.id !== attendeeId)
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">إنشاء اجتماع جديد</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان الاجتماع *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">المشروع</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  className="w-full p-2 border rounded-lg"
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
                <label className="block text-sm font-medium mb-1">التاريخ *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">وقت البداية</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">وقت النهاية</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">نوع الاجتماع</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="اجتماع عادي">اجتماع عادي</option>
                  <option value="اجتماع طارئ">اجتماع طارئ</option>
                  <option value="اجتماع تنسيق">اجتماع تنسيق</option>
                  <option value="اجتماع مراجعة">اجتماع مراجعة</option>
                  <option value="اجتماع عمل">اجتماع عمل</option>
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
              <label className="block text-sm font-medium mb-1">الموقع</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="موقع الاجتماع أو رابط الاجتماع الإلكتروني"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="وصف الاجتماع والهدف منه..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">جدول الأعمال</label>
              <textarea
                value={formData.agenda}
                onChange={(e) => setFormData({...formData, agenda: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="4"
                placeholder="نقاط جدول الأعمال..."
              />
            </div>

            {/* الحضور */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">الحضور</label>
                <button
                  type="button"
                  onClick={addAttendee}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + إضافة حضور
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.attendees.map(attendee => (
                  <div key={attendee.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="flex-1">{attendee.name}</span>
                    <span className="text-sm text-gray-500">{attendee.role}</span>
                    <button
                      type="button"
                      onClick={() => removeAttendee(attendee.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOnline"
                checked={formData.isOnline}
                onChange={(e) => setFormData({...formData, isOnline: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="isOnline" className="text-sm">
                اجتماع إلكتروني
              </label>
            </div>

            {formData.isOnline && (
              <div>
                <label className="block text-sm font-medium mb-1">رابط الاجتماع</label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowMeetingForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={!formData.title || !formData.date}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                إنشاء الاجتماع
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // مكون عرض تفاصيل الاجتماع
  const MeetingDetails = ({ meeting, onClose }) => {
    const [showSummaryForm, setShowSummaryForm] = useState(false);

    const handleStatusUpdate = async (newStatus) => {
      try {
        await meetingsActions.updateMeeting(meeting.id, { 
          status: newStatus,
          lastModified: new Date().toISOString(),
          modifiedBy: currentUser?.displayName || currentUser?.email
        });
        alert('تم تحديث حالة الاجتماع بنجاح!');
        onClose();
      } catch (error) {
        console.error('Error updating meeting status:', error);
        alert('حدث خطأ أثناء تحديث الحالة');
      }
    };

    const handleAddSummary = async (summaryData) => {
      try {
        await meetingsActions.updateMeeting(meeting.id, { 
          summary: summaryData,
          status: 'مكتمل',
          completedAt: new Date().toISOString()
        });
        
        setShowSummaryForm(false);
        alert('تم إضافة ملخص الاجتماع بنجاح!');
      } catch (error) {
        console.error('Error adding summary:', error);
        alert('حدث خطأ أثناء إضافة الملخص');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{meeting.title}</h3>
              <p className="text-sm text-gray-500">{meeting.type}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">التاريخ</p>
                <p className="font-medium">{new Date(meeting.date).toLocaleDateString('ar-SA')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">الوقت</p>
                <p className="font-medium">{meeting.startTime} - {meeting.endTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">المشروع</p>
                <p className="font-medium">{meeting.projectName || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">الحالة</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  meeting.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                  meeting.status === 'ملغي' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {meeting.status}
                </span>
              </div>
            </div>
            
            {meeting.description && (
              <div>
                <p className="text-sm text-gray-500 mb-2">الوصف</p>
                <p className="font-medium bg-gray-50 p-3 rounded-lg">{meeting.description}</p>
              </div>
            )}

            {meeting.location && (
              <div>
                <p className="text-sm text-gray-500 mb-2">الموقع</p>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{meeting.location}</span>
                </div>
              </div>
            )}

            {/* جدول الأعمال */}
            {meeting.agenda && (
              <div>
                <p className="text-sm text-gray-500 mb-2">جدول الأعمال</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="whitespace-pre-wrap font-medium">{meeting.agenda}</pre>
                </div>
              </div>
            )}

            {/* الحضور */}
            {meeting.attendees && meeting.attendees.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">الحضور ({meeting.attendees.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {meeting.attendees.map((attendee, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{attendee.name}</span>
                      <span className="text-sm text-gray-500">({attendee.role})</span>
                      {attendee.confirmed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ملخص الاجتماع */}
            {meeting.summary ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">ملخص الاجتماع</p>
                  <button
                    onClick={() => setShowSummaryForm(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    تعديل
                  </button>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium mb-1">القرارات المتخذة:</p>
                      <p className="text-sm">{meeting.summary.decisions}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">المهام المطلوبة:</p>
                      <p className="text-sm">{meeting.summary.tasks}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">الملاحظات:</p>
                      <p className="text-sm">{meeting.summary.notes}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">الموعد القادم:</p>
                      <p className="text-sm">{meeting.summary.nextMeeting}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">لا يوجد ملخص للاجتماع</p>
                <button
                  onClick={() => setShowSummaryForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إضافة ملخص
                </button>
              </div>
            )}
            
            {/* أزرار التحكم */}
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleStatusUpdate('مكتمل')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                إكمال
              </button>
              <button
                onClick={() => handleStatusUpdate('ملغي')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                إلغاء
              </button>
              <button
                onClick={() => handleStatusUpdate('مجدول')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                إعادة جدولة
              </button>
            </div>
          </div>

          {/* نموذج إضافة ملخص */}
          {showSummaryForm && (
            <SummaryForm 
              onSubmit={handleAddSummary}
              onClose={() => setShowSummaryForm(false)}
              existingSummary={meeting.summary}
            />
          )}
        </div>
      </div>
    );
  };

  // مكون إضافة ملخص الاجتماع
  const SummaryForm = ({ onSubmit, onClose, existingSummary = null }) => {
    const [formData, setFormData] = useState({
      decisions: existingSummary?.decisions || '',
      tasks: existingSummary?.tasks || '',
      notes: existingSummary?.notes || '',
      nextMeeting: existingSummary?.nextMeeting || '',
      attendees: existingSummary?.attendees || [],
      duration: existingSummary?.duration || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">ملخص الاجتماع</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">القرارات المتخذة *</label>
              <textarea
                value={formData.decisions}
                onChange={(e) => setFormData({...formData, decisions: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="القرارات والنتائج المهمة..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">المهام المطلوبة</label>
              <textarea
                value={formData.tasks}
                onChange={(e) => setFormData({...formData, tasks: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="المهام والمسؤوليات المطلوبة..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">الملاحظات</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="ملاحظات إضافية..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">الموعد القادم</label>
                <input
                  type="text"
                  value={formData.nextMeeting}
                  onChange={(e) => setFormData({...formData, nextMeeting: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="تاريخ ووقت الاجتماع القادم"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">مدة الاجتماع</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="مثال: ساعة واحدة"
                />
              </div>
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
                حفظ الملخص
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
          <h2 className="text-2xl font-bold">إدارة الاجتماعات</h2>
          <p className="text-gray-600">جدولة وإدارة اجتماعات المشاريع</p>
        </div>
        <button
          onClick={() => setShowMeetingForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          اجتماع جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الاجتماعات</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">قادمة</p>
              <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">مكتملة</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">اليوم</p>
              <p className="text-2xl font-bold text-purple-600">{stats.today}</p>
            </div>
            <CalendarDays className="h-8 w-8 text-purple-500" />
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
                placeholder="البحث في الاجتماعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="مجدول">مجدولة</option>
              <option value="مكتمل">مكتملة</option>
              <option value="ملغي">ملغية</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setSelectedDate('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">الاجتماعات ({filteredMeetings.length})</h3>
        </div>
        
        <div className="divide-y">
          {filteredMeetings.map(meeting => (
            <div key={meeting.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(meeting.date).toLocaleDateString('ar-SA')} • {meeting.startTime} - {meeting.endTime}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        meeting.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                        meeting.status === 'ملغي' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {meeting.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {meeting.type}
                      </span>
                      {meeting.isOnline && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          إلكتروني
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMeeting(meeting)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {meeting.summary && (
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      <FileText className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredMeetings.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد اجتماعات</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showMeetingForm && <MeetingForm />}
      {selectedMeeting && (
        <MeetingDetails 
          meeting={selectedMeeting} 
          onClose={() => setSelectedMeeting(null)} 
        />
      )}
    </div>
  );
};

export default MeetingsManagement;