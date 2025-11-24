// backend/routes/notifications.js
import express from "express";
// import { authenticateToken } from "./middleware/auth.js";
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "../utility/notifications.js";

const router = express.Router();

// Get user notifications
router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user is accessing their own notifications
    if (req.user.uid !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const notifications = await getNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.patch("/:notificationId/read", authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // In a real app, you might want to verify the notification belongs to the user
    const success = await markNotificationAsRead(notificationId);
    
    if (success) {
      res.status(200).json({ message: "Notification marked as read" });
    } else {
      res.status(400).json({ error: "Failed to mark notification as read" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read for user
router.post("/:userId/read-all", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user is accessing their own notifications
    if (req.user.uid !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const success = await markAllNotificationsAsRead(userId);
    
    if (success) {
      res.status(200).json({ message: "All notifications marked as read" });
    } else {
      res.status(400).json({ error: "Failed to mark notifications as read" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unread notifications count
router.get("/:userId/unread-count", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user is accessing their own notifications
    if (req.user.uid !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const notifications = await getNotifications(userId);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;