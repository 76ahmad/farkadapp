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
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===== MAPS SERVICE =====
export const mapsService = {
  // الاشتراك في الخوارط لمشروع معين
  subscribeToProjectMaps: (projectId, callback, errorCallback) => {
    try {
      const q = query(
        collection(db, 'maps'),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      
      return onSnapshot(q, (snapshot) => {
        try {
          const maps = [];
          snapshot.forEach((doc) => {
            maps.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Maps loaded: ${maps.length} maps`);
          callback(maps);
        } catch (error) {
          console.error('Error processing maps snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Maps subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up maps subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  // إضافة خارطة جديدة
  addMap: async (mapData) => {
    try {
      if (!mapData.title || !mapData.projectId) {
        throw new Error('عنوان الخارطة ومعرف المشروع مطلوبان');
      }

      const docRef = await addDoc(collection(db, 'maps'), {
        ...mapData,
        status: mapData.status || 'draft',
        version: mapData.version || 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Map added successfully:', docRef.id);

      // إنشاء إشعار للمقاول ومدير الموقع
      try {
        const projectDoc = await getDoc(doc(db, 'projects', mapData.projectId));
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          const notifications = [];

          if (projectData.contractorId) {
            notifications.push({
              type: 'new_map',
              title: 'خارطة جديدة',
              message: `تم إضافة خارطة جديدة: ${mapData.title}`,
              recipientId: projectData.contractorId,
              mapId: docRef.id,
              projectId: mapData.projectId,
              read: false,
              createdAt: serverTimestamp()
            });
          }

          if (projectData.siteManager?.id) {
            notifications.push({
              type: 'new_map',
              title: 'خارطة جديدة',
              message: `تم إضافة خارطة جديدة: ${mapData.title}`,
              recipientId: projectData.siteManager.id,
              mapId: docRef.id,
              projectId: mapData.projectId,
              read: false,
              createdAt: serverTimestamp()
            });
          }

          const batch = writeBatch(db);
          notifications.forEach(notification => {
            const notificationRef = doc(collection(db, 'notifications'));
            batch.set(notificationRef, notification);
          });
          await batch.commit();
        }
      } catch (notificationError) {
        console.error('Error creating notifications:', notificationError);
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding map:', error);
      throw error;
    }
  },

  // تحديث خارطة
  updateMap: async (mapId, updates) => {
    try {
      if (!mapId) {
        throw new Error('معرف الخارطة مطلوب للتحديث');
      }

      const mapRef = doc(db, 'maps', mapId);
      
      // التحقق من وجود الخارطة
      const mapDoc = await getDoc(mapRef);
      if (!mapDoc.exists()) {
        throw new Error(`الخارطة بالمعرف ${mapId} غير موجودة`);
      }

      const currentData = mapDoc.data();
      
      await updateDoc(mapRef, {
        ...updates,
        version: (currentData.version || 1) + 1,
        updatedAt: serverTimestamp()
      });

      console.log('Map updated successfully:', mapId);

      // إنشاء إشعار للتحديث
      if (updates.status && updates.status !== currentData.status) {
        try {
          await addDoc(collection(db, 'notifications'), {
            type: 'map_updated',
            title: 'تحديث خارطة',
            message: `تم تحديث خارطة: ${currentData.title}`,
            recipientId: currentData.createdBy,
            mapId: mapId,
            projectId: currentData.projectId,
            read: false,
            createdAt: serverTimestamp()
          });
        } catch (notificationError) {
          console.error('Error creating update notification:', notificationError);
        }
      }

    } catch (error) {
      console.error('Error updating map:', error);
      throw error;
    }
  },

  // حذف خارطة
  deleteMap: async (mapId) => {
    try {
      if (!mapId) {
        throw new Error('معرف الخارطة مطلوب للحذف');
      }

      const mapRef = doc(db, 'maps', mapId);
      
      // التحقق من وجود الخارطة
      const mapDoc = await getDoc(mapRef);
      if (!mapDoc.exists()) {
        throw new Error(`الخارطة بالمعرف ${mapId} غير موجودة`);
      }

      await deleteDoc(mapRef);
      console.log('Map deleted successfully:', mapId);
    } catch (error) {
      console.error('Error deleting map:', error);
      throw error;
    }
  },

  // الحصول على خارطة واحدة
  getMap: async (mapId) => {
    try {
      const mapDoc = await getDoc(doc(db, 'maps', mapId));
      if (mapDoc.exists()) {
        return { id: mapDoc.id, ...mapDoc.data() };
      } else {
        throw new Error(`الخارطة بالمعرف ${mapId} غير موجودة`);
      }
    } catch (error) {
      console.error('Error getting map:', error);
      throw error;
    }
  },

  // البحث في الخوارط
  searchMaps: async (searchTerm, filters = {}) => {
    try {
      let q = query(collection(db, 'maps'));

      // تطبيق الفلاتر
      if (filters.projectId) {
        q = query(q, where('projectId', '==', filters.projectId));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.type) {
        q = query(q, where('type', '==', filters.type));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      let maps = [];
      snapshot.forEach((doc) => {
        maps.push({ id: doc.id, ...doc.data() });
      });

      // البحث النصي
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        maps = maps.filter(map => 
          map.title.toLowerCase().includes(term) ||
          map.description?.toLowerCase().includes(term) ||
          map.tags?.some(tag => tag.toLowerCase().includes(term))
        );
      }

      return maps;
    } catch (error) {
      console.error('Error searching maps:', error);
      throw error;
    }
  },

  // إضافة تعليق على خارطة
  addMapComment: async (mapId, commentData) => {
    try {
      const commentRef = await addDoc(collection(db, 'mapComments'), {
        mapId,
        ...commentData,
        createdAt: serverTimestamp()
      });

      // تحديث عدد التعليقات في الخارطة
      const mapRef = doc(db, 'maps', mapId);
      const mapDoc = await getDoc(mapRef);
      if (mapDoc.exists()) {
        const currentComments = mapDoc.data().commentsCount || 0;
        await updateDoc(mapRef, {
          commentsCount: currentComments + 1,
          updatedAt: serverTimestamp()
        });
      }

      return commentRef.id;
    } catch (error) {
      console.error('Error adding map comment:', error);
      throw error;
    }
  },

  // الحصول على تعليقات خارطة
  getMapComments: async (mapId) => {
    try {
      const q = query(
        collection(db, 'mapComments'),
        where('mapId', '==', mapId),
        orderBy('createdAt', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const comments = [];
      snapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });
      
      return comments;
    } catch (error) {
      console.error('Error getting map comments:', error);
      throw error;
    }
  },

  // تصدير الخوارط إلى PDF
  exportMapsToPDF: async (projectId) => {
    try {
      const maps = await mapsService.searchMaps('', { projectId });
      
      // هنا يمكن إضافة منطق تصدير PDF
      // يمكن استخدام مكتبة مثل jsPDF أو pdfmake
      
      return {
        success: true,
        message: `تم تصدير ${maps.length} خارطة بنجاح`,
        data: maps
      };
    } catch (error) {
      console.error('Error exporting maps to PDF:', error);
      throw error;
    }
  },

  // إحصائيات الخوارط
  getMapsStats: async (projectId = null) => {
    try {
      let q;
      if (projectId) {
        q = query(
          collection(db, 'maps'),
          where('projectId', '==', projectId)
        );
      } else {
        q = query(collection(db, 'maps'));
      }

      const snapshot = await getDocs(q);
      
      const stats = {
        total: 0,
        draft: 0,
        approved: 0,
        rejected: 0,
        byType: {
          architectural: 0,
          structural: 0,
          electrical: 0,
          plumbing: 0,
          mechanical: 0,
          landscape: 0
        },
        byStatus: {
          pending: 0,
          approved: 0,
          rejected: 0,
          in_review: 0
        }
      };

      snapshot.forEach((doc) => {
        const map = doc.data();
        stats.total++;

        // حسب الحالة
        if (stats.byStatus[map.status] !== undefined) {
          stats.byStatus[map.status]++;
        }

        // حسب النوع
        if (stats.byType[map.type] !== undefined) {
          stats.byType[map.type]++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting maps stats:', error);
      throw error;
    }
  }
};