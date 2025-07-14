import React from 'react';

const mockSalaries = [
  { name: 'أحمد علي', role: 'عامل', salary: 3500 },
  { name: 'سارة محمد', role: 'مهندس', salary: 8000 },
  { name: 'خالد يوسف', role: 'مدير موقع', salary: 6000 },
];

const mockExpenses = [
  { item: 'مواد بناء', amount: 12000 },
  { item: 'معدات', amount: 5000 },
  { item: 'نقل', amount: 2000 },
];

const mockSuppliers = [
  { name: 'مؤسسة البناء الحديث', phone: '0501234567' },
  { name: 'شركة التوريد السريع', phone: '0509876543' },
];

const mockInvoices = [
  { number: 'INV-001', supplier: 'مؤسسة البناء الحديث', amount: 7000, status: 'مدفوعة' },
  { number: 'INV-002', supplier: 'شركة التوريد السريع', amount: 4000, status: 'قيد الدفع' },
];

const FinancialDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">لوحة تحكم الإدارة المالية</h1>
        {/* الرواتب */}
        <section>
          <h2 className="text-xl font-semibold text-orange-600 mb-2">الرواتب</h2>
          <table className="w-full border mb-4">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-2">الاسم</th>
                <th className="p-2">الوظيفة</th>
                <th className="p-2">الراتب (ر.س)</th>
              </tr>
            </thead>
            <tbody>
              {mockSalaries.map((s, i) => (
                <tr key={i} className="text-center border-b">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.role}</td>
                  <td className="p-2">{s.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {/* النفقات */}
        <section>
          <h2 className="text-xl font-semibold text-orange-600 mb-2">النفقات</h2>
          <ul className="list-disc pl-6">
            {mockExpenses.map((e, i) => (
              <li key={i} className="mb-1">{e.item}: <span className="font-bold">{e.amount.toLocaleString()} ر.س</span></li>
            ))}
          </ul>
        </section>
        {/* الموردين */}
        <section>
          <h2 className="text-xl font-semibold text-orange-600 mb-2">الموردين</h2>
          <ul className="list-disc pl-6">
            {mockSuppliers.map((s, i) => (
              <li key={i} className="mb-1">{s.name} - <span className="text-gray-500">{s.phone}</span></li>
            ))}
          </ul>
        </section>
        {/* الفواتير */}
        <section>
          <h2 className="text-xl font-semibold text-orange-600 mb-2">الفواتير</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-2">رقم الفاتورة</th>
                <th className="p-2">المورد</th>
                <th className="p-2">المبلغ (ر.س)</th>
                <th className="p-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((inv, i) => (
                <tr key={i} className="text-center border-b">
                  <td className="p-2">{inv.number}</td>
                  <td className="p-2">{inv.supplier}</td>
                  <td className="p-2">{inv.amount.toLocaleString()}</td>
                  <td className={`p-2 ${inv.status === 'مدفوعة' ? 'text-green-600' : 'text-yellow-600'}`}>{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default FinancialDashboard;