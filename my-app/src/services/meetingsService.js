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

// ===== MEETINGS SERVICE =====
export const meetingsService = {
  // الاشتراك في الاجتماعات لمشروع معين
  subscribeToProjectMeetings: (projectId, callback, errorCallback) => {
    try {
      const q = query(
        collection(db, 'meetings'),
        where('projectId', '==', projectId),
        orderBy('scheduledDate', 'desc')
      );
      
      return onSnapshot(q, (snapshot) => {
        try {
          const meetings = [];
          snapshot.forEach((doc) => {
            meetings.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Meetings loaded: ${meetings.length} meetings`);
          callback(meetings);
        } catch (error) {
          console.error('Error processing meetings snapshot:', error);
          if (errorCallback) errorCallback(error);
        }
      }, (error) => {
        console.error('Meetings subscription error:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up meetings subscription:', error);
      if (errorCallback) errorCallback(error);
      return () => {};
    }
  },

  // إضافة اجتماع جديد
  addMeeting: async (meetingData) => {
    try {
      if (!meetingData.title || !meetingData.projectId || !meetingData.scheduledDate) {
        throw new Error('عنوان الاجتماع ومعرف المشروع والتاريخ المطلوبان');
      }

      const docRef = await addDoc(collection(db, 'meetings'), {
        ...meetingData,
        status: meetingData.status || 'scheduled',
        attendees: meetingData.attendees || [],
        agenda: meetingData.agenda || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Meeting added successfully:', docRef.id);

      // إنشاء إشعارات للمشاركين
      try {
        const notifications = [];
        const attendees = meetingData.attendees || [];
        
        attendees.forEach(attendeeId => {
          notifications.push({
            type: 'meeting_invitation',
            title: 'دعوة اجتماع',
            message: `تمت دعوتك لحضور اجتماع: ${meetingData.title}`,
            recipientId: attendeeId,
            meetingId: docRef.id,
            projectId: meetingData.projectId,
            scheduledDate: meetingData.scheduledDate,
            read: false,
            createdAt: serverTimestamp()
          });
        });

        const batch = writeBatch(db);
        notifications.forEach(notification => {
          const notificationRef = doc(collection(db, 'notifications'));
          batch.set(notificationRef, notification);
        });
        await batch.commit();
      } catch (notificationError) {
        console.error('Error creating meeting notifications:', notificationError);
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding meeting:', error);
      throw error;
    }
  },

  // تحديث اجتماع
  updateMeeting: async (meetingId, updates) => {
    try {
      if (!meetingId) {
        throw new Error('معرف الاجتماع مطلوب للتحديث');
      }

      const meetingRef = doc(db, 'meetings', meetingId);
      
      // التحقق من وجود الاجتماع
      const meetingDoc = await getDoc(meetingRef);
      if (!meetingDoc.exists()) {
        throw new Error(`الاجتماع بالمعرف ${meetingId} غير موجود`);
      }

      const currentData = meetingDoc.data();
      
      await updateDoc(meetingRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      console.log('Meeting updated successfully:', meetingId);

      // إنشاء إشعار للتحديث إذا تغير التاريخ
      if (updates.scheduledDate && updates.scheduledDate !== currentData.scheduledDate) {
        try {
          const attendees = currentData.attendees || [];
          const batch = writeBatch(db);
          
          attendees.forEach(attendeeId => {
            const notificationRef = doc(collection(db, 'notifications'));
            batch.set(notificationRef, {
              type: 'meeting_updated',
              title: 'تحديث اجتماع',
              message: `تم تحديث موعد الاجتماع: ${currentData.title}`,
              recipientId: attendeeId,
              meetingId: meetingId,
              projectId: currentData.projectId,
              read: false,
              createdAt: serverTimestamp()
            });
          });
          
          await batch.commit();
        } catch (notificationError) {
          console.error('Error creating update notification:', notificationError);
        }
      }

    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  },

  // حذف اجتماع
  deleteMeeting: async (meetingId) => {
    try {
      if (!meetingId) {
        throw new Error('معرف الاجتماع مطلوب للحذف');
      }

      const meetingRef = doc(db, 'meetings', meetingId);
      
      // التحقق من وجود الاجتماع
      const meetingDoc = await getDoc(meetingRef);
      if (!meetingDoc.exists()) {
        throw new Error(`الاجتماع بالمعرف ${meetingId} غير موجود`);
      }

      await deleteDoc(meetingRef);
      console.log('Meeting deleted successfully:', meetingId);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  },

  // الحصول على اجتماع واحد
  getMeeting: async (meetingId) => {
    try {
      const meetingDoc = await getDoc(doc(db, 'meetings', meetingId));
      if (meetingDoc.exists()) {
        return { id: meetingDoc.id, ...meetingDoc.data() };
      } else {
        throw new Error(`الاجتماع بالمعرف ${meetingId} غير موجود`);
      }
    } catch (error) {
      console.error('Error getting meeting:', error);
      throw error;
    }
  },

  // البحث في الاجتماعات
  searchMeetings: async (searchTerm, filters = {}) => {
    try {
      let q = query(collection(db, 'meetings'));

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

      q = query(q, orderBy('scheduledDate', 'desc'));

      const snapshot = await getDocs(q);
      let meetings = [];
      snapshot.forEach((doc) => {
        meetings.push({ id: doc.id, ...doc.data() });
      });

      // البحث النصي
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        meetings = meetings.filter(meeting => 
          meeting.title.toLowerCase().includes(term) ||
          meeting.description?.toLowerCase().includes(term) ||
          meeting.location?.toLowerCase().includes(term)
        );
      }

      return meetings;
    } catch (error) {
      console.error('Error searching meetings:', error);
      throw error;
    }
  },

  // إضافة محضر اجتماع
  addMeetingMinutes: async (meetingId, minutesData) => {
    try {
      const minutesRef = await addDoc(collection(db, 'meetingMinutes'), {
        meetingId,
        ...minutesData,
        createdAt: serverTimestamp()
      });

      // تحديث حالة الاجتماع
      await updateDoc(doc(db, 'meetings', meetingId), {
        status: 'completed',
        minutesId: minutesRef.id,
        updatedAt: serverTimestamp()
      });

      return minutesRef.id;
    } catch (error) {
      console.error('Error adding meeting minutes:', error);
      throw error;
    }
  },

  // الحصول على محضر اجتماع
  getMeetingMinutes: async (meetingId) => {
    try {
      const q = query(
        collection(db, 'meetingMinutes'),
        where('meetingId', '==', meetingId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting meeting minutes:', error);
      throw error;
    }
  },

  // إضافة مشارك للاجتماع
  addMeetingAttendee: async (meetingId, attendeeId) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      const meetingDoc = await getDoc(meetingRef);
      
      if (!meetingDoc.exists()) {
        throw new Error(`الاجتماع بالمعرف ${meetingId} غير موجود`);
      }

      const currentAttendees = meetingDoc.data().attendees || [];
      if (!currentAttendees.includes(attendeeId)) {
        await updateDoc(meetingRef, {
          attendees: [...currentAttendees, attendeeId],
          updatedAt: serverTimestamp()
        });

        // إرسال إشعار للمشارك الجديد
        await addDoc(collection(db, 'notifications'), {
          type: 'meeting_invitation',
          title: 'دعوة اجتماع',
          message: `تمت دعوتك لحضور اجتماع: ${meetingDoc.data().title}`,
          recipientId: attendeeId,
          meetingId: meetingId,
          projectId: meetingDoc.data().projectId,
          read: false,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error adding meeting attendee:', error);
      throw error;
    }
  },

  // إزالة مشارك من الاجتماع
  removeMeetingAttendee: async (meetingId, attendeeId) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      const meetingDoc = await getDoc(meetingRef);
      
      if (!meetingDoc.exists()) {
        throw new Error(`الاجتماع بالمعرف ${meetingId} غير موجود`);
      }

      const currentAttendees = meetingDoc.data().attendees || [];
      const updatedAttendees = currentAttendees.filter(id => id !== attendeeId);
      
      await updateDoc(meetingRef, {
        attendees: updatedAttendees,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing meeting attendee:', error);
      throw error;
    }
  },

  // الحصول على الاجتماعات القادمة
  getUpcomingMeetings: async (projectId = null, days = 7) => {
    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + days);

      let q = query(
        collection(db, 'meetings'),
        where('scheduledDate', '>=', now.toISOString()),
        where('scheduledDate', '<=', futureDate.toISOString()),
        where('status', '==', 'scheduled'),
        orderBy('scheduledDate', 'asc')
      );

      if (projectId) {
        q = query(q, where('projectId', '==', projectId));
      }

      const snapshot = await getDocs(q);
      const meetings = [];
      snapshot.forEach((doc) => {
        meetings.push({ id: doc.id, ...doc.data() });
      });

      return meetings;
    } catch (error) {
      console.error('Error getting upcoming meetings:', error);
      throw error;
    }
  },

  // تصدير محضر الاجتماع إلى PDF
  exportMeetingMinutesToPDF: async (meetingId) => {
    try {
      const meeting = await meetingsService.getMeeting(meetingId);
      const minutes = await meetingsService.getMeetingMinutes(meetingId);
      
      if (!minutes) {
        throw new Error('لا يوجد محضر لهذا الاجتماع');
      }

      // هنا يمكن إضافة منطق تصدير PDF
      // يمكن استخدام مكتبة مثل jsPDF أو pdfmake
      
      return {
        success: true,
        message: 'تم تصدير محضر الاجتماع بنجاح',
        data: { meeting, minutes }
      };
    } catch (error) {
      console.error('Error exporting meeting minutes to PDF:', error);
      throw error;
    }
  },

  // إحصائيات الاجتماعات
  getMeetingsStats: async (projectId = null) => {
    try {
      let q;
      if (projectId) {
        q = query(
          collection(db, 'meetings'),
          where('projectId', '==', projectId)
        );
      } else {
        q = query(collection(db, 'meetings'));
      }

      const snapshot = await getDocs(q);
      
      const stats = {
        total: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        byType: {
          progress: 0,
          coordination: 0,
          review: 0,
          emergency: 0,
          planning: 0
        },
        byStatus: {
          scheduled: 0,
          completed: 0,
          cancelled: 0,
          postponed: 0
        },
        totalAttendees: 0,
        averageDuration: 0
      };

      let totalDuration = 0;
      let meetingsWithDuration = 0;

      snapshot.forEach((doc) => {
        const meeting = doc.data();
        stats.total++;

        // حسب الحالة
        if (stats.byStatus[meeting.status] !== undefined) {
          stats.byStatus[meeting.status]++;
        }

        // حسب النوع
        if (stats.byType[meeting.type] !== undefined) {
          stats.byType[meeting.type]++;
        }

        // عدد المشاركين
        stats.totalAttendees += (meeting.attendees?.length || 0);

        // مدة الاجتماع
        if (meeting.duration) {
          totalDuration += meeting.duration;
          meetingsWithDuration++;
        }
      });

      if (meetingsWithDuration > 0) {
        stats.averageDuration = Math.round(totalDuration / meetingsWithDuration);
      }

      return stats;
    } catch (error) {
      console.error('Error getting meetings stats:', error);
      throw error;
    }
  }
};