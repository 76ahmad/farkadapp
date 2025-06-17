export const mockProjects = [
  {
    id: 1,
    name: 'مشروع فيلا الأحمد',
    status: 'نشط',
    progress: 65,
    location: 'عمان - الجبيهة',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    budget: 150000
  }
];

export const mockInventory = [
  {
    id: 1,
    name: 'حديد تسليح 12مم',
    category: 'حديد',
    unit: 'طن',
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    unitPrice: 650,
    supplier: 'شركة الحديد الأردنية',
    location: 'مخزن الموقع الرئيسي'
  },
  {
    id: 2,
    name: 'بلاط سيراميك',
    category: 'تشطيبات',
    unit: 'متر مربع',
    currentStock: 3,
    minStock: 20,
    maxStock: 200,
    unitPrice: 25,
    supplier: 'معارض السيراميك',
    location: 'مخزن التشطيبات'
  }
];

export const mockInventoryLog = [
  {
    id: 1,
    itemId: 1,
    itemName: 'حديد تسليح 12مم',
    action: 'إضافة',
    quantity: 5,
    previousStock: 10,
    newStock: 15,
    reason: 'شراء جديد',
    user: 'المقاول',
    date: '2024-06-15',
    time: '10:30'
  },
  {
    id: 2,
    itemId: 2,
    itemName: 'بلاط سيراميك',
    action: 'استهلاك',
    quantity: -2,
    previousStock: 5,
    newStock: 3,
    reason: 'استخدام في المشروع',
    user: 'مدير الموقع',
    date: '2024-06-14',
    time: '14:20'
  }
];

export const mockWorkers = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'عامل بناء',
    phone: '0791234567',
    status: 'حاضر',
    email: 'worker1@example.com'
  },
  {
    id: 2,
    name: 'محمد علي',
    role: 'كهربائي',
    phone: '0797654321',
    status: 'غائب',
    email: 'worker2@example.com'
  }
];

export const mockPlans = [
  {
    id: 1,
    name: 'مخطط الطابق الأرضي',
    version: '1.2',
    uploadDate: '2024-06-10',
    status: 'معتمد'
  }
];