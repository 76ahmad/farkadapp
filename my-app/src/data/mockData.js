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
    projectId: 1,
    projectName: 'فيلا الأحمد',
    version: '1.0',
    category: 'مخطط معماري',
    status: 'معتمد',
    uploadDate: '2024-01-15',
    uploadedBy: 'المهندس المعماري',
    description: 'مخطط تفصيلي للطابق الأرضي',
    fileName: 'ground_floor_plan.pdf',
    fileSize: 2048576,
    fileType: 'application/pdf',
    modifications: []
  },
  {
    id: 2,
    name: 'مخطط الطابق الأول',
    projectId: 1,
    projectName: 'فيلا الأحمد',
    version: '2.1',
    category: 'مخطط معماري',
    status: 'قيد المراجعة',
    uploadDate: '2024-01-20',
    uploadedBy: 'المهندس المعماري',
    description: 'مخطط محدث للطابق الأول',
    fileName: 'first_floor_plan_v2.pdf',
    fileSize: 1536000,
    fileType: 'application/pdf',
    modifications: [
      {
        title: 'تعديل غرفة النوم الرئيسية',
        description: 'تم تغيير أبعاد غرفة النوم الرئيسية',
        type: 'تعديل بسيط',
        date: '2024-01-18T10:30:00Z',
        modifiedBy: 'المهندس المعماري'
      }
    ]
  }
];

export const mockMeetings = [
  {
    id: 1,
    title: 'اجتماع مراجعة التصميم',
    projectId: 1,
    projectName: 'فيلا الأحمد',
    date: '2024-01-25',
    startTime: '09:00',
    endTime: '10:30',
    type: 'اجتماع مراجعة',
    location: 'مكتب المهندس المعماري',
    description: 'مراجعة التصميم النهائي مع العميل',
    agenda: '1. مراجعة المخططات النهائية\n2. مناقشة التعديلات المطلوبة\n3. تحديد موعد بدء العمل',
    status: 'مكتمل',
    isOnline: false,
    attendees: [
      { id: 1, name: 'أحمد محمد', role: 'مقاول', confirmed: true },
      { id: 2, name: 'خالد السالم', role: 'مفتش', confirmed: true },
      { id: 3, name: 'سارة أحمد', role: 'عميل', confirmed: true }
    ],
    createdBy: 'المهندس المعماري',
    summary: {
      decisions: 'تم اعتماد التصميم النهائي مع تعديلات بسيطة',
      tasks: 'بدء العمل في الأسبوع القادم',
      notes: 'العميل راضٍ عن التصميم',
      nextMeeting: 'اجتماع متابعة بعد أسبوعين'
    }
  },
  {
    id: 2,
    title: 'اجتماع تنسيق العمل',
    projectId: 1,
    projectName: 'فيلا الأحمد',
    date: '2024-02-01',
    startTime: '14:00',
    endTime: '15:00',
    type: 'اجتماع تنسيق',
    location: 'موقع المشروع',
    description: 'تنسيق العمل بين الفرق المختلفة',
    agenda: '1. توزيع المهام\n2. تحديد الجدول الزمني\n3. مناقشة المتطلبات',
    status: 'مجدول',
    isOnline: false,
    attendees: [
      { id: 1, name: 'أحمد محمد', role: 'مقاول', confirmed: true },
      { id: 4, name: 'محمد علي', role: 'مدير موقع', confirmed: false },
      { id: 5, name: 'علي حسن', role: 'مشرف', confirmed: false }
    ],
    createdBy: 'أحمد محمد'
  },
  {
    id: 3,
    title: 'اجتماع طارئ - مشكلة في الأساسات',
    projectId: 2,
    projectName: 'برج السكني',
    date: '2024-01-30',
    startTime: '16:00',
    endTime: '17:00',
    type: 'اجتماع طارئ',
    location: 'موقع المشروع',
    description: 'مناقشة مشكلة في الأساسات',
    agenda: '1. تقييم المشكلة\n2. اقتراح الحلول\n3. تحديد الإجراءات المطلوبة',
    status: 'مكتمل',
    isOnline: false,
    attendees: [
      { id: 1, name: 'أحمد محمد', role: 'مقاول', confirmed: true },
      { id: 2, name: 'خالد السالم', role: 'مفتش', confirmed: true },
      { id: 6, name: 'حسن محمد', role: 'مهندس إنشائي', confirmed: true }
    ],
    createdBy: 'أحمد محمد',
    summary: {
      decisions: 'تم الاتفاق على حل المشكلة بتقوية الأساسات',
      tasks: 'تنفيذ الحل في الأسبوع القادم',
      notes: 'المشكلة تحتاج مراقبة مستمرة',
      nextMeeting: 'اجتماع متابعة بعد أسبوع'
    }
  }
];