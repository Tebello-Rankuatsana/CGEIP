import express from "express";
import { db, auth } from "../config/firebase.js";

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

// Get company profile
router.get("/profile/:companyId", authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;
    const companyDoc = await db.collection("companies").doc(companyId).get();
    
    if (!companyDoc.exists) {
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
    const updates = req.body;

    await db.collection("companies").doc(companyId).update({
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
    const jobsSnap = await db.collection("jobs")
      .where("companyId", "==", companyId)
      .get();
    
    const jobs = [];
    jobsSnap.forEach(doc => jobs.push({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post new job
router.post("/jobs", authenticateToken, async (req, res) => {
  try {
    const { companyId, title, department, location, salary, type, description, requirements, qualifications, deadline } = req.body;

    // Get company details
    const companyDoc = await db.collection("companies").doc(companyId).get();
    if (!companyDoc.exists) {
      return res.status(404).json({ error: "Company not found" });
    }

    const companyData = companyDoc.data();

    const jobData = {
      companyId,
      companyName: companyData.name,
      title,
      department,
      location,
      salary,
      type,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      qualifications: Array.isArray(qualifications) ? qualifications : [qualifications],
      deadline: new Date(deadline),
      status: "active",
      createdAt: new Date(),
    };

    const jobRef = await db.collection("jobs").add(jobData);
    
    res.status(201).json({ 
      message: "Job posted successfully!",
      jobId: jobRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job
router.put("/jobs/:jobId", authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    // Handle date conversion for deadline
    if (updates.deadline) {
      updates.deadline = new Date(updates.deadline);
    }

    await db.collection("jobs").doc(jobId).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Job updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job
router.delete("/jobs/:jobId", authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    await db.collection("jobs").doc(jobId).delete();
    
    res.status(200).json({ message: "Job deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job status
router.put("/jobs/:jobId/status", authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    await db.collection("jobs").doc(jobId).update({
      status,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: `Job ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job applications for company
router.get("/applications/:companyId", authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // First get company's jobs
    const jobsSnap = await db.collection("jobs")
      .where("companyId", "==", companyId)
      .get();

    const jobIds = jobsSnap.docs.map(doc => doc.id);
    
    if (jobIds.length === 0) {
      return res.status(200).json([]);
    }

    // Get applications for these jobs
    const applicationsSnap = await db.collection("jobApplications")
      .where("jobId", "in", jobIds)
      .get();

    const applications = [];
    
    for (const doc of applicationsSnap.docs) {
      const application = { id: doc.id, ...doc.data() };
      
      // Get student details
      const studentDoc = await db.collection("students").doc(application.studentId).get();
      if (studentDoc.exists) {
        application.studentDetails = studentDoc.data();
      }
      
      applications.push(application);
    }
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job application status
router.put("/applications/:applicationId", authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    await db.collection("jobApplications").doc(applicationId).update({
      status,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: `Application ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get qualified candidates
router.get("/qualified-candidates", authenticateToken, async (req, res) => {
  try {
    const studentsSnap = await db.collection("students").get();
    
    const candidates = [];
    
    for (const doc of studentsSnap.docs) {
      const student = { id: doc.id, ...doc.data() };
      
      // Calculate match score based on profile completeness and qualifications
      let matchScore = 50; // Base score
      
      if (student.transcriptUrl) matchScore += 20;
      if (student.highSchool) matchScore += 10;
      if (student.graduationYear) matchScore += 10;
      if (student.phone) matchScore += 5;
      if (student.address) matchScore += 5;
      
      candidates.push({
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone || "Not provided",
        highSchool: student.highSchool || "Not specified",
        graduationYear: student.graduationYear || "Not specified",
        transcriptUrl: student.transcriptUrl || null,
        matchScore: Math.min(matchScore, 100)
      });
    }
    
    // Sort by match score (most qualified first)
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Invite candidate to apply
router.post("/invite-candidate", authenticateToken, async (req, res) => {
  try {
    const { companyId, candidateId, jobId, message } = req.body;

    // Get company and job details
    const companyDoc = await db.collection("companies").doc(companyId).get();
    const jobDoc = await db.collection("jobs").doc(jobId).get();

    if (!companyDoc.exists || !jobDoc.exists) {
      return res.status(404).json({ error: "Company or job not found" });
    }

    const companyData = companyDoc.data();
    const jobData = jobDoc.data();

    // Create invitation
    const invitationData = {
      companyId,
      candidateId,
      jobId,
      companyName: companyData.name,
      jobTitle: jobData.title,
      message: message || `We think you'd be a great fit for our ${jobData.title} position!`,
      sentAt: new Date(),
      status: "sent"
    };

    await db.collection("invitations").add(invitationData);
    
    res.status(201).json({ message: "Candidate invited successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;