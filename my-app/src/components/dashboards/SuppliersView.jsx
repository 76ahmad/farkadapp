import React from 'react';

const mockSuppliers = [
  { name: 'مؤسسة البناء الحديث', phone: '0501234567', email: 'info@modernbuild.com' },
  { name: 'شركة التوريد السريع', phone: '0509876543', email: 'fast@supply.com' },
  { name: 'مؤسسة مواد الشرق', phone: '0505555555', email: 'east@materials.com' },
];

const SuppliersView = ({ onBack }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-orange-700 mb-6">قائمة الموردين</h2>
    <table className="w-full border mb-4">
      <thead>
        <tr className="bg-orange-100">
          <th className="p-2">الاسم</th>
          <th className="p-2">رقم الجوال</th>
          <th className="p-2">البريد الإلكتروني</th>
        </tr>
      </thead>
      <tbody>
        {mockSuppliers.map((s, i) => (
          <tr key={i} className="text-center border-b">
            <td className="p-2">{s.name}</td>
            <td className="p-2">{s.phone}</td>
            <td className="p-2">{s.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={onBack} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">عودة</button>
  </div>
);

export default SuppliersView;