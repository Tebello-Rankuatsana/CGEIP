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

// Student registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create user in Firebase Authentication
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Saving student profile in Firestore
    await db.collection("students").doc(user.uid).set({
      name,
      email,
      createdAt: new Date(),
      appliedCourses: [],
      status: "active",
      phone: "",
      dateOfBirth: "",
      address: "",
      highSchool: "",
      graduationYear: "",
      transcriptUrl: "",
    });

    res.status(201).json({
      message: "Student registered successfully!",
      studentId: user.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Student login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Firebase Auth
    const userCredential = await auth.signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get custom token for your app
    const token = await auth.createCustomToken(user.uid);

    // Get student data from Firestore
    const studentDoc = await db.collection("students").doc(user.uid).get();
    
    if (!studentDoc.exists) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const studentData = studentDoc.data();

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        uid: user.uid,
        email: user.email,
        role: 'student',
        ...studentData
      },
      token: token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }
});

// Get student profile
router.get("/profile/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentDoc = await db.collection("students").doc(studentId).get();
    
    if (!studentDoc.exists) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.status(200).json({ id: studentDoc.id, ...studentDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student profile
router.patch("/profile/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const updates = req.body;

    await db.collection("students").doc(studentId).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for course
router.post("/apply", authenticateToken, async (req, res) => {
  try {
    const { studentId, institutionId, courseId } = req.body;

    // Fetch student
    const studentRef = db.collection("students").doc(studentId);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if already applied to 2 courses in this institution
    const applicationsRef = db.collection("applications")
      .where("studentId", "==", studentId)
      .where("institutionId", "==", institutionId);

    const snapshot = await applicationsRef.get();
    if (snapshot.size >= 2) {
      return res.status(400).json({ error: "You can only apply for 2 courses per institution." });
    }

    // Check if already applied to this specific course
    const existingApp = await db.collection("applications")
      .where("studentId", "==", studentId)
      .where("courseId", "==", courseId)
      .get();

    if (!existingApp.empty) {
      return res.status(400).json({ error: "Already applied for this course" });
    }

    // Get course and institution details
    const courseDoc = await db.collection("courses").doc(courseId).get();
    const institutionDoc = await db.collection("institutions").doc(institutionId).get();

    if (!courseDoc.exists || !institutionDoc.exists) {
      return res.status(404).json({ error: "Course or institution not found" });
    }

    // Create application
    const applicationData = {
      studentId,
      institutionId,
      courseId,
      courseName: courseDoc.data().name,
      institutionName: institutionDoc.data().name,
      status: "pending",
      appliedAt: new Date(),
    };

    const applicationRef = await db.collection("applications").add(applicationData);
    
    res.status(201).json({ 
      message: "Course application submitted!",
      applicationId: applicationRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's applications
router.get("/applications/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const applicationsSnap = await db.collection("applications")
      .where("studentId", "==", studentId)
      .get();

    const applications = [];
    
    for (const doc of applicationsSnap.docs) {
      const application = { id: doc.id, ...doc.data() };
      
      // Get course details
      const courseDoc = await db.collection("courses").doc(application.courseId).get();
      if (courseDoc.exists) {
        application.courseDetails = courseDoc.data();
      }
      
      // Get institution details
      const institutionDoc = await db.collection("institutions").doc(application.institutionId).get();
      if (institutionDoc.exists) {
        application.institutionDetails = institutionDoc.data();
      }
      
      applications.push(application);
    }
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Withdraw application
router.delete("/applications/:applicationId", authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    await db.collection("applications").doc(applicationId).delete();
    
    res.status(200).json({ message: "Application withdrawn successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View admission status
router.get("/admissions/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const admissionsSnap = await db
      .collection("applications")
      .where("studentId", "==", studentId)
      .where("status", "in", ["admitted", "rejected", "pending"])
      .get();

    const admissions = [];
    admissionsSnap.forEach((doc) => admissions.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(admissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload transcript
router.post("/uploadTranscript", authenticateToken, async (req, res) => {
  try {
    const { studentId, transcriptUrl } = req.body;

    await db.collection("students").doc(studentId).update({
      transcriptUrl,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Transcript uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job recommendations
router.get("/jobs/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const jobsSnap = await db.collection("jobs")
      .where("status", "==", "active")
      .where("deadline", ">", new Date())
      .get();
    
    const jobs = [];
    jobsSnap.forEach(doc => jobs.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for job
router.post("/apply-job", authenticateToken, async (req, res) => {
  try {
    const { studentId, jobId } = req.body;

    // Check if already applied
    const existingApp = await db.collection("jobApplications")
      .where("studentId", "==", studentId)
      .where("jobId", "==", jobId)
      .get();

    if (!existingApp.empty) {
      return res.status(400).json({ error: "Already applied for this job" });
    }

    // Get student and job data
    const studentDoc = await db.collection("students").doc(studentId).get();
    const jobDoc = await db.collection("jobs").doc(jobId).get();

    if (!studentDoc.exists || !jobDoc.exists) {
      return res.status(404).json({ error: "Student or job not found" });
    }

    const studentData = studentDoc.data();
    const jobData = jobDoc.data();

    // Create job application
    const jobApplication = {
      studentId,
      jobId,
      studentName: studentData.name,
      studentEmail: studentData.email,
      jobTitle: jobData.title,
      companyName: jobData.companyName,
      status: "pending",
      appliedAt: new Date(),
    };

    await db.collection("jobApplications").add(jobApplication);
    
    res.status(201).json({ message: "Job application submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;