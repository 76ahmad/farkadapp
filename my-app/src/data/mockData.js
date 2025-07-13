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
    title: 'مخطط الطابق الأرضي',
    description: 'مخطط معماري للطابق الأرضي مع تفاصيل الغرف والمرافق',
    category: 'architectural',
    version: '1.2',
    architect: 'م. أحمد محمد',
    uploadDate: '2024-06-10',
    status: 'active',
    fileUrl: 'https://example.com/plans/ground-floor-plan.pdf'
  },
  {
    id: 2,
    title: 'مخطط الهيكل الإنشائي',
    description: 'مخطط تفصيلي للهيكل الإنشائي والأعمدة والجسور',
    category: 'structural',
    version: '2.1',
    architect: 'م. سارة علي',
    uploadDate: '2024-06-08',
    status: 'active',
    fileUrl: 'https://example.com/plans/structural-plan.pdf'
  },
  {
    id: 3,
    title: 'مخطط التمديدات الكهربائية',
    description: 'مخطط شامل للتمديدات الكهربائية والمفاتيح والمقابس',
    category: 'electrical',
    version: '1.0',
    architect: 'م. محمد حسن',
    uploadDate: '2024-06-05',
    status: 'active',
    fileUrl: 'https://example.com/plans/electrical-plan.pdf'
  },
  {
    id: 4,
    title: 'مخطط شبكة المياه',
    description: 'مخطط تفصيلي لشبكة المياه والصرف الصحي',
    category: 'plumbing',
    version: '1.1',
    architect: 'م. فاطمة أحمد',
    uploadDate: '2024-06-03',
    status: 'active',
    fileUrl: 'https://example.com/plans/plumbing-plan.pdf'
  }
];

export const mockMeetings = [
  {
    id: 1,
    title: 'اجتماع مراجعة التقدم الأسبوعي',
    description: 'مراجعة التقدم المحرز في المشروع ومناقشة الخطط للأسبوع القادم',
    date: '2024-06-20',
    time: '09:00',
    location: 'مكتب الموقع',
    attendees: ['المقاول', 'مدير الموقع', 'المعماري'],
    agenda: '1. مراجعة التقدم المحرز\n2. مناقشة المشاكل والتحديات\n3. تخطيط الأسبوع القادم\n4. مراجعة الميزانية',
    status: 'scheduled'
  },
  {
    id: 2,
    title: 'اجتماع مع العميل',
    description: 'اجتماع مع العميل لمراجعة التصميم النهائي والحصول على الموافقة',
    date: '2024-06-18',
    time: '14:00',
    location: 'مكتب العميل',
    attendees: ['المقاول', 'المعماري', 'العميل'],
    agenda: '1. عرض التصميم النهائي\n2. مناقشة التعديلات المطلوبة\n3. الموافقة على التصميم\n4. تحديد موعد البدء',
    status: 'completed'
  },
  {
    id: 3,
    title: 'اجتماع فريق العمل',
    description: 'اجتماع دوري مع فريق العمل لمناقشة المهام والتحديات',
    date: '2024-06-22',
    time: '08:00',
    location: 'موقع المشروع',
    attendees: ['مدير الموقع', 'العمال', 'المشرفون'],
    agenda: '1. توزيع المهام اليومية\n2. مراجعة السلامة\n3. مناقشة المشاكل الفنية\n4. تخطيط العمل',
    status: 'scheduled'
  },
  {
    id: 4,
    title: 'اجتماع الموردين',
    description: 'اجتماع مع الموردين لمناقشة الأسعار والمواصفات',
    date: '2024-06-15',
    time: '11:00',
    location: 'مكتب المقاول',
    attendees: ['المقاول', 'مدير المشتريات', 'الموردون'],
    agenda: '1. مراجعة الأسعار\n2. مناقشة المواصفات\n3. تحديد مواعيد التوريد\n4. توقيع العقود',
    status: 'completed'
  }
];