import express from "express";
import { db, auth } from "../config/firebase.js";
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

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if user is admin
    const userDoc = await getDoc(doc(db, "users", decodedToken.uid));
    if (!userDoc.exists() || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Firebase Auth
    const userCredential = await auth.signInWithEmailAndPassword(auth.getAuth(), email, password);
    const user = userCredential.user;

    // Verify admin role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Get custom token for your app
    const token = await auth.createCustomToken(user.uid);

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      message: "Admin login successful!",
      user: {
        uid: user.uid,
        email: user.email,
        role: 'admin',
        ...userData
      },
      token: token
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }
});

// Get dashboard statistics
router.get("/dashboard/stats", authenticateAdmin, async (req, res) => {
  try {
    // Get total counts
    const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    const companiesSnapshot = await getDocs(collection(db, 'companies'));
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    const applicationsSnapshot = await getDocs(collection(db, 'applications'));
    const jobsSnapshot = await getDocs(collection(db, 'jobs'));

    // Get pending companies count
    const pendingCompaniesQuery = query(collection(db, 'companies'), where('status', '==', 'pending'));
    const pendingCompaniesSnapshot = await getDocs(pendingCompaniesQuery);

    // Get students with transcripts
    const studentsWithTranscriptsQuery = query(
      collection(db, 'students'),
      where('transcriptUrl', '!=', '')
    );
    const studentsWithTranscriptsSnapshot = await getDocs(studentsWithTranscriptsQuery);

    const stats = {
      totalInstitutions: institutionsSnapshot.size,
      totalStudents: studentsSnapshot.size,
      totalCompanies: companiesSnapshot.size,
      totalCourses: coursesSnapshot.size,
      totalApplications: applicationsSnapshot.size,
      totalJobs: jobsSnapshot.size,
      pendingCompanies: pendingCompaniesSnapshot.size,
      studentsWithTranscripts: studentsWithTranscriptsSnapshot.size
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all institutions
router.get("/institutions", authenticateAdmin, async (req, res) => {
  try {
    const institutionsRef = collection(db, 'institutions');
    const snapshot = await getDocs(institutionsRef);
    const institutions = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
    
    res.status(200).json(institutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update institution status
router.patch("/institutions/:institutionId/status", authenticateAdmin, async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { status } = req.body;

    await updateDoc(doc(db, 'institutions', institutionId), {
      status,
      updatedAt: new Date()
    });

    res.status(200).json({ message: `Institution ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete institution
router.delete("/institutions/:institutionId", authenticateAdmin, async (req, res) => {
  try {
    const { institutionId } = req.params;

    // Check if institution has courses
    const coursesQuery = query(collection(db, 'courses'), where('institutionId', '==', institutionId));
    const coursesSnapshot = await getDocs(coursesQuery);
    
    if (!coursesSnapshot.empty) {
      return res.status(400).json({ 
        error: "Cannot delete institution. There are courses associated with this institution." 
      });
    }

    await deleteDoc(doc(db, 'institutions', institutionId));
    
    res.status(200).json({ message: "Institution deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
router.get("/students", authenticateAdmin, async (req, res) => {
  try {
    const { filter } = req.query;
    const studentsRef = collection(db, 'students');
    let studentsQuery;

    if (filter === 'with-transcript') {
      studentsQuery = query(studentsRef, where('transcriptUrl', '!=', ''));
    } else if (filter === 'without-transcript') {
      studentsQuery = query(studentsRef, where('transcriptUrl', '==', ''));
    } else {
      studentsQuery = studentsRef;
    }

    const snapshot = await getDocs(studentsQuery);
    const students = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student status
router.patch("/students/:studentId/status", authenticateAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;

    await updateDoc(doc(db, 'students', studentId), {
      status,
      updatedAt: new Date()
    });

    res.status(200).json({ message: `Student ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all companies
router.get("/companies", authenticateAdmin, async (req, res) => {
  try {
    const { filter } = req.query;
    const companiesRef = collection(db, 'companies');
    let companiesQuery;

    if (filter && filter !== 'all') {
      companiesQuery = query(companiesRef, where('status', '==', filter));
    } else {
      companiesQuery = companiesRef;
    }

    const snapshot = await getDocs(companiesQuery);
    const companies = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
    
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update company status
router.patch("/companies/:companyId/status", authenticateAdmin, async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.body;

    await updateDoc(doc(db, 'companies', companyId), {
      status,
      updatedAt: new Date()
    });

    res.status(200).json({ message: `Company ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete company
router.delete("/companies/:companyId", authenticateAdmin, async (req, res) => {
  try {
    const { companyId } = req.params;

    // Check if company has job postings
    const jobsQuery = query(collection(db, 'jobs'), where('companyId', '==', companyId));
    const jobsSnapshot = await getDocs(jobsQuery);
    
    if (!jobsSnapshot.empty) {
      return res.status(400).json({ 
        error: "Cannot delete company. There are job postings associated with this company." 
      });
    }

    await deleteDoc(doc(db, 'companies', companyId));
    
    res.status(200).json({ message: "Company deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all applications
router.get("/applications", authenticateAdmin, async (req, res) => {
  try {
    const { filter } = req.query;
    const applicationsRef = collection(db, 'applications');
    let applicationsQuery;

    if (filter && filter !== 'all') {
      applicationsQuery = query(applicationsRef, where('status', '==', filter));
    } else {
      applicationsQuery = query(applicationsRef, orderBy('appliedAt', 'desc'));
    }

    const snapshot = await getDocs(applicationsQuery);
    const applications = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      appliedAt: doc.data().appliedAt?.toDate(),
      admittedAt: doc.data().admittedAt?.toDate()
    }));
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all courses
router.get("/courses", authenticateAdmin, async (req, res) => {
  try {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    const courses = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
    
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed reports
router.get("/reports/detailed", authenticateAdmin, async (req, res) => {
  try {
    // Get all data for comprehensive reports
    const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    const companiesSnapshot = await getDocs(collection(db, 'companies'));
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    const applicationsSnapshot = await getDocs(collection(db, 'applications'));
    const jobsSnapshot = await getDocs(collection(db, 'jobs'));

    // Application status breakdown
    const applications = applicationsSnapshot.docs.map(doc => doc.data());
    const applicationStatus = {
      pending: applications.filter(app => app.status === 'pending').length,
      admitted: applications.filter(app => app.status === 'admitted').length,
      confirmed: applications.filter(app => app.status === 'confirmed').length,
      waiting: applications.filter(app => app.status === 'waiting').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      declined: applications.filter(app => app.status === 'declined').length
    };

    // Institution statistics
    const institutions = institutionsSnapshot.docs.map(doc => doc.data());
    const institutionStats = {
      active: institutions.filter(inst => inst.status === 'active').length,
      suspended: institutions.filter(inst => inst.status === 'suspended').length,
      byType: institutions.reduce((acc, inst) => {
        acc[inst.type] = (acc[inst.type] || 0) + 1;
        return acc;
      }, {})
    };

    // Company statistics
    const companies = companiesSnapshot.docs.map(doc => doc.data());
    const companyStats = {
      active: companies.filter(comp => comp.status === 'active').length,
      pending: companies.filter(comp => comp.status === 'pending').length,
      suspended: companies.filter(comp => comp.status === 'suspended').length
    };

    // Student statistics
    const students = studentsSnapshot.docs.map(doc => doc.data());
    const studentsWithTranscripts = students.filter(student => student.transcriptUrl).length;

    const reports = {
      summary: {
        totalInstitutions: institutionsSnapshot.size,
        totalStudents: studentsSnapshot.size,
        totalCompanies: companiesSnapshot.size,
        totalCourses: coursesSnapshot.size,
        totalApplications: applicationsSnapshot.size,
        totalJobs: jobsSnapshot.size
      },
      applicationStatus,
      institutionStats,
      companyStats,
      studentStats: {
        total: studentsSnapshot.size,
        withTranscripts: studentsWithTranscripts,
        withoutTranscripts: studentsSnapshot.size - studentsWithTranscripts,
        transcriptRate: studentsSnapshot.size > 0 ? 
          (studentsWithTranscripts / studentsSnapshot.size * 100).toFixed(1) + '%' : '0%'
      }
    };

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new institution (admin only)
router.post("/institutions", authenticateAdmin, async (req, res) => {
  try {
    const { name, email, password, type, location, contactPerson, phone } = req.body;

    // Create user in Firebase Authentication
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Create institution profile in Firestore
    await setDoc(doc(db, "institutions", user.uid), {
      name,
      email,
      type,
      location,
      contactPerson,
      phone,
      status: "active",
      address: "",
      website: "",
      description: "",
      established: "",
      createdAt: new Date(),
      role: "institution"
    });

    res.status(201).json({
      message: "Institution created successfully!",
      institutionId: user.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// System maintenance - bulk operations
router.post("/maintenance/cleanup", authenticateAdmin, async (req, res) => {
  try {
    const { operation } = req.body;

    switch (operation) {
      case 'remove_old_applications':
        // Remove applications older than 1 year
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        const oldApplicationsQuery = query(
          collection(db, 'applications'),
          where('appliedAt', '<', oneYearAgo),
          where('status', 'in', ['rejected', 'declined'])
        );
        
        const oldApplicationsSnapshot = await getDocs(oldApplicationsQuery);
        const batch = writeBatch(db);
        
        oldApplicationsSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        res.status(200).json({ 
          message: `Removed ${oldApplicationsSnapshot.size} old applications.`,
          removed: oldApplicationsSnapshot.size
        });
        break;

      case 'suspend_inactive_institutions':
        // Suspend institutions with no activity for 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const inactiveInstitutionsQuery = query(
          collection(db, 'institutions'),
          where('updatedAt', '<', sixMonthsAgo),
          where('status', '==', 'active')
        );
        
        const inactiveInstitutionsSnapshot = await getDocs(inactiveInstitutionsQuery);
        const updateBatch = writeBatch(db);
        
        inactiveInstitutionsSnapshot.docs.forEach(doc => {
          updateBatch.update(doc.ref, { status: 'suspended' });
        });
        
        await updateBatch.commit();
        
        res.status(200).json({ 
          message: `Suspended ${inactiveInstitutionsSnapshot.size} inactive institutions.`,
          suspended: inactiveInstitutionsSnapshot.size
        });
        break;

      default:
        res.status(400).json({ error: "Invalid operation" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;