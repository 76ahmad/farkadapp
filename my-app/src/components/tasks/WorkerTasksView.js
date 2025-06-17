import React, { useState } from 'react';
import { 
  CheckSquare, Square, Clock, Calendar, MapPin, 
  Phone, User, AlertCircle, CheckCircle, Coffee,
  LogIn, LogOut, Camera, FileText
} from 'lucide-react';

const WorkerTasksView = ({ currentUser }) => {
  // المهام اليومية للعامل
  const [myTasks, setMyTasks] = useState([
    {
      id: 1,
      date: '2024-06-17',
      title: 'تجهيز القوالب الخشبية',
      project: 'فيلا الأحمد',
      location: 'الرياض - حي النرجس',
      siteManager: { name: 'أحمد محمد', phone: '0501234567' },
      description: 'تجهيز القوالب الخشبية للطابق الأول استعداداً للصب',
      startTime: '07:00',
      endTime: '16:00',
      status: 'completed',
      notes: 'تم الإنجاز بنجاح',
      materials: ['خشب قوالب', 'مسامير', 'أدوات نجارة']
    },
    {
      id: 2,
      date: '2024-06-18',
      title: 'وضع حديد التسليح',
      project: 'فيلا الأحمد',
      location: 'الرياض - حي النرجس',
      siteManager: { name: 'أحمد محمد', phone: '0501234567' },
      description: 'وضع حديد التسليح للسقف حسب المخططات',
      startTime: '07:00',
      endTime: '16:00',
      status: 'in_progress',
      notes: '',
      materials: ['حديد تسليح 12مم', 'أسلاك ربط']
    },
    {
      id: 3,
      date: '2024-06-19',
      title: 'صب الخرسانة',
      project: 'فيلا الأحمد',
      location: 'الرياض - حي النرجس',
      siteManager: { name: 'أحمد محمد', phone: '0501234567' },
      description: 'المشاركة في عملية صب الخرسانة للسقف',
      startTime: '06:00',
      endTime: '14:00',
      status: 'pending',
      notes: 'البدء مبكراً لتجنب الحرارة',
      materials: ['خرسانة جاهزة', 'معدات الصب']
    }
  ]);

  // سجل الحضور والانصراف
  const [attendance, setAttendance] = useState({
    today: null,
    history: [
      { date: '2024-06-16', checkIn: '06:55', checkOut: '16:05', status: 'present' },
      { date: '2024-06-15', checkIn: '07:02', checkOut: '16:00', status: 'present' },
      { date: '2024-06-14', checkIn: null, checkOut: null, status: 'absent' }
    ]
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // المهام حسب التاريخ المحدد
  const todayTasks = myTasks.filter(task => task.date === selectedDate);
  const todayDate = new Date().toISOString().split('T')[0];

  // تسجيل الحضور
  const handleCheckIn = () => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setAttendance(prev => ({
      ...prev,
      today: { checkIn: time, checkOut: null }
    }));
    
    alert(`تم تسجيل الحضور في ${time}`);
  };

  // تسجيل الانصراف
  const handleCheckOut = () => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setAttendance(prev => ({
      ...prev,
      today: { ...prev.today, checkOut: time }
    }));
    
    alert(`تم تسجيل الانصراف في ${time}`);
  };

  // تحديث حالة المهمة
  const updateTaskStatus = (taskId, newStatus) => {
    setMyTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // إضافة ملاحظة للمهمة
  const addTaskNote = (taskId, note) => {
    setMyTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, notes: note } : task
    ));
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      {/* الترحيب والمعلومات الأساسية */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">مرحباً {currentUser?.displayName || 'العامل'}</h2>
            <p className="text-gray-600">التاريخ: {new Date().toLocaleDateString('ar-EG', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          {/* أزرار الحضور والانصراف */}
          <div className="flex gap-2">
            {!attendance.today?.checkIn ? (
              <button
                onClick={handleCheckIn}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <LogIn className="h-5 w-5" />
                تسجيل حضور
              </button>
            ) : !attendance.today?.checkOut ? (
              <>
                <span className="text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  حضور: {attendance.today.checkIn}
                </span>
                <button
                  onClick={handleCheckOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  تسجيل انصراف
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-green-600">حضور: {attendance.today.checkIn}</p>
                <p className="text-red-600">انصراف: {attendance.today.checkOut}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* اختيار التاريخ */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium mb-2">عرض مهام تاريخ:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full md:w-64 p-2 border rounded-lg"
        />
      </div>

      {/* المهام اليومية */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            مهام {selectedDate === todayDate ? 'اليوم' : selectedDate} ({todayTasks.length})
          </h3>
        </div>

        <div className="p-4 space-y-4">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد مهام لهذا اليوم</p>
            </div>
          ) : (
            todayTasks.map(task => (
              <div key={task.id} className={`border rounded-lg p-4 ${
                task.status === 'completed' ? 'bg-gray-50' : 'bg-white'
              }`}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      if (task.status === 'pending') {
                        updateTaskStatus(task.id, 'in_progress');
                      } else if (task.status === 'in_progress') {
                        updateTaskStatus(task.id, 'completed');
                      }
                    }}
                    className="mt-1"
                    disabled={task.status === 'completed'}
                  >
                    {task.status === 'completed' ? (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    ) : task.status === 'in_progress' ? (
                      <Square className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className={`font-semibold ${
                          task.status === 'completed' ? 'line-through text-gray-500' : ''
                        }`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600">{task.project}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status === 'completed' ? 'مكتملة' :
                         task.status === 'in_progress' ? 'قيد التنفيذ' : 'لم تبدأ'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{task.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{task.startTime} - {task.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{task.siteManager.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{task.siteManager.phone}</span>
                      </div>
                    </div>

                    {/* المواد المطلوبة */}
                    {task.materials && task.materials.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">المواد المطلوبة:</p>
                        <div className="flex flex-wrap gap-1">
                          {task.materials.map((material, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* الملاحظات */}
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-1">ملاحظات:</p>
                      {selectedDate === todayDate && task.status !== 'completed' ? (
                        <textarea
                          value={task.notes}
                          onChange={(e) => addTaskNote(task.id, e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                          rows="2"
                          placeholder="أضف ملاحظاتك هنا..."
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{task.notes || 'لا توجد ملاحظات'}</p>
                      )}
                    </div>

                    {/* أزرار الإجراءات */}
                    {selectedDate === todayDate && task.status === 'in_progress' && (
                      <div className="mt-3 flex gap-2">
                        <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm flex items-center gap-1">
                          <Camera className="h-4 w-4" />
                          رفع صورة
                        </button>
                        <button className="text-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          تقرير
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* سجل الحضور */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            سجل الحضور والانصراف
          </h3>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right pb-2">التاريخ</th>
                  <th className="text-center pb-2">الحضور</th>
                  <th className="text-center pb-2">الانصراف</th>
                  <th className="text-center pb-2">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {attendance.today && (
                  <tr className="border-b bg-blue-50">
                    <td className="py-2">{todayDate} (اليوم)</td>
                    <td className="text-center">{attendance.today.checkIn || '-'}</td>
                    <td className="text-center">{attendance.today.checkOut || '-'}</td>
                    <td className="text-center">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        حاضر
                      </span>
                    </td>
                  </tr>
                )}
                {attendance.history.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{record.date}</td>
                    <td className="text-center">{record.checkIn || '-'}</td>
                    <td className="text-center">{record.checkOut || '-'}</td>
                    <td className="text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status === 'present' ? 'حاضر' :
                         record.status === 'absent' ? 'غائب' : 'إجازة'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* تنبيهات مهمة */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">تنبيهات مهمة</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• يرجى ارتداء معدات السلامة في جميع الأوقات</li>
              <li>• التأكد من إغلاق الكهرباء عند الانتهاء من العمل</li>
              <li>• عدم استخدام المعدات التالفة وإبلاغ المشرف فوراً</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerTasksView;