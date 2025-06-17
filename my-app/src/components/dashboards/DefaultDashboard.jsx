import React from 'react';

const DefaultDashboard = ({ currentUser }) => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold">لوحة تحكم {currentUser?.displayName}</h2>
      <p className="text-gray-600 mt-2">مرحباً بك في منصة البناء الذكي</p>
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <p className="text-sm text-green-600">✅ المنصة تعمل بشكل طبيعي</p>
        <p className="text-sm text-gray-600">المستخدم: {currentUser?.email}</p>
        <p className="text-sm text-gray-600">النوع: {currentUser?.displayName}</p>
      </div>
    </div>
  );
};

export default DefaultDashboard;