import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, Clock, MapPin, FileText, Search, Filter, 
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle,
  User, MessageSquare, Share2, Download, Video,
  Building2, AlertTriangle, CheckSquare, Square
} from 'lucide-react';
import { meetingsService } from '../../services/meetingsService';

const MeetingsManager = ({ 
  currentUser, 
  currentProject, 
  onViewChange 
}) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingStats, setMeetingStats] = useState({});
  const [showMinutesForm, setShowMinutesForm] = useState(false);
  const [selectedMeetingForMinutes, setSelectedMeetingForMinutes] = useState(null);

  // نموذج إضافة اجتماع جديد
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    type: 'progress',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    location: '',
    attendees: [],
    agenda: []
  });

  // نموذج محضر الاجتماع
  const [meetingMinutes, setMeetingMinutes] = useState({
    attendees: [],
    agenda: [],
    decisions: [],
    actionItems: [],
    nextMeeting: '',
    notes: ''
  });

  useEffect(() => {
    if (currentProject?.id) {
      loadMeetings();
      loadMeetingStats();
    }
  }, [currentProject]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const unsubscribe = meetingsService.subscribeToProjectMeetings(
        currentProject.id,
        (meetingsData) => {
          setMeetings(meetingsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading meetings:', error);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up meetings subscription:', error);
      setLoading(false);
    }
  };

  const loadMeetingStats = async () => {
    try {
      const stats = await meetingsService.getMeetingsStats(currentProject.id);
      setMeetingStats(stats);
    } catch (error) {
      console.error('Error loading meeting stats:', error);
    }
  };

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    try {
      const scheduledDateTime = new Date(`${newMeeting.scheduledDate}T${newMeeting.scheduledTime}`);
      
      await meetingsService.addMeeting({
        ...newMeeting,
        projectId: currentProject.id,
        scheduledDate: scheduledDateTime.toISOString(),
        createdBy: currentUser?.email,
        createdByName: currentUser?.displayName
      });
      
      setNewMeeting({
        title: '',
        description: '',
        type: 'progress',
        scheduledDate: '',
        scheduledTime: '',
        duration: 60,
        location: '',
        attendees: [],
        agenda: []
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding meeting:', error);
      alert('حدث خطأ أثناء إضافة الاجتماع');
    }
  };

  const handleUpdateMeeting = async (meetingId, updates) => {
    try {
      await meetingsService.updateMeeting(meetingId, updates);
      setSelectedMeeting(null);
    } catch (error) {
      console.error('Error updating meeting:', error);
      alert('حدث خطأ أثناء تحديث الاجتماع');
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاجتماع؟')) {
      try {
        await meetingsService.deleteMeeting(meetingId);
      } catch (error) {
        console.error('Error deleting meeting:', error);
        alert('حدث خطأ أثناء حذف الاجتماع');
      }
    }
  };

  const handleAddMinutes = async (e) => {
    e.preventDefault();
    try {
      await meetingsService.addMeetingMinutes(selectedMeetingForMinutes.id, {
        ...meetingMinutes,
        createdBy: currentUser?.email,
        createdByName: currentUser?.displayName
      });
      
      setMeetingMinutes({
        attendees: [],
        agenda: [],
        decisions: [],
        actionItems: [],
        nextMeeting: '',
        notes: ''
      });
      setShowMinutesForm(false);
      setSelectedMeetingForMinutes(null);
    } catch (error) {
      console.error('Error adding meeting minutes:', error);
      alert('حدث خطأ أثناء إضافة محضر الاجتماع');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'postponed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'progress': return <Building2 className="h-4 w-4" />;
      case 'coordination': return <Users className="h-4 w-4" />;
      case 'review': return <FileText className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'planning': return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || meeting.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-10 blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">إدارة الاجتماعات والمحاضر</h1>
                  <p className="text-gray-600">مشروع: {currentProject?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  اجتماع جديد
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-xl p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{meetingStats.total || 0}</div>
                <div className="text-sm text-gray-600">إجمالي الاجتماعات</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-xl p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{meetingStats.completed || 0}</div>
                <div className="text-sm text-gray-600">مكتملة</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-xl p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{meetingStats.scheduled || 0}</div>
                <div className="text-sm text-gray-600">مجدولة</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-xl p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{meetingStats.cancelled || 0}</div>
                <div className="text-sm text-gray-600">ملغية</div>
              </div>
            </div>
          </div>
        </div>

        {/* أدوات البحث والفلترة */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الاجتماعات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="scheduled">مجدولة</option>
                <option value="completed">مكتملة</option>
                <option value="cancelled">ملغية</option>
                <option value="postponed">مؤجلة</option>
              </select>
              
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all duration-300">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* قائمة الاجتماعات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل الاجتماعات...</p>
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">لا توجد اجتماعات حالياً</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                إضافة اجتماع جديد
              </button>
            </div>
          ) : (
            filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(meeting.type)}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{meeting.title}</h3>
                      <p className="text-sm text-gray-600">{meeting.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                      {meeting.status === 'completed' ? 'مكتملة' :
                       meeting.status === 'cancelled' ? 'ملغية' :
                       meeting.status === 'scheduled' ? 'مجدولة' : 'مؤجلة'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(meeting.scheduledDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{meeting.duration} دقيقة</span>
                  </div>
                  
                  {meeting.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{meeting.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{meeting.attendees?.length || 0} مشارك</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMeeting(meeting)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => setSelectedMeeting(meeting)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-all duration-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    {meeting.status === 'scheduled' && (
                      <button
                        onClick={() => {
                          setSelectedMeetingForMinutes(meeting);
                          setShowMinutesForm(true);
                        }}
                        className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-all duration-300"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* نموذج إضافة اجتماع جديد */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">إضافة اجتماع جديد</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddMeeting} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الاجتماع</label>
                <input
                  type="text"
                  required
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع الاجتماع</label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="progress">تقدم العمل</option>
                    <option value="coordination">تنسيق</option>
                    <option value="review">مراجعة</option>
                    <option value="emergency">طارئ</option>
                    <option value="planning">تخطيط</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدة (دقيقة)</label>
                  <input
                    type="number"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({...newMeeting, duration: parseInt(e.target.value)})}
                    min="15"
                    max="480"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={newMeeting.scheduledDate}
                    onChange={(e) => setNewMeeting({...newMeeting, scheduledDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوقت</label>
                  <input
                    type="time"
                    required
                    value={newMeeting.scheduledTime}
                    onChange={(e) => setNewMeeting({...newMeeting, scheduledTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع (اختياري)</label>
                <input
                  type="text"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                  placeholder="موقع الاجتماع"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300"
                >
                  إضافة الاجتماع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نموذج محضر الاجتماع */}
      {showMinutesForm && selectedMeetingForMinutes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">محضر الاجتماع: {selectedMeetingForMinutes.title}</h2>
              <button
                onClick={() => {
                  setShowMinutesForm(false);
                  setSelectedMeetingForMinutes(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddMinutes} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحضور</label>
                  <textarea
                    value={meetingMinutes.attendees.join('\n')}
                    onChange={(e) => setMeetingMinutes({...meetingMinutes, attendees: e.target.value.split('\n').filter(item => item.trim())})}
                    rows="4"
                    placeholder="أسماء الحضور (سطر واحد لكل اسم)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">جدول الأعمال</label>
                  <textarea
                    value={meetingMinutes.agenda.join('\n')}
                    onChange={(e) => setMeetingMinutes({...meetingMinutes, agenda: e.target.value.split('\n').filter(item => item.trim())})}
                    rows="4"
                    placeholder="نقاط جدول الأعمال"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">القرارات المتخذة</label>
                <textarea
                  value={meetingMinutes.decisions.join('\n')}
                  onChange={(e) => setMeetingMinutes({...meetingMinutes, decisions: e.target.value.split('\n').filter(item => item.trim())})}
                  rows="4"
                  placeholder="القرارات المتخذة في الاجتماع"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المهام المطلوبة</label>
                <textarea
                  value={meetingMinutes.actionItems.join('\n')}
                  onChange={(e) => setMeetingMinutes({...meetingMinutes, actionItems: e.target.value.split('\n').filter(item => item.trim())})}
                  rows="4"
                  placeholder="المهام المطلوبة والمكلفين بها"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاجتماع القادم</label>
                  <input
                    type="datetime-local"
                    value={meetingMinutes.nextMeeting}
                    onChange={(e) => setMeetingMinutes({...meetingMinutes, nextMeeting: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات إضافية</label>
                <textarea
                  value={meetingMinutes.notes}
                  onChange={(e) => setMeetingMinutes({...meetingMinutes, notes: e.target.value})}
                  rows="4"
                  placeholder="ملاحظات إضافية"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowMinutesForm(false);
                    setSelectedMeetingForMinutes(null);
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300"
                >
                  حفظ المحضر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* تفاصيل الاجتماع */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الاجتماع</h2>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedMeeting.title}</h3>
                <p className="text-gray-600 mb-6">{selectedMeeting.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">النوع:</span>
                    <span className="text-gray-600">{selectedMeeting.type}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">التاريخ:</span>
                    <span className="text-gray-600">{formatDate(selectedMeeting.scheduledDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">المدة:</span>
                    <span className="text-gray-600">{selectedMeeting.duration} دقيقة</span>
                  </div>
                  
                  {selectedMeeting.location && (
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-700">الموقع:</span>
                      <span className="text-gray-600">{selectedMeeting.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">الحالة:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedMeeting.status)}`}>
                      {selectedMeeting.status === 'completed' ? 'مكتملة' :
                       selectedMeeting.status === 'cancelled' ? 'ملغية' :
                       selectedMeeting.status === 'scheduled' ? 'مجدولة' : 'مؤجلة'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4">الإجراءات</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-300">
                    <Video className="h-5 w-5" />
                    انضمام للاجتماع
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all duration-300">
                    <Edit className="h-5 w-5" />
                    تعديل الاجتماع
                  </button>
                  
                  {selectedMeeting.status === 'scheduled' && (
                    <button 
                      onClick={() => {
                        setSelectedMeetingForMinutes(selectedMeeting);
                        setShowMinutesForm(true);
                        setSelectedMeeting(null);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-all duration-300"
                    >
                      <FileText className="h-5 w-5" />
                      إضافة محضر
                    </button>
                  )}
                  
                  <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-300">
                    <Share2 className="h-5 w-5" />
                    مشاركة الاجتماع
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsManager;