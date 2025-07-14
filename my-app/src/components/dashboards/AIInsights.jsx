import React from 'react';

const AIInsights = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center max-w-lg">
        <div className="mb-6 animate-bounce">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="7" width="20" height="10" rx="5" fill="#6366F1"/>
            <rect x="7" y="2" width="10" height="5" rx="2.5" fill="#A5B4FC"/>
            <circle cx="8.5" cy="12" r="1.5" fill="#fff"/>
            <circle cx="15.5" cy="12" r="1.5" fill="#fff"/>
            <rect x="10" y="15" width="4" height="2" rx="1" fill="#6366F1"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">ذكاء اصطناعي - قريبًا!</h1>
        <p className="text-lg text-gray-600 mb-2 text-center">سيتم قريبًا تفعيل ميزات الذكاء الاصطناعي لتحليل الأداء، توليد التقارير، وتوقع المخاطر والتأخيرات بشكل تلقائي.</p>
        <div className="mt-6 text-indigo-400 font-semibold">تابعنا لمزيد من التحديثات الذكية!</div>
      </div>
    </div>
  );
};

export default AIInsights;