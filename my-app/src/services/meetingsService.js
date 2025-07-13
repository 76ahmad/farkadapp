import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===== MEETINGS SERVICE =====
export const meetingsService = {
  subscribeToMeetings: (callback, errorCallback) => {
    try {
      const q = query(collection(db, 'meetings'), orderBy('createdAt', 'desc'));
      
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
      console.error('Meetings subscription error:', error);
      if (errorCallback) errorCallback(error);
    }
  },

  addMeeting: async (meetingData) => {
    try {
      const meeting = {
        ...meetingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'meetings'), meeting);
      console.log('Meeting added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding meeting:', error);
      throw error;
    }
  },

  updateMeeting: async (meetingId, meetingData) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      const updateData = {
        ...meetingData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(meetingRef, updateData);
      console.log('Meeting updated:', meetingId);
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  },

  deleteMeeting: async (meetingId) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      await deleteDoc(meetingRef);
      console.log('Meeting deleted:', meetingId);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  },

  getMeetingById: async (meetingId) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      const meetingDoc = await getDocs(meetingRef);
      
      if (meetingDoc.exists()) {
        return { id: meetingDoc.id, ...meetingDoc.data() };
      } else {
        throw new Error('Meeting not found');
      }
    } catch (error) {
      console.error('Error getting meeting:', error);
      throw error;
    }
  },

  getMeetingsByStatus: async (status) => {
    try {
      const q = query(
        collection(db, 'meetings'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const meetings = [];
      
      snapshot.forEach((doc) => {
        meetings.push({ id: doc.id, ...doc.data() });
      });
      
      return meetings;
    } catch (error) {
      console.error('Error getting meetings by status:', error);
      throw error;
    }
  },

  getUpcomingMeetings: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'meetings'),
        where('date', '>=', today),
        where('status', '==', 'scheduled'),
        orderBy('date', 'asc')
      );
      
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
  }
};