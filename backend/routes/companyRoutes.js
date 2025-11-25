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
  orderBy
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

// Company registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, industry, location, contactPerson, phone, description, website } = req.body;

    // Create user in Firebase Authentication
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Saving company profile in Firestore
    await setDoc(doc(db, "companies", user.uid), {
      name,
      email,
      industry,
      location,
      contactPerson,
      phone,
      description: description || "",
      website: website || "",
      createdAt: new Date(),
      status: "pending", // Companies need admin approval
      role: "company"
    });

    // Create notification for admin
    const adminQuery = query(collection(db, "users"), where("role", "==", "admin"));
    const adminSnapshot = await getDocs(adminQuery);
    
    for (const adminDoc of adminSnapshot.docs) {
      await createNotification(
        adminDoc.id,
        "🏢 New Company Registration",
        `${name} has registered and is waiting for approval.`,
        'info',
        '/admin/companies'
      );
    }

    res.status(201).json({
      message: "Company registered successfully! Waiting for admin approval.",
      companyId: user.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Company login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Firebase Auth
    const userCredential = await auth.signInWithEmailAndPassword(auth.getAuth(), email, password);
    const user = userCredential.user;

    // Get company data from Firestore
    const companyDoc = await getDoc(doc(db, "companies", user.uid));
    
    if (!companyDoc.exists()) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    const companyData = companyDoc.data();

    // Check if company is approved
    if (companyData.status !== 'active') {
      return res.status(403).json({ 
        error: "Company account is pending approval. Please contact administrator." 
      });
    }

    // Get custom token for your app
    const token = await auth.createCustomToken(user.uid);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        uid: user.uid,
        email: user.email,
        role: 'company',
        ...companyData
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

// Get company profile
router.get("/profile/:companyId", authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Verify the company is accessing their own profile
    if (req.user.uid !== companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const companyDoc = await getDoc(doc(db, "companies", companyId));
    
    if (!companyDoc.exists()) {
      return res.status(404).json({ error: "Company not found" });
    }
    
    res.status(200).json({ id: companyDoc.id, ...companyDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update company profile
router.patch("/profile/:companyId", authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Verify the company is updating their own profile
    if (req.user.uid !== companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const updates = req.body;

    await updateDoc(doc(db, "companies", companyId), {
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get company's jobs
router.get("/jobs/:companyId", authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Verify the company is accessing their own jobs
    if (req.user.uid !== companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const jobsRef = collection(db, "jobs");
    const jobsQuery = query(
      jobsRef,
      where("companyId", "==", companyId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(jobsQuery);
    const jobs = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      deadline: doc.data().deadline?.toDate(),
      createdAt: doc.data().createdAt?.toDate()
    }));
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create job posting
router.post("/jobs", authenticateToken, async (req, res) => {
  try {
    const { companyId, title, description, requirements, location, salary, jobType, deadline } = req.body;

    // Verify the company is creating their own job
    if (req.user.uid !== companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get company data
    const companyDoc = await getDoc(doc(db, "companies", companyId));
    if (!companyDoc.exists()) {
      return res.status(404).json({ error: "Company not found" });
    }

    const companyData = companyDoc.data();

    // Create job
    const jobData = {
      companyId,
      companyName: companyData.name,
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      location,
      salary,
      jobType,
      deadline: new Date(deadline),
      status: "active",
      createdAt: new Date(),
      applications: 0
    };

    const jobRef = await addDoc(collection(db, "jobs"), jobData);
    
    res.status(201).json({ 
      message: "Job posted successfully!",
      jobId: jobRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job posting
router.patch("/jobs/:jobId", authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    // Get job to verify ownership
    const jobDoc = await getDoc(doc(db, "jobs", jobId));
    if (!jobDoc.exists()) {
      return res.status(404).json({ error: "Job not found" });
    }

    const job = jobDoc.data();
    
    // Verify the company is updating their own job
    if (req.user.uid !== job.companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Convert deadline to Date if provided
    if (updates.deadline) {
      updates.deadline = new Date(updates.deadline);
    }

    await updateDoc(doc(db, "jobs", jobId), {
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Job updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job posting
router.delete("/jobs/:jobId", authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Get job to verify ownership
    const jobDoc = await getDoc(doc(db, "jobs", jobId));
    if (!jobDoc.exists()) {
      return res.status(404).json({ error: "Job not found" });
    }

    const job = jobDoc.data();
    
    // Verify the company is deleting their own job
    if (req.user.uid !== job.companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if there are applications for this job
    const applicationsQuery = query(
      collection(db, "jobApplications"), 
      where("jobId", "==", jobId)
    );
    const applicationsSnapshot = await getDocs(applicationsQuery);
    
    if (!applicationsSnapshot.empty) {
      return res.status(400).json({ 
        error: "Cannot delete job. There are applications associated with this job." 
      });
    }

    await deleteDoc(doc(db, "jobs", jobId));
    
    res.status(200).json({ message: "Job deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job applications for company
router.get("/applications/:companyId", authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.query;
    
    // Verify the company is accessing their own applications
    if (req.user.uid !== companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const applicationsRef = collection(db, "jobApplications");
    let applicationsQuery;

    if (status && status !== 'all') {
      applicationsQuery = query(
        applicationsRef,
        where("companyId", "==", companyId),
        where("status", "==", status),
        orderBy("appliedAt", "desc")
      );
    } else {
      applicationsQuery = query(
        applicationsRef,
        where("companyId", "==", companyId),
        orderBy("appliedAt", "desc")
      );
    }

    const snapshot = await getDocs(applicationsQuery);
    const applications = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      appliedAt: doc.data().appliedAt?.toDate()
    }));
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status
router.patch("/applications/:applicationId", authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Get application to verify ownership
    const applicationDoc = await getDoc(doc(db, "jobApplications", applicationId));
    if (!applicationDoc.exists()) {
      return res.status(404).json({ error: "Application not found" });
    }

    const application = applicationDoc.data();
    
    // Verify the company is updating their own application
    if (req.user.uid !== application.companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    await updateDoc(doc(db, "jobApplications", applicationId), {
      status,
      updatedAt: new Date(),
    });

    // Create notification for student
    let notificationMessage = "";
    switch (status) {
      case "shortlisted":
        notificationMessage = `You have been shortlisted for ${application.jobTitle} at ${application.companyName}.`;
        break;
      case "rejected":
        notificationMessage = `Your application for ${application.jobTitle} at ${application.companyName} was not successful.`;
        break;
      case "hired":
        notificationMessage = `Congratulations! You have been hired for ${application.jobTitle} at ${application.companyName}.`;
        break;
    }

    if (notificationMessage) {
      await createNotification(
        application.studentId,
        `💼 Application Update - ${application.jobTitle}`,
        notificationMessage,
        status === 'hired' ? 'success' : 'info',
        '/student/jobs'
      );
    }

    res.status(200).json({ message: "Application status updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get qualified applicants (with transcripts)
router.get("/qualified-applicants/:companyId", authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Verify the company is accessing their own data
    if (req.user.uid !== companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const applicationsRef = collection(db, "jobApplications");
    const qualifiedQuery = query(
      applicationsRef,
      where("companyId", "==", companyId),
      where("transcriptUrl", "!=", ""),
      orderBy("appliedAt", "desc")
    );

    const snapshot = await getDocs(qualifiedQuery);
    const qualifiedApplicants = [];

    for (const doc of snapshot.docs) {
      const application = { id: doc.id, ...doc.data() };
      
      // Get student details
      const studentDoc = await getDoc(doc(db, "students", application.studentId));
      if (studentDoc.exists()) {
        application.studentDetails = studentDoc.data();
      }
      
      // Get job details for requirement matching
      const jobDoc = await getDoc(doc(db, "jobs", application.jobId));
      if (jobDoc.exists()) {
        application.jobDetails = jobDoc.data();
        
        // Calculate match score
        let matchScore = 50;
        const jobRequirements = application.jobDetails.requirements;
        
        if (jobRequirements) {
          const requirements = Array.isArray(jobRequirements) ? jobRequirements : [jobRequirements];
          const studentProfile = `${application.studentDetails?.highSchool || ''} ${application.studentDetails?.graduationYear || ''}`.toLowerCase();
          
          requirements.forEach(req => {
            const requirement = req.toLowerCase();
            
            if (requirement.includes('degree') && application.transcriptUrl) {
              matchScore += 20;
            }
            if (requirement.includes('computer science') && studentProfile.includes('science')) {
              matchScore += 15;
            }
            if (requirement.includes('mathematics') && studentProfile.includes('math')) {
              matchScore += 15;
            }
          });
        }
        
        application.matchScore = Math.min(matchScore, 100);
      }
      
      qualifiedApplicants.push(application);
    }

    // Sort by match score
    qualifiedApplicants.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json(qualifiedApplicants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get company dashboard stats
router.get("/dashboard/:companyId", authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Verify the company is accessing their own dashboard
    if (req.user.uid !== companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get jobs count
    const jobsRef = collection(db, "jobs");
    const jobsQuery = query(jobsRef, where("companyId", "==", companyId));
    const jobsSnapshot = await getDocs(jobsQuery);
    
    // Get active jobs count
    const activeJobsQuery = query(
      jobsRef, 
      where("companyId", "==", companyId),
      where("status", "==", "active"),
      where("deadline", ">", new Date())
    );
    const activeJobsSnapshot = await getDocs(activeJobsQuery);

    // Get applications count
    const applicationsRef = collection(db, "jobApplications");
    const applicationsQuery = query(applicationsRef, where("companyId", "==", companyId));
    const applicationsSnapshot = await getDocs(applicationsQuery);

    // Get qualified applicants count
    const qualifiedQuery = query(
      applicationsRef,
      where("companyId", "==", companyId),
      where("transcriptUrl", "!=", "")
    );
    const qualifiedSnapshot = await getDocs(qualifiedQuery);

    // Get interview candidates count
    const interviewQuery = query(
      applicationsRef,
      where("companyId", "==", companyId),
      where("status", "==", "shortlisted")
    );
    const interviewSnapshot = await getDocs(interviewQuery);

    const stats = {
      totalJobs: jobsSnapshot.size,
      activeJobs: activeJobsSnapshot.size,
      totalApplications: applicationsSnapshot.size,
      qualifiedApplicants: qualifiedSnapshot.size,
      interviewCandidates: interviewSnapshot.size
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;