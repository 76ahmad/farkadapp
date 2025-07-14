import React, { useState } from 'react';
import SuppliersView from './SuppliersView';
import InvoicesView from './InvoicesView';

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

const FinancialDashboard = () => {
  const [view, setView] = useState('main');

  if (view === 'suppliers') return <SuppliersView onBack={() => setView('main')} />;
  if (view === 'invoices') return <InvoicesView onBack={() => setView('main')} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">لوحة تحكم الإدارة المالية</h1>
        <div className="flex gap-4 mb-8">
          <button onClick={() => setView('main')} className="px-4 py-2 rounded-lg font-semibold bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200">الرواتب</button>
          <button onClick={() => setView('expenses')} className="px-4 py-2 rounded-lg font-semibold bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200">النفقات</button>
          <button onClick={() => setView('suppliers')} className="px-4 py-2 rounded-lg font-semibold bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200">الموردين</button>
          <button onClick={() => setView('invoices')} className="px-4 py-2 rounded-lg font-semibold bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200">الفواتير</button>
        </div>
        {/* الرواتب */}
        {view === 'main' && (
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
        )}
        {/* النفقات */}
        {view === 'expenses' && (
          <section>
            <h2 className="text-xl font-semibold text-orange-600 mb-2">النفقات</h2>
            <ul className="list-disc pl-6">
              {mockExpenses.map((e, i) => (
                <li key={i} className="mb-1">{e.item}: <span className="font-bold">{e.amount.toLocaleString()} ر.س</span></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;