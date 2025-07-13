import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===== MEETINGS SERVICE =====
export const meetingsService = {
  // الاشتراك في الاجتماعات
  subscribeToMeetings: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'meetings'), orderBy('date', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const meetings = [];
        snapshot.forEach((doc) => {
          meetings.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`Meetings loaded: ${meetings.length} meetings`);
        callback(meetings);
      }, (error) => {
        console.error('Error processing meetings snapshot:', error);
        if (errorCallback) errorCallback(error);
      });
    } catch (error) {
      console.error('Error setting up meetings subscription:', error);
      if (errorCallback) errorCallback(error);
    }
  },

  // إضافة اجتماع جديد
  addMeeting: async (meetingData) => {
    try {
      const docRef = await addDoc(collection(db, 'meetings'), {
        ...meetingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Meeting added successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding meeting:', error);
      throw error;
    }
  },

  // تحديث اجتماع
  updateMeeting: async (meetingId, updateData) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      await updateDoc(meetingRef, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      
      console.log('Meeting updated successfully:', meetingId);
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  },

  // حذف اجتماع
  deleteMeeting: async (meetingId) => {
    try {
      await deleteDoc(doc(db, 'meetings', meetingId));
      console.log('Meeting deleted successfully:', meetingId);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  },

  // الحصول على اجتماعات مشروع معين
  getProjectMeetings: async (projectId) => {
    try {
      const q = query(
        collection(db, 'meetings'),
        where('projectId', '==', projectId),
        orderBy('date', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const meetings = [];
      snapshot.forEach((doc) => {
        meetings.push({ id: doc.id, ...doc.data() });
      });
      
      return meetings;
    } catch (error) {
      console.error('Error getting project meetings:', error);
      throw error;
    }
  },

  // الحصول على اجتماعات اليوم
  getTodayMeetings: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'meetings'),
        where('date', '==', today),
        orderBy('startTime', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const meetings = [];
      snapshot.forEach((doc) => {
        meetings.push({ id: doc.id, ...doc.data() });
      });
      
      return meetings;
    } catch (error) {
      console.error('Error getting today meetings:', error);
      throw error;
    }
  },

  // الحصول على اجتماعات قادمة
  getUpcomingMeetings: async (limit = 10) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'meetings'),
        where('date', '>=', today),
        orderBy('date', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const meetings = [];
      snapshot.forEach((doc) => {
        meetings.push({ id: doc.id, ...doc.data() });
      });
      
      return meetings.slice(0, limit);
    } catch (error) {
      console.error('Error getting upcoming meetings:', error);
      throw error;
    }
  },

  // تحديث حالة الاجتماع
  updateMeetingStatus: async (meetingId, status) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      await updateDoc(meetingRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      
      console.log('Meeting status updated:', meetingId, status);
    } catch (error) {
      console.error('Error updating meeting status:', error);
      throw error;
    }
  },

  // إضافة ملخص اجتماع
  addMeetingSummary: async (meetingId, summaryData) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      await updateDoc(meetingRef, {
        summary: summaryData,
        status: 'مكتمل',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Meeting summary added:', meetingId);
    } catch (error) {
      console.error('Error adding meeting summary:', error);
      throw error;
    }
  },

  // تأكيد حضور شخص
  confirmAttendance: async (meetingId, attendeeId) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      const meetingDoc = await getDocs(query(collection(db, 'meetings'), where('__name__', '==', meetingId)));
      
      if (!meetingDoc.empty) {
        const meeting = meetingDoc.docs[0].data();
        const attendees = meeting.attendees || [];
        
        const updatedAttendees = attendees.map(attendee => 
          attendee.id === attendeeId 
            ? { ...attendee, confirmed: true }
            : attendee
        );
        
        await updateDoc(meetingRef, {
          attendees: updatedAttendees,
          updatedAt: new Date().toISOString()
        });
        
        console.log('Attendance confirmed:', meetingId, attendeeId);
      }
    } catch (error) {
      console.error('Error confirming attendance:', error);
      throw error;
    }
  }
};