// DatabaseTest.js - مكون لاختبار قاعدة البيانات
import React, { useState, useEffect } from 'react';
import { testDatabaseConnection, getDatabaseInfo } from '../services/databaseService';

const DatabaseTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [dbInfo, setDbInfo] = useState(null);

  useEffect(() => {
    // الحصول على معلومات قاعدة البيانات عند تحميل المكون
    setDbInfo(getDatabaseInfo());
  }, []);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const result = await testDatabaseConnection();
      setTestResult({
        success: result,
        message: result ? '✅ الاتصال ناجح' : '❌ فشل الاتصال',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ خطأ في الاتصال: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (success) => {
    return success ? '✅' : '❌';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">اختبار قاعدة البيانات</h2>
      
      {/* معلومات قاعدة البيانات */}
      {dbInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">معلومات قاعدة البيانات</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">قاعدة البيانات النشطة:</span>
              <span className={`font-bold ${dbInfo.activeDatabase === 'supabase' ? 'text-blue-600' : 'text-orange-600'}`}>
                {dbInfo.activeDatabase === 'supabase' ? 'Supabase' : 'Firebase'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Supabase مفعل:</span>
              <span className={dbInfo.configuration.useSupabase ? 'text-green-600' : 'text-red-600'}>
                {dbInfo.configuration.useSupabase ? 'نعم' : 'لا'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Firebase مفعل:</span>
              <span className={dbInfo.configuration.useFirebase ? 'text-green-600' : 'text-red-600'}>
                {dbInfo.configuration.useFirebase ? 'نعم' : 'لا'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Supabase مُعد:</span>
              <span className={dbInfo.configuration.isConfigured ? 'text-green-600' : 'text-red-600'}>
                {dbInfo.configuration.isConfigured ? 'نعم' : 'لا'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* زر اختبار الاتصال */}
      <div className="mb-6">
        <button
          onClick={handleTestConnection}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? '🔄 جاري الاختبار...' : '🔍 اختبار الاتصال'}
        </button>
      </div>

      {/* نتيجة الاختبار */}
      {testResult && (
        <div className={`p-4 rounded-lg border ${
          testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">{getStatusIcon(testResult.success)}</span>
            <h3 className={`font-semibold ${getStatusColor(testResult.success)}`}>
              نتيجة اختبار الاتصال
            </h3>
          </div>
          <p className={`${getStatusColor(testResult.success)} mb-2`}>
            {testResult.message}
          </p>
          <p className="text-xs text-gray-500">
            الوقت: {new Date(testResult.timestamp).toLocaleString('ar-SA')}
          </p>
        </div>
      )}

      {/* تعليمات الإعداد */}
      {dbInfo && !dbInfo.configuration.isConfigured && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800">⚠️ إعداد مطلوب</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>لتفعيل Supabase، اتبع هذه الخطوات:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>اذهب إلى <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
              <li>أنشئ مشروع جديد أو اختر مشروع موجود</li>
              <li>اذهب إلى Settings > API</li>
              <li>انسخ Project URL و Anon Key</li>
              <li>حدث ملف .env بالقيم الجديدة</li>
              <li>أعد تشغيل التطبيق</li>
            </ol>
          </div>
        </div>
      )}

      {/* معلومات إضافية */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">ℹ️ معلومات إضافية</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>• يمكنك التبديل بين Firebase و Supabase من خلال متغيرات البيئة</p>
          <p>• في حالة فشل Supabase، سيتم استخدام Firebase تلقائياً</p>
          <p>• تأكد من تنفيذ مخطط قاعدة البيانات في Supabase SQL Editor</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;