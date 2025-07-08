import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===== SUPPORT REQUEST SERVICE =====
export const supportRequestService = {
  // الاشتراك في طلبات الدعم
  subscribeToRequests: (callback, errorCallback) => {
    try {
      const q = query(
        collection(db, 'supportRequests'), 
        orderBy('createdAt', 'desc')
      );
      
      return onSnapshot(q, (snapshot) => {
        try {
          const requests = [];
          snapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Support requests loaded: ${requests.length} items`);
          callback(requests);
        } catch (error) {
          console.error('Error processing support requests snapshot:', error);
          if (errorCallback) {
            errorCallback(error);
          }
        }
      }, (error) => {
        console.error('Support requests subscription error:', error);
        if (errorCallback) {
          errorCallback(error);
        }
      });
    } catch (error) {
      console.error('Error setting up support requests subscription:', error);
      if (errorCallback) {
        errorCallback(error);
      }
      return () => {}; // Return empty unsubscribe function
    }
  },

  // الحصول على جميع الطلبات
  getAllRequests: async () => {
    try {
      const q = query(
        collection(db, 'supportRequests'), 
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const requests = [];
      snapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      return requests;
    } catch (error) {
      console.error('Error getting all support requests:', error);
      throw error;
    }
  },

  // الحصول على طلبات مستخدم معين
  getUserRequests: async (userId) => {
    try {
      const q = query(
        collection(db, 'supportRequests'),
        where('requestedBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const requests = [];
      snapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      return requests;
    } catch (error) {
      console.error('Error getting user support requests:', error);
      throw error;
    }
  },

  // الحصول على طلبات مشروع معين
  getProjectRequests: async (projectId) => {
    try {
      const q = query(
        collection(db, 'supportRequests'),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const requests = [];
      snapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      return requests;
    } catch (error) {
      console.error('Error getting project support requests:', error);
      throw error;
    }
  },

  // إضافة طلب دعم جديد
  addRequest: async (requestData) => {
    try {
      if (!requestData.title || !requestData.description || !requestData.type) {
        throw new Error('عنوان الطلب ووصفه ونوعه مطلوبة');
      }

      const docRef = await addDoc(collection(db, 'supportRequests'), {
        ...requestData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Support request added successfully:', docRef.id);

      // إنشاء إشعار للمقاول
      if (requestData.projectId) {
        try {
          // الحصول على معلومات المشروع لمعرفة المقاول
          const projectDoc = await getDoc(doc(db, 'projects', requestData.projectId));
          if (projectDoc.exists()) {
            const projectData = projectDoc.data();
            
            await addDoc(collection(db, 'notifications'), {
              type: 'support_request',
              title: 'طلب دعم جديد',
              message: `طلب دعم جديد: ${requestData.title}`,
              recipientId: projectData.contractorId || 'contractor',
              requestId: docRef.id,
              projectId: requestData.projectId,
              read: false,
              createdAt: serverTimestamp()
            });
          }
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
          // لا نرمي خطأ هنا لأن الطلب تم إنشاؤه بنجاح
        }
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding support request:', error);
      throw error;
    }
  },

  // تحديث طلب دعم
  updateRequest: async (requestId, updates) => {
    try {
      if (!requestId) {
        throw new Error('معرف الطلب مطلوب للتحديث');
      }

      const requestRef = doc(db, 'supportRequests', requestId);
      
      // التحقق من وجود الطلب
      const requestDoc = await getDoc(requestRef);
      if (!requestDoc.exists()) {
        throw new Error(`طلب الدعم بالمعرف ${requestId} غير موجود`);
      }

      await updateDoc(requestRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      console.log('Support request updated successfully:', requestId);

      // إنشاء إشعار لطالب الطلب إذا تم تحديث الحالة
      if (updates.status && updates.status !== 'pending') {
        try {
          const requestData = requestDoc.data();
          
          await addDoc(collection(db, 'notifications'), {
            type: 'request_update',
            title: 'تحديث طلب الدعم',
            message: `تم ${updates.status === 'approved' ? 'الموافقة على' : 
                           updates.status === 'rejected' ? 'رفض' : 
                           'تحديث'} طلبك: ${requestData.title}`,
            recipientId: requestData.requestedBy,
            requestId: requestId,
            projectId: requestData.projectId,
            read: false,
            createdAt: serverTimestamp()
          });
        } catch (notificationError) {
          console.error('Error creating update notification:', notificationError);
        }
      }

    } catch (error) {
      console.error('Error updating support request:', error);
      throw error;
    }
  },

  // حذف طلب دعم
  deleteRequest: async (requestId) => {
    try {
      if (!requestId) {
        throw new Error('معرف الطلب مطلوب للحذف');
      }

      const requestRef = doc(db, 'supportRequests', requestId);
      
      // التحقق من وجود الطلب
      const requestDoc = await getDoc(requestRef);
      if (!requestDoc.exists()) {
        throw new Error(`طلب الدعم بالمعرف ${requestId} غير موجود`);
      }

      await deleteDoc(requestRef);
      console.log('Support request deleted successfully:', requestId);
    } catch (error) {
      console.error('Error deleting support request:', error);
      throw error;
    }
  },

  // الحصول على إحصائيات الطلبات
  getRequestsStats: async (projectId = null) => {
    try {
      let q;
      if (projectId) {
        q = query(
          collection(db, 'supportRequests'),
          where('projectId', '==', projectId)
        );
      } else {
        q = query(collection(db, 'supportRequests'));
      }

      const snapshot = await getDocs(q);
      
      const stats = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        inProgress: 0,
        byType: {
          support: 0,
          extension: 0,
          material: 0,
          equipment: 0,
          worker: 0
        },
        byPriority: {
          urgent: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        totalBudget: 0,
        approvedBudget: 0
      };

      snapshot.forEach((doc) => {
        const request = doc.data();
        stats.total++;

        // حسب الحالة
        if (request.status === 'pending') stats.pending++;
        else if (request.status === 'approved') stats.approved++;
        else if (request.status === 'rejected') stats.rejected++;
        else if (request.status === 'in-progress') stats.inProgress++;

        // حسب النوع
        if (stats.byType[request.type] !== undefined) {
          stats.byType[request.type]++;
        }

        // حسب الأولوية
        if (stats.byPriority[request.priority] !== undefined) {
          stats.byPriority[request.priority]++;
        }

        // الميزانية
        const budget = parseFloat(request.budget) || 0;
        stats.totalBudget += budget;
        if (request.status === 'approved') {
          stats.approvedBudget += budget;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting support requests stats:', error);
      throw error;
    }
  },

  // البحث في الطلبات
  searchRequests: async (searchTerm, filters = {}) => {
    try {
      let q = query(collection(db, 'supportRequests'));

      // تطبيق الفلاتر
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.type) {
        q = query(q, where('type', '==', filters.type));
      }
      if (filters.projectId) {
        q = query(q, where('projectId', '==', filters.projectId));
      }
      if (filters.requestedBy) {
        q = query(q, where('requestedBy', '==', filters.requestedBy));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      let requests = [];
      snapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });

      // البحث النصي (يتم على الجانب العميل لأن Firestore لا يدعم البحث النصي الكامل)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        requests = requests.filter(request => 
          request.title.toLowerCase().includes(term) ||
          request.description.toLowerCase().includes(term) ||
          (request.requestedByName && request.requestedByName.toLowerCase().includes(term))
        );
      }

      return requests;
    } catch (error) {
      console.error('Error searching support requests:', error);
      throw error;
    }
  },

  // الحصول على الطلبات المتأخرة
  getOverdueRequests: async () => {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'supportRequests'),
        where('status', 'in', ['pending', 'in-progress']),
        orderBy('expectedDate', 'asc')
      );

      const snapshot = await getDocs(q);
      const overdueRequests = [];

      snapshot.forEach((doc) => {
        const request = { id: doc.id, ...doc.data() };
        if (request.expectedDate) {
          const expectedDate = new Date(request.expectedDate);
          if (expectedDate < now) {
            overdueRequests.push(request);
          }
        }
      });

      return overdueRequests;
    } catch (error) {
      console.error('Error getting overdue support requests:', error);
      throw error;
    }
  },

  // تصدير الطلبات إلى CSV
  exportRequestsToCSV: async (filters = {}) => {
    try {
      const requests = await supportRequestService.searchRequests('', filters);
      
      const csvHeaders = [
        'رقم الطلب',
        'العنوان',
        'النوع',
        'الحالة',
        'الأولوية',
        'طالب الطلب',
        'تاريخ الإنشاء',
        'التاريخ المطلوب',
        'الميزانية',
        'الوصف'
      ];

      const csvRows = requests.map(request => [
        request.id,
        request.title,
        request.type === 'support' ? 'طلب دعم' :
        request.type === 'extension' ? 'طلب تمديد' :
        request.type === 'material' ? 'طلب مواد' :
        request.type === 'equipment' ? 'طلب معدات' :
        request.type === 'worker' ? 'طلب عمالة' : request.type,
        request.status === 'pending' ? 'قيد المراجعة' :
        request.status === 'approved' ? 'موافق عليه' :
        request.status === 'rejected' ? 'مرفوض' :
        request.status === 'in-progress' ? 'قيد التنفيذ' : request.status,
        request.priority === 'urgent' ? 'عاجلة' :
        request.priority === 'high' ? 'عالية' :
        request.priority === 'medium' ? 'متوسطة' : 'منخفضة',
        request.requestedByName || '',
        new Date(request.createdAt?.toDate?.() || request.createdAt).toLocaleDateString('ar-SA'),
        request.expectedDate ? new Date(request.expectedDate).toLocaleDateString('ar-SA') : '',
        request.budget || '',
        request.description.replace(/,/g, '،') // استبدال الفواصل لتجنب مشاكل CSV
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exporting support requests to CSV:', error);
      throw error;
    }
  }
};

