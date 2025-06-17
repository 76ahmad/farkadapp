import React from 'react';
import { 
  Building, LogOut, Package, CheckSquare, User, Users, 
  FileText, Calendar, FolderOpen 
} from 'lucide-react';

const Header = ({ currentUser, onViewChange, onLogout, lowStockCount }) => {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Building className="text-blue-600" />
        <div>
          <h1 className="text-xl font-bold">منصة البناء الذكي</h1>
          <p className="text-sm text-gray-600">{currentUser?.displayName}</p>
        </div>
      </div>
      
      <div className="flex gap-4 text-sm">
        <button 
          onClick={() => onViewChange('dashboard')} 
          className="hover:underline"
        >
          الرئيسية
        </button>
        
        {/* للمقاول */}
        {currentUser?.type === 'contractor' && (
          <>
            <button 
              onClick={() => onViewChange('projects')} 
              className="hover:underline flex items-center gap-1"
            >
              <FolderOpen className="h-4 w-4" />
              المشاريع
            </button>
            
            <button 
              onClick={() => onViewChange('tasks')} 
              className="hover:underline flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              المهام الأسبوعية
            </button>
          </>
        )}
        
        {/* لمدير الموقع */}
        {currentUser?.type === 'site_manager' && (
          <>
            <button 
              onClick={() => onViewChange('inventory')} 
              className="hover:underline flex items-center gap-1"
            >
              <Package className="h-4 w-4" />
              المخزون
              {lowStockCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1">
                  {lowStockCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => onViewChange('workers')} 
              className="hover:underline flex items-center gap-1"
            >
              <Users className="h-4 w-4" />
              العمال
            </button>
            
            <button 
              onClick={() => onViewChange('tasks')} 
              className="hover:underline flex items-center gap-1"
            >
              <CheckSquare className="h-4 w-4" />
              المهام
            </button>
            
            <button 
              onClick={() => onViewChange('daily-log')} 
              className="hover:underline flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              السجل اليومي
            </button>
          </>
        )}
        
        {/* للعامل */}
        {currentUser?.type === 'worker' && (
          <button 
            onClick={() => onViewChange('tasks')} 
            className="hover:underline flex items-center gap-1"
          >
            <CheckSquare className="h-4 w-4" />
            مهامي
          </button>
        )}
        
        {/* للجميع */}
        <button 
          onClick={() => onViewChange('statistics')} 
          className="hover:underline flex items-center gap-1"
        >
          📊 الإحصائيات
        </button>
        
        <button 
          onClick={() => onViewChange('profile')} 
          className="hover:underline flex items-center gap-1"
        >
          <User className="h-4 w-4" />
          الملف الشخصي
        </button>
        
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 text-gray-600 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" /> خروج
        </button>
      </div>
    </header>
  );
};

export default Header;