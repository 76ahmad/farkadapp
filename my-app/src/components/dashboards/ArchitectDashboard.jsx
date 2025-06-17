import React from 'react';

const ArchitectDashboard = ({ plans }) => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold">لوحة تحكم المهندس المعماري</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <h3 className="text-sm font-semibold">المخططات المرفوعة</h3>
          <p className="text-2xl font-bold">{plans.length}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <h3 className="text-sm font-semibold">التعديلات المعتمدة</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-yellow-600 text-white p-4 rounded-lg">
          <h3 className="text-sm font-semibold">في الانتظار</h3>
          <p className="text-2xl font-bold">1</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">المخططات</h3>
        </div>
        <div className="p-4">
          {plans.map(plan => (
            <div key={plan.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{plan.name}</h4>
                  <p className="text-sm text-gray-600">النسخة: {plan.version}</p>
                  <p className="text-sm text-gray-600">تاريخ الرفع: {plan.uploadDate}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  {plan.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchitectDashboard;