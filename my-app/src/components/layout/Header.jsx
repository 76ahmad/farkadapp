import React from 'react';
import { 
  Building, LogOut, Package, CheckSquare, User, Users, 
  FileText, Calendar, FolderOpen, HelpCircle, BarChart3,
  Wifi, WifiOff, AlertCircle
} from 'lucide-react';

const Header = ({ 
  currentUser, 
  currentView,
  setCurrentView, 
  onLogout, 
  connectionStatus,
  lowStockCount = 0,
  onGoToFinancialDashboard,
  onGoToAIInsights
}) => {
  
  const getConnectionIcon = () => {
    switch(connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-600" />;
      case 'connecting':
        return <div className="h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConnectionText = () => {
    switch(connectionStatus) {
      case 'connected': return 'متصل';
      case 'connecting': return 'جاري الاتصال';
      case 'error': return 'خطأ في الاتصال';
      default: return 'غير معروف';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md px-6 py-4 flex justify-between items-center z-40">
      <div className="flex items-center gap-3">
        <Building className="text-blue-600 h-8 w-8" />
        <div>
          <h1 className="text-xl font-bold">منصة البناء الذكي</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>{currentUser?.displayName}</span>
            <div className="flex items-center gap-1" title={`حالة الاتصال: ${getConnectionText()}`}>
              {getConnectionIcon()}
              <span className="hidden sm:inline">{getConnectionText()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="flex gap-4 text-sm">
        <button 
          onClick={() => setCurrentView('dashboard')} 
          className={`hover:text-blue-600 transition-colors ${currentView === 'dashboard' ? 'text-blue-600 font-semibold' : ''}`}
        >
          الرئيسية
        </button>
        
        {/* للمقاول */}
        {currentUser?.type === 'contractor' && (
          <>
            <button 
              onClick={() => setCurrentView('projects')} 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'projects' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <FolderOpen className="h-4 w-4" />
              المشاريع
            </button>
            
            <button 
              onClick={() => setCurrentView('weekly-tasks')} 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'weekly-tasks' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <Calendar className="h-4 w-4" />
              المهام الأسبوعية
            </button>

            <button 
              onClick={() => setCurrentView('support-requests')} 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'support-requests' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <HelpCircle className="h-4 w-4" />
              طلبات الدعم
            </button>
          </>
        )}
        
        {/* لمدير الموقع */}
        {currentUser?.type === 'site_manager' && (
          <>
            <button 
              onClick={() => setCurrentView('task-distribution')} 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'task-distribution' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <CheckSquare className="h-4 w-4" />
              توزيع المهام
            </button>
            
            <button 
              onClick={() => setCurrentView('daily-log')} 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'daily-log' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <FileText className="h-4 w-4" />
              التقرير اليومي
            </button>

            <button 
              onClick={() => setCurrentView('support-requests')} 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'support-requests' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <HelpCircle className="h-4 w-4" />
              طلبات الدعم
            </button>
          </>
        )}
        
        {/* للعامل */}
        {currentUser?.type === 'worker' && (
          <>
            <button 
              onClick={() => setCurrentView('tasks')} 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'tasks' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <CheckSquare className="h-4 w-4" />
              مهامي
            </button>
          </>
        )}

        {/* للمعماري */}
        {currentUser?.type === 'architect' && (
          <>
            <button 
              onClick={() => setCurrentView('projects')} 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'projects' ? 'text-blue-600 font-semibold' : ''}`}
            >
              <FolderOpen className="h-4 w-4" />
              المشاريع
            </button>
          </>
        )}
        
        {/* للجميع */}
        <button 
          onClick={() => setCurrentView('inventory')} 
          className={`hover:text-blue-600 transition-colors flex items-center gap-1 relative ${currentView === 'inventory' ? 'text-blue-600 font-semibold' : ''}`}
        >
          <Package className="h-4 w-4" />
          المخزون
          {lowStockCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {lowStockCount}
            </span>
          )}
        </button>
        {/* زر الإدارة المالية */}
        {/* تم الحذف بناءً على طلب المستخدم */}
        {/* زر الذكاء الاصطناعي */}
        {onGoToAIInsights && (
          <button 
            onClick={onGoToAIInsights} 
            className={`hover:text-indigo-600 transition-colors flex items-center gap-1 ${currentView === 'ai' ? 'text-indigo-600 font-semibold' : ''}`}
          >
            <BarChart3 className="h-4 w-4" />
            الذكاء الاصطناعي
          </button>
        )}
        <button 
          onClick={() => setCurrentView('workers')} 
          className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'workers' ? 'text-blue-600 font-semibold' : ''}`}
        >
          <Users className="h-4 w-4" />
          العمال
        </button>
        
        <button 
          onClick={() => setCurrentView('statistics')} 
          className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'statistics' ? 'text-blue-600 font-semibold' : ''}`}
        >
          <BarChart3 className="h-4 w-4" />
          الإحصائيات
        </button>
        
        <button 
          onClick={() => setCurrentView('profile')} 
          className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${currentView === 'profile' ? 'text-blue-600 font-semibold' : ''}`}
        >
          <User className="h-4 w-4" />
          الملف الشخصي
        </button>
      </nav>
      
      <button 
        onClick={onLogout}
        className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">تسجيل الخروج</span>
      </button>
    </header>
  );
};

export default Header;

