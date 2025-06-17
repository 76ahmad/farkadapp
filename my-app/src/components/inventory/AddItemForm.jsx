import React, { useState } from 'react';

const AddItemForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'حديد',
    unit: '',
    currentStock: '',
    minStock: '',
    unitPrice: '',
    supplier: '',
    location: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.currentStock) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    const newItem = {
      id: Date.now(),
      ...formData,
      currentStock: parseFloat(formData.currentStock),
      minStock: parseFloat(formData.minStock) || 0,
      maxStock: parseFloat(formData.minStock) * 5 || 100,
      unitPrice: parseFloat(formData.unitPrice) || 0
    };

    onSubmit(newItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">إضافة مادة جديدة</h3>
        
        <div className="space-y-4">
          <input 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="اسم المادة *" 
            className="w-full p-2 border rounded" 
          />
          
          <select 
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="حديد">حديد</option>
            <option value="إسمنت">إسمنت</option>
            <option value="رمل">رمل</option>
            <option value="تشطيبات">تشطيبات</option>
            <option value="كهرباء">كهرباء</option>
            <option value="سباكة">سباكة</option>
            <option value="أدوات">أدوات</option>
            <option value="مواد عازلة">مواد عازلة</option>
          </select>

          <input 
            value={formData.unit}
            onChange={e => setFormData({...formData, unit: e.target.value})}
            placeholder="الوحدة (طن، كيس، متر...)" 
            className="w-full p-2 border rounded" 
          />

          <div className="grid grid-cols-2 gap-2">
            <input 
              type="number"
              value={formData.currentStock}
              onChange={e => setFormData({...formData, currentStock: e.target.value})}
              placeholder="الكمية الحالية *" 
              className="w-full p-2 border rounded" 
            />
            <input 
              type="number"
              value={formData.minStock}
              onChange={e => setFormData({...formData, minStock: e.target.value})}
              placeholder="الحد الأدنى" 
              className="w-full p-2 border rounded" 
            />
          </div>

          <input 
            type="number"
            step="0.01"
            value={formData.unitPrice}
            onChange={e => setFormData({...formData, unitPrice: e.target.value})}
            placeholder="سعر الوحدة (د.أ)" 
            className="w-full p-2 border rounded" 
          />

          <input 
            value={formData.supplier}
            onChange={e => setFormData({...formData, supplier: e.target.value})}
            placeholder="المورد" 
            className="w-full p-2 border rounded" 
          />

          <input 
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            placeholder="موقع التخزين" 
            className="w-full p-2 border rounded" 
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            إضافة
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;