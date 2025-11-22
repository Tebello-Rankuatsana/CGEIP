import express from "express";
import { db, auth } from "../config/firebase.js";
import { createNotification } from "./notifications.js";

const router = express.Router();

// Authentication middleware
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

// Get institution profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    const instituteDoc = await db.collection("institutions").doc(instituteId).get();
    
    if (!instituteDoc.exists) {
      return res.status(404).json({ error: "Institution not found" });
    }
    
    res.status(200).json({ id: instituteDoc.id, ...instituteDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update institution profile
router.patch("/profile", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    const updates = req.body;

    await db.collection("institutions").doc(instituteId).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get institution's faculties
router.get("/faculties", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    const facultiesSnap = await db.collection("faculties")
      .where("institutionId", "==", instituteId)
      .get();
    
    const faculties = [];
    facultiesSnap.forEach(doc => faculties.push({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add faculty
router.post("/faculties", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    const { name, description } = req.body;

    const facultyData = {
      institutionId: instituteId,
      name,
      description,
      createdAt: new Date(),
    };

    const facultyRef = await db.collection("faculties").add(facultyData);
    
    res.status(201).json({ 
      message: "Faculty added successfully!",
      facultyId: facultyRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete faculty
router.delete("/faculties/:facultyId", authenticateToken, async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    await db.collection("faculties").doc(facultyId).delete();
    
    res.status(200).json({ message: "Faculty deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get institution's courses
router.get("/courses", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    const coursesSnap = await db.collection("courses")
      .where("institutionId", "==", instituteId)
      .get();
    
    const courses = [];
    coursesSnap.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add course
router.post("/courses", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    const { name, faculty, duration, requirements, description, tuitionFee, capacity } = req.body;

    const courseData = {
      institutionId: instituteId,
      name,
      faculty,
      duration: parseInt(duration),
      requirements,
      description,
      tuitionFee: parseFloat(tuitionFee),
      capacity: parseInt(capacity),
      createdAt: new Date(),
    };

    const courseRef = await db.collection("courses").add(courseData);
    
    res.status(201).json({ 
      message: "Course added successfully!",
      courseId: courseRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course
router.put("/courses/:courseId", authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;

    await db.collection("courses").doc(courseId).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Course updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course
router.delete("/courses/:courseId", authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    await db.collection("courses").doc(courseId).delete();
    
    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications for institution
router.put("/applications/:applicationId", authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Get application details first
    const applicationDoc = await db.collection("applications").doc(applicationId).get();
    if (!applicationDoc.exists) {
      return res.status(404).json({ error: "Application not found" });
    }

    const application = applicationDoc.data();

    // Check if student is already admitted elsewhere in this institution
    if (status === 'admitted') {
      const otherAdmissions = await db.collection("applications")
        .where("studentId", "==", application.studentId)
        .where("institutionId", "==", application.institutionId)
        .where("status", "==", "admitted")
        .get();

      if (!otherAdmissions.empty) {
        return res.status(400).json({ 
          error: "Student is already admitted to another program at this institution." 
        });
      }
    }

    // Update application status
    await db.collection("applications").doc(applicationId).update({
      status,
      updatedAt: new Date(),
      ...(status === 'admitted' && { admittedAt: new Date() })
    });

    // Create notification for student
    let notificationTitle, notificationMessage;
    
    switch (status) {
      case 'admitted':
        notificationTitle = "🎉 Admission Offer!";
        notificationMessage = `Congratulations! You have been admitted to ${application.courseName} at ${application.institutionName}`;
        break;
      case 'rejected':
        notificationTitle = "Application Update";
        notificationMessage = `Your application to ${application.courseName} at ${application.institutionName} has been reviewed`;
        break;
      case 'waiting':
        notificationTitle = "Application Waitlisted";
        notificationMessage = `Your application to ${application.courseName} has been placed on waitlist`;
        break;
      default:
        notificationTitle = "Application Status Updated";
        notificationMessage = `Your application status has been updated to ${status}`;
    }

    await createNotification(
      application.studentId,
      notificationTitle,
      notificationMessage,
      status === 'admitted' ? 'success' : 'info',
      '/student/applications'
    );

    res.status(200).json({ message: `Application ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enhanced Publish admissions with notifications
router.post("/publish-admissions", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    
    // Get institution details
    const instituteDoc = await db.collection("institutions").doc(instituteId).get();
    const instituteName = instituteDoc.exists ? instituteDoc.data().name : "Institution";

    // Get all admitted students to notify them
    const admittedStudents = await db.collection("applications")
      .where("institutionId", "==", instituteId)
      .where("status", "==", "admitted")
      .get();

    // Create notifications for admitted students
    for (const doc of admittedStudents.docs) {
      const application = doc.data();
      await createNotification(
        application.studentId,
        "📢 Admissions Published!",
        `Admission results have been published by ${instituteName}. Check your application status now!`,
        'info',
        '/student/applications'
      );
    }

    // Update pending applications to waiting
    const pendingApps = await db.collection("applications")
      .where("institutionId", "==", instituteId)
      .where("status", "==", "pending")
      .get();

    const batch = db.batch();
    
    pendingApps.docs.forEach(doc => {
      batch.update(doc.ref, { 
        status: 'waiting',
        updatedAt: new Date()
      });
    });

    await batch.commit();
    
    res.status(200).json({ 
      message: "Admissions published successfully! Students have been notified.",
      admitted: admittedStudents.size,
      waitlisted: pendingApps.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New route: Student accepts admission offer
router.post("/admissions/accept", authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.body;
    const studentId = req.user.uid; // Assuming student is making this request

    // Get the application
    const applicationDoc = await db.collection("applications").doc(applicationId).get();
    if (!applicationDoc.exists) {
      return res.status(404).json({ error: "Application not found" });
    }

    const application = applicationDoc.data();

    // Verify student owns this application
    if (application.studentId !== studentId) {
      return res.status(403).json({ error: "Not authorized to accept this offer" });
    }

    // Check if already admitted
    if (application.status !== 'admitted') {
      return res.status(400).json({ error: "Application is not admitted" });
    }

    // Get all other admitted applications for this student
    const otherAdmittedApps = await db.collection("applications")
      .where("studentId", "==", studentId)
      .where("status", "==", "admitted")
      .where("id", "!=", applicationId)
      .get();

    const batch = db.batch();
    
    // Confirm the selected application
    batch.update(db.collection("applications").doc(applicationId), { 
      status: 'confirmed', 
      confirmedAt: new Date() 
    });

    // Decline all other admitted applications and move waitlist
    for (const doc of otherAdmittedApps.docs) {
      const otherApp = doc.data();
      
      // Update status to declined
      batch.update(doc.ref, { status: 'declined', declinedAt: new Date() });
      
      // Move first student from waitlist to admitted for each declined application
      const waitlistSnap = await db.collection("applications")
        .where("courseId", "==", otherApp.courseId)
        .where("status", "==", "waiting")
        .orderBy("appliedAt", "asc")
        .limit(1)
        .get();

      if (!waitlistSnap.empty) {
        const firstWaitlist = waitlistSnap.docs[0];
        batch.update(firstWaitlist.ref, { status: 'admitted', admittedAt: new Date() });
        
        // Create notification for waitlisted student
        await createNotification(
          firstWaitlist.data().studentId,
          "🎉 Admission from Waitlist!",
          `You have been admitted to ${otherApp.courseName} at ${otherApp.institutionName} from the waitlist!`,
          'success',
          '/student/applications'
        );
      }
    }

    await batch.commit();

    // Create notification for the student
    await createNotification(
      studentId,
      "✅ Admission Confirmed!",
      `You have confirmed your admission to ${application.courseName} at ${application.institutionName}. Welcome!`,
      'success',
      '/student/applications'
    );

    res.status(200).json({ 
      message: "Admission accepted successfully!",
      confirmedCourse: application.courseName,
      declinedCount: otherAdmittedApps.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;