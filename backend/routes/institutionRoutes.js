// routes/institutionRoutes.js
import express from "express";
import { db, auth } from "../config/firebase.js";
import { createNotification } from "../utility/notifications.js";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, writeBatch } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const router = express.Router();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    req.user = { uid: token };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Institution registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, contactPerson, phone, website, description } = req.body;

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save institution profile in Firestore
    await setDoc(doc(db, "institutions", user.uid), {
      name,
      email,
      address: address || "",
      contactPerson: contactPerson || "",
      phone: phone || "",
      website: website || "",
      description: description || "",
      status: "pending", // Needs admin approval
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Institution registered successfully! Awaiting admin approval.",
      institutionId: user.uid,
    });
  } catch (error) {
    console.error("Institution registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Institution login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get institution data from Firestore
    const institutionDoc = await getDoc(doc(db, "institutions", user.uid));
    
    if (!institutionDoc.exists()) {
      return res.status(404).json({ error: "Institution profile not found" });
    }

    const institutionData = institutionDoc.data();

    // Check if institution is approved
    if (institutionData.status !== "active") {
      return res.status(403).json({ 
        error: "Institution account pending admin approval" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        uid: user.uid,
        email: user.email,
        role: 'institution',
        ...institutionData
      },
      token: user.uid
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }
});

// Get institution applications
router.get("/applications", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    
    const applicationsQuery = query(
      collection(db, "applications"),
      where("institutionId", "==", instituteId)
    );

    const applicationsSnap = await getDocs(applicationsQuery);
    const applications = [];
    
    for (const doc of applicationsSnap.docs) {
      const application = { id: doc.id, ...doc.data() };
      
      // Get student details
      const studentDoc = await getDoc(doc(db, "students", application.studentId));
      if (studentDoc.exists()) {
        application.studentDetails = studentDoc.data();
      }
      
      applications.push(application);
    }
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status
router.put("/applications/:applicationId", authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const instituteId = req.user.uid;

    // Get application details first
    const applicationDoc = await getDoc(doc(db, "applications", applicationId));
    if (!applicationDoc.exists()) {
      return res.status(404).json({ error: "Application not found" });
    }

    const application = applicationDoc.data();

    // Verify the application belongs to this institution
    if (application.institutionId !== instituteId) {
      return res.status(403).json({ error: "Not authorized to update this application" });
    }

    // Check if student is already admitted elsewhere in this institution
    if (status === 'admitted') {
      const otherAdmissionsQuery = query(
        collection(db, "applications"),
        where("studentId", "==", application.studentId),
        where("institutionId", "==", application.institutionId),
        where("status", "==", "admitted")
      );

      const otherAdmissions = await getDocs(otherAdmissionsQuery);
      if (!otherAdmissions.empty) {
        return res.status(400).json({ 
          error: "Student is already admitted to another program at this institution." 
        });
      }
    }

    // Update application status
    await updateDoc(doc(db, "applications", applicationId), {
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
      status === 'admitted' ? 'success' : 'info'
    );

    res.status(200).json({ message: `Application ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish admissions
router.post("/publish-admissions", authenticateToken, async (req, res) => {
  try {
    const instituteId = req.user.uid;
    
    // Get institution details
    const instituteDoc = await getDoc(doc(db, "institutions", instituteId));
    const instituteName = instituteDoc.exists() ? instituteDoc.data().name : "Institution";

    // Get all admitted students to notify them
    const admittedStudentsQuery = query(
      collection(db, "applications"),
      where("institutionId", "==", instituteId),
      where("status", "==", "admitted")
    );

    const admittedStudents = await getDocs(admittedStudentsQuery);

    // Create notifications for admitted students
    const batch = writeBatch(db);
    
    for (const doc of admittedStudents.docs) {
      const application = doc.data();
      await createNotification(
        application.studentId,
        "📢 Admissions Published!",
        `Admission results have been published by ${instituteName}. Check your application status now!`,
        'info'
      );
    }

    // Update pending applications to waiting
    const pendingAppsQuery = query(
      collection(db, "applications"),
      where("institutionId", "==", instituteId),
      where("status", "==", "pending")
    );

    const pendingApps = await getDocs(pendingAppsQuery);
    
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

export default router;