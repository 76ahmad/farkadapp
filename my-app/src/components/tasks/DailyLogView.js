import React, { useState } from 'react';
import { 
  FileText, Save, Calendar, Users, Package, 
  AlertCircle, CheckCircle, Camera, Download,
  Plus, X, Clock, Wrench, CloudRain, Sun
} from 'lucide-react';

const DailyLogView = ({ currentUser, projects = [], workers = [], inventory = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProject, setSelectedProject] = useState('');
  
  // سجل اليوم
  const [dailyLog, setDailyLog] = useState({
    date: selectedDate,
    project: '',
    weather: 'sunny',
    temperature: '',
    workStartTime: '07:00',
    workEndTime: '16:00',
    
    // العمال
    presentWorkers: [],
    absentWorkers: [],
    totalWorkers: 0,
    
    // الأعمال المنجزة
    completedTasks: [
      { id: 1, description: '', percentage: 0 }
    ],
    
    // المواد المستخدمة
    usedMaterials: [],
    
    // المعدات
    equipment: [],
    
    // الملاحظات والمشاكل
    issues: '',
    safetyIncidents: '',
    visitorsLog: [],
    
    // الصور
    photos: [],
    
    // معلومات إضافية
    tomorrowPlan: '',
    additionalNotes: ''
  });

  // حفظ السجل اليومي
  const saveDailyLog = () => {
    // في الواقع، سيتم حفظ البيانات في قاعدة البيانات
    console.log('Saving daily log:', dailyLog);
    alert('تم حفظ السجل اليومي بنجاح!');
  };

  // إضافة مهمة منجزة
  const addCompletedTask = () => {
    setDailyLog(prev => ({
      ...prev,
      completedTasks: [...prev.completedTasks, { 
        id: Date.now(), 
        description: '', 
        percentage: 0 
      }]
    }));
  };

  // حذف مهمة منجزة
  const removeCompletedTask = (taskId) => {
    setDailyLog(prev => ({
      ...prev,
      completedTasks: prev.completedTasks.filter(task => task.id !== taskId)
    }));
  };

  // تحديث مهمة منجزة
  const updateCompletedTask = (taskId, field, value) => {
    setDailyLog(prev => ({
      ...prev,
      completedTasks: prev.completedTasks.map(task => 
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }));
  };

  // إضافة مادة مستخدمة
  const addUsedMaterial = (materialId) => {
    const material = inventory.find(item => item.id === parseInt(materialId));
    if (material && !dailyLog.usedMaterials.find(m => m.id === material.id)) {
      setDailyLog(prev => ({
        ...prev,
        usedMaterials: [...prev.usedMaterials, {
          id: material.id,
          name: material.name,
          quantity: 0,
          unit: material.unit
        }]
      }));
    }
  };

  // تحديث كمية المادة
  const updateMaterialQuantity = (materialId, quantity) => {
    setDailyLog(prev => ({
      ...prev,
      usedMaterials: prev.usedMaterials.map(mat => 
        mat.id === materialId ? { ...mat, quantity: parseFloat(quantity) || 0 } : mat
      )
    }));
  };

  // إزالة مادة
  const removeMaterial = (materialId) => {
    setDailyLog(prev => ({
      ...prev,
      usedMaterials: prev.usedMaterials.filter(mat => mat.id !== materialId)
    }));
  };

  // إضافة زائر
  const addVisitor = () => {
    const visitorName = prompt('اسم الزائر:');
    const visitorPurpose = prompt('الغرض من الزيارة:');
    
    if (visitorName) {
      setDailyLog(prev => ({
        ...prev,
        visitorsLog: [...prev.visitorsLog, {
          id: Date.now(),
          name: visitorName,
          purpose: visitorPurpose || 'زيارة عامة',
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }]
      }));
    }
  };

  // تبديل حضور العامل
  const toggleWorkerAttendance = (workerId) => {
    const isPresent = dailyLog.presentWorkers.includes(workerId);
    
    if (isPresent) {
      setDailyLog(prev => ({
        ...prev,
        presentWorkers: prev.presentWorkers.filter(id => id !== workerId),
        absentWorkers: [...prev.absentWorkers, workerId]
      }));
    } else {
      setDailyLog(prev => ({
        ...prev,
        presentWorkers: [...prev.presentWorkers, workerId],
        absentWorkers: prev.absentWorkers.filter(id => id !== workerId)
      }));
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">السجل اليومي</h2>
        <button
          onClick={saveDailyLog}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          حفظ السجل
        </button>
      </div>

      {/* معلومات أساسية */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">المعلومات الأساسية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">التاريخ</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setDailyLog(prev => ({ ...prev, date: e.target.value }));
              }}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">المشروع</label>
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setDailyLog(prev => ({ ...prev, project: e.target.value }));
              }}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">اختر المشروع</option>
              <option value="1">فيلا الأحمد</option>
              <option value="">اختر المشروع</option>
              <option value="1">فيلا الأحمد</option>
              <option value="2">مجمع سكني - الوادي</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">حالة الطقس</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDailyLog(prev => ({ ...prev, weather: 'sunny' }))}
                className={`flex-1 p-2 rounded flex items-center justify-center gap-1 ${
                  dailyLog.weather === 'sunny' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                }`}
              >
                <Sun className="h-4 w-4" />
                مشمس
              </button>
              <button
                onClick={() => setDailyLog(prev => ({ ...prev, weather: 'rainy' }))}
                className={`flex-1 p-2 rounded flex items-center justify-center gap-1 ${
                  dailyLog.weather === 'rainy' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                }`}
              >
                <CloudRain className="h-4 w-4" />
                ممطر
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">درجة الحرارة</label>
            <input
              type="number"
              value={dailyLog.temperature}
              onChange={(e) => setDailyLog(prev => ({ ...prev, temperature: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="35°C"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">بداية العمل</label>
            <input
              type="time"
              value={dailyLog.workStartTime}
              onChange={(e) => setDailyLog(prev => ({ ...prev, workStartTime: e.target.value }))}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">نهاية العمل</label>
            <input
              type="time"
              value={dailyLog.workEndTime}
              onChange={(e) => setDailyLog(prev => ({ ...prev, workEndTime: e.target.value }))}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* سجل الحضور */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          سجل حضور العمال
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workers.map(worker => {
            const isPresent = dailyLog.presentWorkers.includes(worker.id);
            const isAbsent = dailyLog.absentWorkers.includes(worker.id);
            
            return (
              <div 
                key={worker.id} 
                className={`p-3 rounded border cursor-pointer ${
                  isPresent ? 'bg-green-50 border-green-300' : 
                  isAbsent ? 'bg-red-50 border-red-300' : 
                  'bg-gray-50 border-gray-300'
                }`}
                onClick={() => toggleWorkerAttendance(worker.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-sm text-gray-600">{worker.specialization}</p>
                  </div>
                  <div className="text-center">
                    {isPresent && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {isAbsent && <X className="h-5 w-5 text-red-600" />}
                    {!isPresent && !isAbsent && <Clock className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex gap-4 text-sm">
          <p>الحضور: <span className="font-bold text-green-600">{dailyLog.presentWorkers.length}</span></p>
          <p>الغياب: <span className="font-bold text-red-600">{dailyLog.absentWorkers.length}</span></p>
          <p>الإجمالي: <span className="font-bold">{workers.length}</span></p>
        </div>
      </div>

      {/* الأعمال المنجزة */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            الأعمال المنجزة اليوم
          </h3>
          <button
            onClick={addCompletedTask}
            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            إضافة عمل
          </button>
        </div>
        
        <div className="space-y-3">
          {dailyLog.completedTasks.map((task, index) => (
            <div key={task.id} className="flex gap-3">
              <input
                type="text"
                value={task.description}
                onChange={(e) => updateCompletedTask(task.id, 'description', e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="وصف العمل المنجز"
              />
              <input
                type="number"
                value={task.percentage}
                onChange={(e) => updateCompletedTask(task.id, 'percentage', e.target.value)}
                className="w-20 p-2 border rounded-lg"
                placeholder="%"
                min="0"
                max="100"
              />
              {dailyLog.completedTasks.length > 1 && (
                <button
                  onClick={() => removeCompletedTask(task.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* المواد المستخدمة */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          المواد المستخدمة
        </h3>
        
        <div className="mb-4">
          <select
            onChange={(e) => addUsedMaterial(e.target.value)}
            className="w-full md:w-64 p-2 border rounded-lg"
            value=""
          >
            <option value="">اختر مادة لإضافتها</option>
            {inventory.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} (متوفر: {item.currentStock} {item.unit})
              </option>
            ))}
          </select>
        </div>
        
        {dailyLog.usedMaterials.length > 0 && (
          <div className="space-y-2">
            {dailyLog.usedMaterials.map(material => (
              <div key={material.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded">
                <span className="flex-1">{material.name}</span>
                <input
                  type="number"
                  value={material.quantity}
                  onChange={(e) => updateMaterialQuantity(material.id, e.target.value)}
                  className="w-24 p-1 border rounded"
                  placeholder="الكمية"
                />
                <span className="text-sm text-gray-600">{material.unit}</span>
                <button
                  onClick={() => removeMaterial(material.id)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* المعدات المستخدمة */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          المعدات المستخدمة
        </h3>
        
        <textarea
          value={dailyLog.equipment.join('\n')}
          onChange={(e) => setDailyLog(prev => ({ 
            ...prev, 
            equipment: e.target.value.split('\n').filter(item => item.trim()) 
          }))}
          className="w-full p-3 border rounded-lg"
          rows="3"
          placeholder="اكتب كل معدة في سطر منفصل..."
        />
      </div>

      {/* الملاحظات والمشاكل */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          الملاحظات والمشاكل
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">المشاكل والتحديات</label>
            <textarea
              value={dailyLog.issues}
              onChange={(e) => setDailyLog(prev => ({ ...prev, issues: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              rows="3"
              placeholder="اذكر أي مشاكل واجهتها اليوم..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">حوادث السلامة</label>
            <textarea
              value={dailyLog.safetyIncidents}
              onChange={(e) => setDailyLog(prev => ({ ...prev, safetyIncidents: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              rows="2"
              placeholder="اذكر أي حوادث أو مخاطر تتعلق بالسلامة..."
            />
          </div>
        </div>
      </div>

      {/* سجل الزوار */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">سجل الزوار</h3>
          <button
            onClick={addVisitor}
            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            إضافة زائر
          </button>
        </div>
        
        {dailyLog.visitorsLog.length > 0 ? (
          <div className="space-y-2">
            {dailyLog.visitorsLog.map(visitor => (
              <div key={visitor.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <p className="font-medium">{visitor.name}</p>
                  <p className="text-sm text-gray-600">{visitor.purpose}</p>
                </div>
                <span className="text-sm text-gray-500">{visitor.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">لا يوجد زوار اليوم</p>
        )}
      </div>

      {/* خطة الغد */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">خطة عمل الغد</h3>
        
        <textarea
          value={dailyLog.tomorrowPlan}
          onChange={(e) => setDailyLog(prev => ({ ...prev, tomorrowPlan: e.target.value }))}
          className="w-full p-3 border rounded-lg"
          rows="4"
          placeholder="اكتب خطة العمل المتوقعة للغد..."
        />
      </div>

      {/* الصور */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Camera className="h-5 w-5" />
          صور التقدم اليومي
        </h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">اسحب الصور هنا أو انقر للاختيار</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
          >
            اختر الصور
          </label>
        </div>
      </div>

      {/* ملاحظات إضافية */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">ملاحظات إضافية</h3>
        
        <textarea
          value={dailyLog.additionalNotes}
          onChange={(e) => setDailyLog(prev => ({ ...prev, additionalNotes: e.target.value }))}
          className="w-full p-3 border rounded-lg"
          rows="4"
          placeholder="أي ملاحظات إضافية..."
        />
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2">
          <Download className="h-5 w-5" />
          تصدير PDF
        </button>
        <button
          onClick={saveDailyLog}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          حفظ السجل اليومي
        </button>
      </div>
    </div>
  );
};

export default DailyLogView;