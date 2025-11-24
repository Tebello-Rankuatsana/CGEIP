import { db } from '../config/firebase.js';

export const createNotification = async (userId, title, message, type = 'info', link = '') => {
  try {
    const notificationData = {
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date()
    };

    await db.collection("notifications").add(notificationData);
    console.log(`Notification created for user ${userId}: ${title}`);
    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
};

// If you need to export multiple functions, you can add them here
export const getNotifications = async (userId) => {
  try {
    const snapshot = await db.collection("notifications")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};