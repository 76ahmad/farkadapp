import React from 'react';

const WorkerDashboard = ({ workers, currentUser }) => {
  const currentWorker = workers.find(w => w.email === currentUser?.email) || workers[0];
  
  return (
    <div className="max-w-screen-md mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">مرحباً {currentWorker.name}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">الحالة الحالية</p>
            <p className={`text-lg font-bold ${
              currentWorker.status === 'حاضر' ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentWorker.status}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">المهام النشطة</p>
            <p className="text-lg font-bold text-blue-600">2</p>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            تسجيل حضور
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            تسجيل انصراف
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">مهامي</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <h4 className="font-medium">صب الخرسانة</h4>
              <p className="text-sm text-gray-600">موعد الانتهاء: 2024-06-16</p>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                قيد التنفيذ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;