import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, Users, Plus, FileText, Search, Printer, FileSpreadsheet } from 'lucide-react';
import { getUserPermissions } from '../../utils/permissions';
import AddItemForm from './AddItemForm';
import InventoryLogView from './InventoryLogView';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const InventoryView = ({ inventory, setInventory, inventoryLog, addInventoryLog, currentUser }) => {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showInventoryLog, setShowInventoryLog] = useState(false);
  const permissions = getUserPermissions(currentUser?.type);
  // أضف هذه الأسطر الجديدة للبحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [sortBy, setSortBy] = useState('name');
  
  // الفئات المتاحة
  const categories = ['الكل', 'حديد', 'إسمنت', 'رمل', 'تشطيبات', 'كهرباء', 'سباكة', 'أدوات', 'مواد عازلة'];
  
// فلترة وترتيب المخزون
  const filteredInventory = inventory
    .filter(item => {
      // فلترة بالبحث
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // فلترة بالفئة
      const matchesCategory = filterCategory === 'الكل' || item.category === filterCategory;
      
      // فلترة بالحالة
      let matchesStatus = true;
      if (filterStatus === 'منخفض') {
        matchesStatus = item.currentStock <= item.minStock && item.currentStock > 0;
      } else if (filterStatus === 'نفد') {
        matchesStatus = item.currentStock === 0;
      } else if (filterStatus === 'طبيعي') {
        matchesStatus = item.currentStock > item.minStock;
      }
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      // ترتيب النتائج
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        case 'quantity':
          return a.currentStock - b.currentStock;
        case 'value':
          return (b.currentStock * b.unitPrice) - (a.currentStock * a.unitPrice);
        default:
          return 0;
      }
    });

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  // دالة تعديل الكمية مع سجل
  const adjustQuantity = (itemId, change, reason = '') => {
    if (!permissions.canEdit) {
      alert('ليس لديك صلاحية لتعديل الكميات');
      return;
    }

    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const previousStock = item.currentStock;
        const newStock = Math.max(0, item.currentStock + change);
        
        // إضافة السجل
        if (newStock !== previousStock) {
          const action = change > 0 ? 'إضافة' : 'استهلاك';
          const logReason = reason || (change > 0 ? 'إضافة للمخزون' : 'استهلاك من المخزون');
          addInventoryLog(itemId, item.name, action, Math.abs(change), previousStock, newStock, logReason);
        }
        
        return { ...item, currentStock: newStock };
      }
      return item;
    }));
  };

  // دالة حذف مادة مع سجل
  const deleteItem = (itemId) => {
    if (!permissions.canDelete) {
      alert('ليس لديك صلاحية لحذف المواد');
      return;
    }

    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    if (window.confirm(`هل أنت متأكد من حذف "${item.name}"؟\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      // إضافة سجل الحذف
      addInventoryLog(itemId, item.name, 'حذف', item.currentStock, item.currentStock, 0, 'حذف المادة من النظام');
      
      // حذف المادة
      setInventory(prev => prev.filter(item => item.id !== itemId));
    }
  };

  // دالة إضافة مادة جديدة
  const handleAddItem = (newItem) => {
    setInventory(prev => [...prev, newItem]);
    
    // إضافة سجل إنشاء المادة
    addInventoryLog(
      newItem.id, 
      newItem.name, 
      'إنشاء', 
      newItem.currentStock, 
      0, 
      newItem.currentStock, 
      'إضافة مادة جديدة للنظام'
    );

    setShowAddItemForm(false);
  };
const handlePrint = () => {
  // إنشاء نافذة طباعة جديدة
  const printWindow = window.open('', '_blank');
  
  // إنشاء محتوى الطباعة
  const printContent = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>تقرير المخزون - ${new Date().toLocaleDateString('ar-EG')}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          direction: rtl; 
          padding: 20px;
        }
        h1, h2 { text-align: center; color: #333; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: right; 
        }
        th { 
          background-color: #f2f2f2; 
          font-weight: bold; 
        }
        .low-stock { color: #dc2626; font-weight: bold; }
        .out-stock { color: #991b1b; font-weight: bold; }
        .normal-stock { color: #16a34a; }
        .summary { 
          margin: 20px 0; 
          padding: 15px; 
          background-color: #f8f9fa; 
          border-radius: 5px;
        }
        .footer { 
          margin-top: 30px; 
          text-align: center; 
          color: #666; 
        }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>منصة البناء الذكي</h1>
      <h2>تقرير المخزون - ${new Date().toLocaleDateString('ar-EG')}</h2>
      
      <div class="summary">
        <p><strong>إجمالي المواد:</strong> ${filteredInventory.length}</p>
        <p><strong>قيمة المخزون:</strong> ${totalValue.toLocaleString()} د.أ</p>
        <p><strong>مواد منخفضة:</strong> ${lowStockItems.length}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>اسم المادة</th>
            <th>الفئة</th>
            <th>الكمية</th>
            <th>الوحدة</th>
            <th>الحد الأدنى</th>
            <th>سعر الوحدة</th>
            <th>القيمة الإجمالية</th>
            <th>المورد</th>
            <th>الموقع</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${filteredInventory.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.name}</td>
              <td>${item.category}</td>
              <td class="${
                item.currentStock === 0 ? 'out-stock' : 
                item.currentStock <= item.minStock ? 'low-stock' : 
                'normal-stock'
              }">${item.currentStock}</td>
              <td>${item.unit}</td>
              <td>${item.minStock}</td>
              <td>${item.unitPrice} د.أ</td>
              <td>${(item.currentStock * item.unitPrice).toLocaleString()} د.أ</td>
              <td>${item.supplier}</td>
              <td>${item.location}</td>
              <td>${
                item.currentStock === 0 ? 'نفد' :
                item.currentStock <= item.minStock ? 'منخفض' : 
                'طبيعي'
              }</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="font-weight: bold;">
            <td colspan="7">المجموع</td>
            <td>${totalValue.toLocaleString()} د.أ</td>
            <td colspan="3"></td>
          </tr>
        </tfoot>
      </table>
      
      <div class="footer">
        <p>تم الطباعة بواسطة: ${currentUser?.displayName}</p>
        <p>التاريخ والوقت: ${new Date().toLocaleString('ar-EG')}</p>
      </div>
    </body>
    </html>
  `;
  
  // كتابة المحتوى وطباعته
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // انتظار تحميل المحتوى ثم طباعة
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
};

const handleExportExcel = () => {
  // تحضير البيانات للتصدير
  const exportData = filteredInventory.map((item, index) => ({
    'الرقم': index + 1,
    'اسم المادة': item.name,
    'الفئة': item.category,
    'الكمية الحالية': item.currentStock,
    'الوحدة': item.unit,
    'الحد الأدنى': item.minStock,
    'الحد الأقصى': item.maxStock,
    'سعر الوحدة': item.unitPrice,
    'القيمة الإجمالية': item.currentStock * item.unitPrice,
    'المورد': item.supplier,
    'موقع التخزين': item.location,
    'الحالة': item.currentStock === 0 ? 'نفد' :
              item.currentStock <= item.minStock ? 'منخفض' : 
              'طبيعي'
  }));
  
  // إضافة صف المجموع
  exportData.push({
    'الرقم': '',
    'اسم المادة': 'المجموع الكلي',
    'الفئة': '',
    'الكمية الحالية': '',
    'الوحدة': '',
    'الحد الأدنى': '',
    'الحد الأقصى': '',
    'سعر الوحدة': '',
    'القيمة الإجمالية': totalValue,
    'المورد': '',
    'موقع التخزين': '',
    'الحالة': ''
  });
  
  // إنشاء ورقة عمل
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // تنسيق عرض الأعمدة
  const colWidths = [
    { wch: 8 },  // الرقم
    { wch: 25 }, // اسم المادة
    { wch: 15 }, // الفئة
    { wch: 12 }, // الكمية
    { wch: 10 }, // الوحدة
    { wch: 12 }, // الحد الأدنى
    { wch: 12 }, // الحد الأقصى
    { wch: 12 }, // سعر الوحدة
    { wch: 15 }, // القيمة
    { wch: 20 }, // المورد
    { wch: 20 }, // الموقع
    { wch: 10 }  // الحالة
  ];
  ws['!cols'] = colWidths;
  
  // إنشاء الملف
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'المخزون');
  
  // حفظ الملف
  const fileName = `تقرير_المخزون_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(wb, fileName);
};


  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      {/* عرض الصلاحيات */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-800">صلاحياتك في المخزون</h4>
            <p className="text-sm text-blue-600">الدور: {permissions.role}</p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className={`px-2 py-1 rounded ${permissions.canView ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {permissions.canView ? '✓ عرض' : '✗ عرض'}
            </span>
            <span className={`px-2 py-1 rounded ${permissions.canAdd ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {permissions.canAdd ? '✓ إضافة' : '✗ إضافة'}
            </span>
            <span className={`px-2 py-1 rounded ${permissions.canEdit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {permissions.canEdit ? '✓ تعديل' : '✗ تعديل'}
            </span>
            <span className={`px-2 py-1 rounded ${permissions.canDelete ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {permissions.canDelete ? '✓ حذف' : '✗ حذف'}
            </span>
          </div>
        </div>
      </div>

      {!permissions.canView ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-bold text-red-800 mb-2">غير مصرح لك بالوصول</h3>
          <p className="text-red-600">ليس لديك صلاحية لعرض المخزون</p>
        </div>
      ) : (
        <>
          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">إجمالي المواد</h3>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <Package className="h-8 w-8" />
              </div>
            </div>
            <div className="bg-red-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">مواد منخفضة المخزون</h3>
                  <p className="text-2xl font-bold">{lowStockItems.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8" />
              </div>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">قيمة المخزون</h3>
                  <p className="text-xl font-bold">{totalValue.toLocaleString()} د.أ</p>
                </div>
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
            <div className="bg-purple-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">حركات اليوم</h3>
                  <p className="text-xl font-bold">
                    {inventoryLog.filter(log => log.date === new Date().toLocaleDateString('ar-EG')).length}
                  </p>
                </div>
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>

         {/* قسم البحث والفلترة */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">بحث وفلترة</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* صندوق البحث */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث بالاسم، المورد، الموقع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 border rounded"
                />
                <Search className="absolute right-2 top-3 h-4 w-4 text-gray-400" />
              </div>
              
              {/* فلترة بالفئة */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              {/* فلترة بالحالة */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="الكل">كل الحالات</option>
                <option value="طبيعي">طبيعي</option>
                <option value="منخفض">منخفض</option>
                <option value="نفد">نفد</option>
              </select>
              
              {/* ترتيب حسب */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="name">الاسم</option>
                <option value="quantity">الكمية</option>
                <option value="value">القيمة</option>
              </select>
            </div>
            
            {/* عدد النتائج */}
            <div className="mt-4 text-sm text-gray-600">
              عرض {filteredInventory.length} من أصل {inventory.length} مادة
              {searchTerm && ` - نتائج البحث عن "${searchTerm}"`}
            </div>
          </div>
          {/* المخزون */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">إدارة المخزون</h3>
                <p className="text-sm text-gray-600">
                  {permissions.canEdit ? 'استخدم الأزرار + و - لتعديل الكميات' : 'عرض فقط - ليس لديك صلاحية تعديل'}
                </p>
              </div>
<div className="flex gap-2 flex-wrap">
  {/* زر الطباعة */}
  <button 
    onClick={handlePrint}
    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
  >
    <Printer className="h-4 w-4" />
    طباعة
  </button>
  
  {/* زر تصدير Excel */}
  <button 
    onClick={handleExportExcel}
    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2"
  >
    <FileSpreadsheet className="h-4 w-4" />
    تصدير Excel
  </button>
  
  {permissions.canViewLog && (
    <button 
      onClick={() => setShowInventoryLog(true)}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      سجل الحركات
    </button>
  )}
  {permissions.canAdd && (
    <button 
      onClick={() => setShowAddItemForm(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      إضافة مادة
    </button>
  )}
</div>
            </div>

            {/* تنبيه المخزون المنخفض */}
            {lowStockItems.length > 0 && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800">تنبيه: مواد منخفضة المخزون</h4>
                </div>
                <div className="text-sm text-red-700">
                  {lowStockItems.map(item => (
                    <span key={item.id} className="inline-block bg-red-100 px-2 py-1 rounded mr-2 mb-1">
                      {item.name} ({item.currentStock} {item.unit})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* جدول المخزون */}
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-right">المادة</th>
                      <th className="p-3 text-right">الفئة</th>
                      <th className="p-3 text-right">الكمية</th>
                      {permissions.canEdit && <th className="p-3 text-right">التحكم</th>}
                      <th className="p-3 text-right">الحد الأدنى</th>
                      <th className="p-3 text-right">سعر الوحدة</th>
                      <th className="p-3 text-right">القيمة الإجمالية</th>
                      <th className="p-3 text-right">المورد</th>
                      <th className="p-3 text-right">الحالة</th>
                      {(permissions.canEdit || permissions.canDelete) && <th className="p-3 text-right">إجراءات</th>}
                    </tr>
                  </thead>
                  <tbody>
                   {filteredInventory.map(item => (
                      <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.location}</p>
                          </div>
                        </td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3">
                          <span className={`font-medium ${item.currentStock <= item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                            {item.currentStock} {item.unit}
                          </span>
                        </td>
                        {permissions.canEdit && (
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => adjustQuantity(item.id, -1, 'تقليل يدوي')}
                                className="w-7 h-7 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 text-lg font-bold"
                                title="تقليل الكمية"
                              >
                                −
                              </button>
                              <span className="mx-2 font-medium min-w-[30px] text-center">
                                {item.currentStock}
                              </span>
                              <button 
                                onClick={() => adjustQuantity(item.id, 1, 'إضافة يدوية')}
                                className="w-7 h-7 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 text-lg font-bold"
                                title="زيادة الكمية"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        )}
                        <td className="p-3">{item.minStock} {item.unit}</td>
                        <td className="p-3">{item.unitPrice} د.أ</td>
                        <td className="p-3 font-medium">{(item.currentStock * item.unitPrice).toLocaleString()} د.أ</td>
                        <td className="p-3">{item.supplier}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.currentStock === 0 ? 'bg-gray-100 text-gray-700' :
                            item.currentStock <= item.minStock ? 'bg-red-100 text-red-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.currentStock === 0 ? 'نفد' :
                             item.currentStock <= item.minStock ? 'منخفض' : 'طبيعي'}
                          </span>
                        </td>
                        {(permissions.canEdit || permissions.canDelete) && (
                          <td className="p-3">
                            <div className="flex gap-1">
                              {permissions.canEdit && (
                                <button 
                                  onClick={() => adjustQuantity(item.id, 10, 'إضافة سريعة +10')}
                                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                  title="إضافة 10"
                                >
                                  +10
                                </button>
                              )}
                              {permissions.canDelete && (
                                <button 
                                  onClick={() => deleteItem(item.id)}
                                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  title="حذف المادة"
                                >
                                  🗑
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {showAddItemForm && permissions.canAdd && (
        <AddItemForm 
          onClose={() => setShowAddItemForm(false)}
          onSubmit={handleAddItem}
        />
      )}
      
      {showInventoryLog && permissions.canViewLog && (
        <InventoryLogView 
          inventoryLog={inventoryLog}
          onClose={() => setShowInventoryLog(false)}
        />
      )}
    </div>
  );
};

export default InventoryView;