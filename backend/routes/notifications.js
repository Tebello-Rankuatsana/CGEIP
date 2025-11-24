import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Utility function to create notifications
export const createNotification = async (userId, title, message, type = 'info', link = '') => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      link,
      isRead: false,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
};

// Get notifications for user
export const getNotifications = async (userId) => {
  try {
    const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, "notifications", notificationId), {
      isRead: true,
      readAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};