import express from "express";
import { db, auth, storage } from "../config/firebase.js";
import { createNotification } from "./notifications.js";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, writeBatch } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const router = express.Router();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    
    // For Firebase Admin SDK, you would verify the token here
    // Since we're using client-side Firebase Auth, we'll trust the token for now
    // In production, implement proper token verification with Firebase Admin
    req.user = { uid: token }; // Simplified for demo
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Student registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, address, highSchool, graduationYear } = req.body;

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save student profile in Firestore
    await setDoc(doc(db, "students", user.uid), {
      name,
      email,
      phone: phone || "",
      dateOfBirth: dateOfBirth || "",
      address: address || "",
      highSchool: highSchool || "",
      graduationYear: graduationYear || "",
      appliedCourses: [],
      status: "active",
      createdAt: new Date(),
      transcriptUrl: "",
      qualifications: [],
      workExperience: []
    });

    res.status(201).json({
      message: "Student registered successfully!",
      studentId: user.uid,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Student login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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
      token: user.uid // Using UID as token for simplicity
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

// Check if student qualifies for course
const checkCourseQualifications = async (studentId, courseId) => {
  try {
    const studentDoc = await getDoc(doc(db, "students", studentId));
    const courseDoc = await getDoc(doc(db, "courses", courseId));
    
    if (!studentDoc.exists() || !courseDoc.exists()) {
      return false;
    }

    const student = studentDoc.data();
    const course = courseDoc.data();

    // Basic qualification check - expand based on your criteria
    if (course.requirements && course.requirements.minGrade) {
      // Implement grade checking logic based on transcript data
      // This is a simplified version
      return true; // For demo purposes
    }

    return true;
  } catch (error) {
    console.error("Qualification check error:", error);
    return false;
  }
};

// Apply for course
router.post("/apply", authenticateToken, async (req, res) => {
  try {
    const { studentId, institutionId, courseId } = req.body;

    // Check if student qualifies for the course
    const qualifies = await checkCourseQualifications(studentId, courseId);
    if (!qualifies) {
      return res.status(400).json({ error: "You do not meet the requirements for this course." });
    }

    // Check if already applied to 2 courses in this institution
    const applicationsQuery = query(
      collection(db, "applications"),
      where("studentId", "==", studentId),
      where("institutionId", "==", institutionId)
    );

    const snapshot = await getDocs(applicationsQuery);
    if (snapshot.size >= 2) {
      return res.status(400).json({ error: "You can only apply for 2 courses per institution." });
    }

    // Check if already applied to this specific course
    const existingAppQuery = query(
      collection(db, "applications"),
      where("studentId", "==", studentId),
      where("courseId", "==", courseId)
    );

    const existingApp = await getDocs(existingAppQuery);
    if (!existingApp.empty) {
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

    // Create application
    const applicationData = {
      studentId,
      institutionId,
      courseId,
      courseName: courseData.name,
      institutionName: institutionData.name,
      status: "pending",
      appliedAt: new Date(),
    };

    const applicationRef = await addDoc(collection(db, "applications"), applicationData);
    
    // Update student's applied courses
    const studentRef = doc(db, "students", studentId);
    const studentDoc = await getDoc(studentRef);
    const currentAppliedCourses = studentDoc.data().appliedCourses || [];
    
    await updateDoc(studentRef, {
      appliedCourses: [...currentAppliedCourses, courseId]
    });

    res.status(201).json({ 
      message: "Course application submitted!",
      applicationId: applicationRef.id 
    });
  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get student's applications
router.get("/applications/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const applicationsQuery = query(
      collection(db, "applications"),
      where("studentId", "==", studentId)
    );

    const applicationsSnap = await getDocs(applicationsQuery);
    const applications = [];
    
    for (const doc of applicationsSnap.docs) {
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
    
    await deleteDoc(doc(db, "applications", applicationId));
    
    res.status(200).json({ message: "Application withdrawn successfully!" });
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

    const batch = writeBatch(db);

    // Confirm the selected application
    batch.update(doc(db, "applications", applicationId), { 
      status: 'confirmed', 
      confirmedAt: new Date() 
    });

    // Get all other applications for this student
    const otherAppsQuery = query(
      collection(db, "applications"),
      where("studentId", "==", studentId),
      where("status", "in", ["admitted", "pending", "waiting"])
    );

    const otherAppsSnap = await getDocs(otherAppsQuery);
    
    for (const otherDoc of otherAppsSnap.docs) {
      if (otherDoc.id !== applicationId) {
        const otherApp = otherDoc.data();
        
        if (otherApp.status === 'admitted') {
          // Decline other admitted applications
          batch.update(otherDoc.ref, { 
            status: 'declined', 
            declinedAt: new Date() 
          });

          // Move first student from waitlist to admitted
          const waitlistQuery = query(
            collection(db, "applications"),
            where("courseId", "==", otherApp.courseId),
            where("status", "==", "waiting"),
            orderBy("appliedAt", "asc"),
            limit(1)
          );

          const waitlistSnap = await getDocs(waitlistQuery);
          if (!waitlistSnap.empty) {
            const firstWaitlist = waitlistSnap.docs[0];
            batch.update(firstWaitlist.ref, { 
              status: 'admitted', 
              admittedAt: new Date() 
            });
          }
        } else {
          // Withdraw pending/waiting applications
          batch.update(otherDoc.ref, { 
            status: 'withdrawn', 
            withdrawnAt: new Date() 
          });
        }
      }
    }

    await batch.commit();

    res.status(200).json({ 
      message: "Admission accepted successfully!",
      confirmedCourse: application.courseName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload transcript
router.post("/uploadTranscript", authenticateToken, async (req, res) => {
  try {
    const { studentId, transcriptUrl } = req.body;

    await updateDoc(doc(db, "students", studentId), {
      transcriptUrl,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Transcript uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job recommendations based on qualifications
router.get("/jobs/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get student profile with qualifications
    const studentDoc = await getDoc(doc(db, "students", studentId));
    if (!studentDoc.exists()) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = studentDoc.data();
    
    // Get all active jobs
    const jobsQuery = query(
      collection(db, "jobs"),
      where("status", "==", "active")
    );
    
    const jobsSnap = await getDocs(jobsQuery);
    const jobs = [];
    
    for (const jobDoc of jobsSnap.docs) {
      const job = { id: jobDoc.id, ...jobDoc.data() };
      
      // Check if student qualifies for this job
      const qualifies = await checkJobQualifications(student, job);
      if (qualifies) {
        jobs.push(job);
      }
    }

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check job qualifications
const checkJobQualifications = async (student, job) => {
  // Implement qualification matching logic
  // This should check:
  // - Academic performance (transcript grades)
  // - Extra certificates
  // - Work experience
  // - Relevance to job requirements
  
  // Simplified version for demo
  if (job.requirements && job.requirements.minEducation) {
    // Check if student meets education requirements
    return true; // For demo purposes
  }
  
  return true;
};

// Apply for job
router.post("/apply-job", authenticateToken, async (req, res) => {
  try {
    const { studentId, jobId } = req.body;

    // Check if already applied
    const existingAppQuery = query(
      collection(db, "jobApplications"),
      where("studentId", "==", studentId),
      where("jobId", "==", jobId)
    );

    const existingApp = await getDocs(existingAppQuery);
    if (!existingApp.empty) {
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

    await addDoc(collection(db, "jobApplications"), jobApplication);
    
    res.status(201).json({ message: "Job application submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;