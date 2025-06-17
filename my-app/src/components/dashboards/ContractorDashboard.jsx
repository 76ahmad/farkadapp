import React from 'react';
import { AlertTriangle, CheckSquare } from 'lucide-react';

const ContractorDashboard = ({ projects, inventory }) => {
  const activeProjects = projects.filter(p => p.status === 'نشط').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock).length;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold">لوحة تحكم المقاول</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold">المشاريع النشطة</h3>
          <p className="text-2xl font-bold">{activeProjects}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold">إجمالي الميزانيات</h3>
          <p className="text-xl font-bold">{totalBudget.toLocaleString()} د.أ</p>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold">تنبيهات المخزون</h3>
          <p className="text-2xl font-bold">{lowStockItems}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">المشاريع الحالية</h3>
          </div>
          <div className="p-4">
            {projects.map(project => (
              <div key={project.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{project.name}</h4>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">📍 {project.location}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">التنبيهات</h3>
          </div>
          <div className="p-4 space-y-3">
            {lowStockItems > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm">يوجد {lowStockItems} مواد منخفضة المخزون</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded border-l-4 border-green-400">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <span className="text-sm">المنصة تعمل بشكل طبيعي</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;