import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            منصة البناء الذكي
          </h1>
          <p className="text-gray-600 mb-6">
            نظام إدارة شامل لصناعة البناء
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              التطبيق يعمل بنجاح! 🎉
            </p>
            <button className="btn-primary w-full">
              ابدأ الاستخدام
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;