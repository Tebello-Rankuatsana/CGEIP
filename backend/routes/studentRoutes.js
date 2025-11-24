import express from "express";
import { db, auth } from "../config/firebase.js";
import { createNotification } from "../utility/notifications.js";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  writeBatch 
} from "firebase/firestore";

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
    await setDoc(doc(db, "students", user.uid), {
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
      role: "student"
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
    const userCredential = await auth.signInWithEmailAndPassword(auth.getAuth(), email, password);
    const user = userCredential.user;

    // Get custom token for your app
    const token = await auth.createCustomToken(user.uid);

    // Get student data from Firestore
    const studentDoc = await getDoc(doc(db, "students", user.uid));
    
    if (!studentDoc.exists()) {
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
    
    // Verify the student is accessing their own profile
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const studentDoc = await getDoc(doc(db, "students", studentId));
    
    if (!studentDoc.exists()) {
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
    
    // Verify the student is updating their own profile
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const updates = req.body;

    await updateDoc(doc(db, "students", studentId), {
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

    // Verify the student is applying for themselves
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Fetch student
    const studentDoc = await getDoc(doc(db, "students", studentId));

    if (!studentDoc.exists()) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if already applied to 2 courses in this institution
    const applicationsRef = collection(db, "applications");
    const applicationsQuery = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("institutionId", "==", institutionId)
    );

    const snapshot = await getDocs(applicationsQuery);
    if (snapshot.size >= 2) {
      return res.status(400).json({ error: "You can only apply for 2 courses per institution." });
    }

    // Check if already applied to this specific course
    const existingAppQuery = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("courseId", "==", courseId)
    );
    const existingAppSnapshot = await getDocs(existingAppQuery);

    if (!existingAppSnapshot.empty) {
      return res.status(400).json({ error: "Already applied for this course" });
    }

    // Get course and institution details
    const courseDoc = await getDoc(doc(db, "courses", courseId));
    const institutionDoc = await getDoc(doc(db, "institutions", institutionId));

    if (!courseDoc.exists() || !institutionDoc.exists()) {
      return res.status(404).json({ error: "Course or institution not found" });
    }

    const courseData = courseDoc.data();
    const institutionData = institutionDoc.data();
    const studentData = studentDoc.data();

    // Check if student meets course requirements (basic check)
    if (courseData.requirements && courseData.requirements.includes("LGCSE") && 
        !studentData.highSchool) {
      return res.status(400).json({ 
        error: "You do not meet the minimum requirements for this course. Please complete your profile." 
      });
    }

    // Create application
    const applicationData = {
      studentId,
      institutionId,
      courseId,
      courseName: courseData.name,
      institutionName: institutionData.name,
      studentName: studentData.name,
      studentEmail: studentData.email,
      status: "pending",
      appliedAt: new Date(),
    };

    const applicationRef = await addDoc(collection(db, "applications"), applicationData);
    
    // Create notification for student
    await createNotification(
      studentId,
      "📝 Application Submitted",
      `Your application for ${courseData.name} at ${institutionData.name} has been submitted successfully.`,
      'info',
      '/student/applications'
    );

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
    
    // Verify the student is accessing their own applications
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const applicationsRef = collection(db, "applications");
    const applicationsQuery = query(
      applicationsRef,
      where("studentId", "==", studentId),
      orderBy("appliedAt", "desc")
    );

    const snapshot = await getDocs(applicationsQuery);
    const applications = [];

    for (const doc of snapshot.docs) {
      const application = { id: doc.id, ...doc.data() };
      
      // Get course details
      const courseDoc = await getDoc(doc(db, "courses", application.courseId));
      if (courseDoc.exists()) {
        application.courseDetails = courseDoc.data();
      }
      
      // Get institution details
      const institutionDoc = await getDoc(doc(db, "institutions", application.institutionId));
      if (institutionDoc.exists()) {
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
    
    // Get application to verify ownership
    const applicationDoc = await getDoc(doc(db, "applications", applicationId));
    if (!applicationDoc.exists()) {
      return res.status(404).json({ error: "Application not found" });
    }

    const application = applicationDoc.data();
    
    // Verify the student is withdrawing their own application
    if (req.user.uid !== application.studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if application can be withdrawn (only pending applications)
    if (application.status !== 'pending') {
      return res.status(400).json({ 
        error: "Cannot withdraw application. Application status is: " + application.status 
      });
    }

    await deleteDoc(doc(db, "applications", applicationId));
    
    res.status(200).json({ message: "Application withdrawn successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View admission status
router.get("/admissions/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Verify the student is accessing their own admissions
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const applicationsRef = collection(db, "applications");
    const admissionsQuery = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("status", "in", ["admitted", "rejected", "pending", "waiting", "confirmed"])
    );

    const snapshot = await getDocs(admissionsQuery);
    const admissions = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      admissions.push({ 
        id: doc.id, 
        ...data,
        // Convert Firestore timestamp to JavaScript Date
        appliedAt: data.appliedAt?.toDate(),
        admittedAt: data.admittedAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });

    res.status(200).json(admissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload transcript
router.post("/uploadTranscript", authenticateToken, async (req, res) => {
  try {
    const { studentId, transcriptUrl } = req.body;

    // Verify the student is uploading their own transcript
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    await updateDoc(doc(db, "students", studentId), {
      transcriptUrl,
      transcriptUploadedAt: new Date(),
      updatedAt: new Date(),
    });

    // Create notification for student
    await createNotification(
      studentId,
      "📄 Transcript Uploaded",
      "Your academic transcript has been uploaded successfully and is now available for job applications.",
      'success',
      '/student/transcript'
    );

    res.status(200).json({ message: "Transcript uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job recommendations
router.get("/jobs/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Verify the student is accessing their own job recommendations
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const jobsRef = collection(db, "jobs");
    const jobsQuery = query(
      jobsRef,
      where("status", "==", "active"),
      where("deadline", ">", new Date())
    );
    
    const snapshot = await getDocs(jobsQuery);
    const jobs = [];
    
    snapshot.forEach(doc => {
      const jobData = doc.data();
      jobs.push({ 
        id: doc.id, 
        ...jobData,
        deadline: jobData.deadline?.toDate()
      });
    });

    // Get student data for personalized recommendations
    const studentDoc = await getDoc(doc(db, "students", studentId));
    const studentData = studentDoc.data();

    // Basic recommendation logic based on student profile
    const recommendedJobs = jobs.filter(job => {
      // Check if student has required qualifications
      if (job.requirements) {
        const requirements = job.requirements.toLowerCase();
        if (requirements.includes("degree") && !studentData.transcriptUrl) {
          return false;
        }
        if (requirements.includes("computer science") && 
            studentData.highSchool && 
            !studentData.highSchool.toLowerCase().includes("science")) {
          return false;
        }
      }
      return true;
    });

    res.status(200).json(recommendedJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for job
router.post("/apply-job", authenticateToken, async (req, res) => {
  try {
    const { studentId, jobId } = req.body;

    // Verify the student is applying for themselves
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if already applied
    const jobApplicationsRef = collection(db, "jobApplications");
    const existingAppQuery = query(
      jobApplicationsRef,
      where("studentId", "==", studentId),
      where("jobId", "==", jobId)
    );

    const existingAppSnapshot = await getDocs(existingAppQuery);

    if (!existingAppSnapshot.empty) {
      return res.status(400).json({ error: "Already applied for this job" });
    }

    // Get student and job data
    const studentDoc = await getDoc(doc(db, "students", studentId));
    const jobDoc = await getDoc(doc(db, "jobs", jobId));

    if (!studentDoc.exists() || !jobDoc.exists()) {
      return res.status(404).json({ error: "Student or job not found" });
    }

    const studentData = studentDoc.data();
    const jobData = jobDoc.data();

    // Check if student has uploaded transcript for degree-required jobs
    if (jobData.requirements && jobData.requirements.toLowerCase().includes("degree") && 
        !studentData.transcriptUrl) {
      return res.status(400).json({ 
        error: "This job requires a degree. Please upload your academic transcript first." 
      });
    }

    // Create job application
    const jobApplication = {
      studentId,
      jobId,
      studentName: studentData.name,
      studentEmail: studentData.email,
      studentPhone: studentData.phone,
      studentAddress: studentData.address,
      highSchool: studentData.highSchool,
      graduationYear: studentData.graduationYear,
      transcriptUrl: studentData.transcriptUrl,
      jobTitle: jobData.title,
      companyName: jobData.companyName,
      status: "pending",
      appliedAt: new Date(),
    };

    await addDoc(collection(db, "jobApplications"), jobApplication);
    
    // Create notification for student
    await createNotification(
      studentId,
      "💼 Job Application Submitted",
      `Your application for ${jobData.title} at ${jobData.companyName} has been submitted successfully.`,
      'info',
      '/student/jobs'
    );

    // Create notification for company (simplified - in real app, you'd have company notifications)
    
    res.status(201).json({ message: "Job application submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept admission offer
router.post("/admissions/accept", authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.body;
    const studentId = req.user.uid;

    // Get the application
    const applicationDoc = await getDoc(doc(db, "applications", applicationId));
    if (!applicationDoc.exists()) {
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
    const otherAdmittedAppsQuery = query(
      collection(db, "applications"),
      where("studentId", "==", studentId),
      where("status", "==", "admitted"),
      where("id", "!=", applicationId)
    );

    const otherAdmittedSnapshot = await getDocs(otherAdmittedAppsQuery);

    const batch = writeBatch(db);
    
    // Confirm the selected application
    batch.update(doc(db, "applications", applicationId), { 
      status: 'confirmed', 
      confirmedAt: new Date() 
    });

    // Decline all other admitted applications
    otherAdmittedSnapshot.forEach(doc => {
      batch.update(doc.ref, { 
        status: 'declined', 
        declinedAt: new Date() 
      });
    });

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
      declinedCount: otherAdmittedSnapshot.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student dashboard stats
router.get("/dashboard/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Verify the student is accessing their own dashboard
    if (req.user.uid !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const applicationsRef = collection(db, "applications");
    const applicationsQuery = query(applicationsRef, where("studentId", "==", studentId));
    const applicationsSnapshot = await getDocs(applicationsQuery);
    
    const applications = applicationsSnapshot.docs.map(doc => doc.data());
    
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      admittedApplications: applications.filter(app => app.status === 'admitted').length,
      rejectedApplications: applications.filter(app => app.status === 'rejected').length,
      confirmedApplications: applications.filter(app => app.status === 'confirmed').length
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;