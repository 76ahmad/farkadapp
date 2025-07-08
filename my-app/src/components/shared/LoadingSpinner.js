import React from 'react';

function LoadingSpinner({ message = 'جاري التحميل...', size = 'large' }) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-16 w-16',
    large: 'h-32 w-32'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Animated spinner */}
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${sizeClasses[size]}`}>
          <div className="sr-only">Loading...</div>
        </div>
        
        {/* Loading message */}
        <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
        
        {/* Additional loading indicators */}
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Progress bar simulation */}
        <div className="mt-6 w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">إعداد الاتصال مع قاعدة البيانات...</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;

