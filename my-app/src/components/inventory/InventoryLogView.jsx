import React from 'react';

const InventoryLogView = ({ inventoryLog, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">سجل حركات المخزون</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-3 text-right">التاريخ والوقت</th>
                <th className="p-3 text-right">المادة</th>
                <th className="p-3 text-right">العملية</th>
                <th className="p-3 text-right">الكمية</th>
                <th className="p-3 text-right">المخزون السابق</th>
                <th className="p-3 text-right">المخزون الجديد</th>
                <th className="p-3 text-right">السبب</th>
                <th className="p-3 text-right">المستخدم</th>
              </tr>
            </thead>
            <tbody>
              {inventoryLog.map(log => (
                <tr key={log.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="text-sm">
                      <div>{log.date}</div>
                      <div className="text-gray-500">{log.time}</div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{log.itemName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.action === 'إضافة' ? 'bg-green-100 text-green-700' :
                      log.action === 'استهلاك' ? 'bg-red-100 text-red-700' :
                      log.action === 'حذف' ? 'bg-gray-100 text-gray-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${
                      log.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {log.quantity > 0 ? '+' : ''}{log.quantity}
                    </span>
                  </td>
                  <td className="p-3">{log.previousStock}</td>
                  <td className="p-3 font-medium">{log.newStock}</td>
                  <td className="p-3 text-gray-600">{log.reason}</td>
                  <td className="p-3">{log.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryLogView;