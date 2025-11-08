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

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  // In a real app, check if user has admin role
  // For now, we'll assume all authenticated users can access admin routes
  next();
};

// Get all institutions
router.get("/institutions", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const institutionsSnap = await db.collection("institutions").get();
    const institutions = [];
    institutionsSnap.forEach(doc => institutions.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(institutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add institution
router.post("/institutions", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, address, contactPerson, phone, website } = req.body;

    const institutionData = {
      name,
      email,
      address,
      contactPerson,
      phone,
      website,
      status: "active",
      createdAt: new Date(),
    };

    const institutionRef = await db.collection("institutions").add(institutionData);
    
    res.status(201).json({ 
      message: "Institution added successfully!",
      institutionId: institutionRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update institution
router.put("/institutions/:institutionId", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { institutionId } = req.params;
    const updates = req.body;

    await db.collection("institutions").doc(institutionId).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Institution updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete institution
router.delete("/institutions/:institutionId", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { institutionId } = req.params;
    
    await db.collection("institutions").doc(institutionId).delete();
    
    res.status(200).json({ message: "Institution deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all companies
router.get("/companies", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const companiesSnap = await db.collection("companies").get();
    const companies = [];
    companiesSnap.forEach(doc => companies.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve company
router.put("/companies/:companyId/approve", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { companyId } = req.params;

    await db.collection("companies").doc(companyId).update({
      status: "approved",
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Company approved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suspend company
router.put("/companies/:companyId/suspend", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { companyId } = req.params;

    await db.collection("companies").doc(companyId).update({
      status: "suspended",
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Company suspended successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete company
router.delete("/companies/:companyId", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { companyId } = req.params;
    
    await db.collection("companies").doc(companyId).delete();
    
    res.status(200).json({ message: "Company deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
router.get("/students", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const studentsSnap = await db.collection("students").get();
    const students = [];
    studentsSnap.forEach(doc => students.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending approvals (companies with pending status)
router.get("/pending-approvals", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pendingCompaniesSnap = await db.collection("companies")
      .where("status", "==", "pending")
      .get();
    
    const pendingApprovals = [];
    pendingCompaniesSnap.forEach(doc => pendingApprovals.push({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(pendingApprovals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system reports
router.get("/reports", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get basic statistics
    const [institutionsSnap, studentsSnap, companiesSnap, applicationsSnap, jobsSnap] = await Promise.all([
      db.collection("institutions").get(),
      db.collection("students").get(),
      db.collection("companies").get(),
      db.collection("applications").get(),
      db.collection("jobs").get()
    ]);

    const totalApplications = applicationsSnap.size;
    const admittedApplications = applicationsSnap.docs.filter(doc => doc.data().status === 'admitted').length;
    const admissionRate = totalApplications > 0 ? ((admittedApplications / totalApplications) * 100).toFixed(1) : 0;

    // Get popular courses
    const coursesSnap = await db.collection("courses").get();
    const popularCourses = await Promise.all(
      coursesSnap.docs.slice(0, 5).map(async (doc) => {
        const course = doc.data();
        const applicationsCount = await db.collection("applications")
          .where("courseId", "==", doc.id)
          .get();
        
        return {
          name: course.name,
          applications: applicationsCount.size
        };
      })
    );

    // Get institution stats
    const institutionStats = await Promise.all(
      institutionsSnap.docs.slice(0, 5).map(async (doc) => {
        const institution = doc.data();
        const coursesCount = await db.collection("courses")
          .where("institutionId", "==", doc.id)
          .get();
        
        const applicationsCount = await db.collection("applications")
          .where("institutionId", "==", doc.id)
          .get();
        
        const admittedCount = applicationsCount.docs.filter(app => app.data().status === 'admitted').length;
        const institutionAdmissionRate = applicationsCount.size > 0 ? 
          ((admittedCount / applicationsCount.size) * 100).toFixed(1) : 0;

        return {
          name: institution.name,
          totalCourses: coursesCount.size,
          applications: applicationsCount.size,
          admissionRate: institutionAdmissionRate
        };
      })
    );

    res.status(200).json({
      totalInstitutions: institutionsSnap.size,
      totalStudents: studentsSnap.size,
      totalCompanies: companiesSnap.size,
      totalJobs: jobsSnap.size,
      totalApplications,
      admissionRate,
      popularCourses: popularCourses.sort((a, b) => b.applications - a.applications),
      institutionStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system overview stats for dashboard
router.get("/dashboard-stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [institutionsSnap, studentsSnap, companiesSnap, pendingCompaniesSnap] = await Promise.all([
      db.collection("institutions").get(),
      db.collection("students").get(),
      db.collection("companies").get(),
      db.collection("companies").where("status", "==", "pending").get()
    ]);

    res.status(200).json({
      totalInstitutions: institutionsSnap.size,
      totalStudents: studentsSnap.size,
      totalCompanies: companiesSnap.size,
      pendingApprovals: pendingCompaniesSnap.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;