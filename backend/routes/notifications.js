// routes/notifications.js
import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

// Authentication middleware (same as your other routes)
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Get notifications for user
router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notificationsSnap = await db.collection("notifications")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const notifications = [];
    notificationsSnap.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.patch("/:notificationId/read", authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await db.collection("notifications").doc(notificationId).update({
      isRead: true,
      readAt: new Date()
    });

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create notification (utility function)
export const createNotification = async (userId, title, message, type = 'info', link = '') => {
  try {
    const notificationData = {
      userId,
      title,
      message,
      type,
      link,
      isRead: false,
      createdAt: new Date()
    };

    await db.collection("notifications").add(notificationData);
    
    console.log(`Notification created for user ${userId}: ${title}`);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export default router;