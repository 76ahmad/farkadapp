import React from 'react';

const mockInvoices = [
  { number: 'INV-001', supplier: 'مؤسسة البناء الحديث', amount: 7000, status: 'مدفوعة', date: '2024-05-01' },
  { number: 'INV-002', supplier: 'شركة التوريد السريع', amount: 4000, status: 'قيد الدفع', date: '2024-05-10' },
  { number: 'INV-003', supplier: 'مؤسسة مواد الشرق', amount: 2500, status: 'مرفوضة', date: '2024-05-15' },
];

const InvoicesView = ({ onBack }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-orange-700 mb-6">قائمة الفواتير</h2>
    <table className="w-full border mb-4">
      <thead>
        <tr className="bg-orange-100">
          <th className="p-2">رقم الفاتورة</th>
          <th className="p-2">المورد</th>
          <th className="p-2">المبلغ (ر.س)</th>
          <th className="p-2">الحالة</th>
          <th className="p-2">التاريخ</th>
        </tr>
      </thead>
      <tbody>
        {mockInvoices.map((inv, i) => (
          <tr key={i} className="text-center border-b">
            <td className="p-2">{inv.number}</td>
            <td className="p-2">{inv.supplier}</td>
            <td className="p-2">{inv.amount.toLocaleString()}</td>
            <td className={`p-2 ${inv.status === 'مدفوعة' ? 'text-green-600' : inv.status === 'قيد الدفع' ? 'text-yellow-600' : 'text-red-600'}`}>{inv.status}</td>
            <td className="p-2">{inv.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={onBack} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">عودة</button>
  </div>
);

export default InvoicesView;