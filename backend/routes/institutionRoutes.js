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

// Get institution profile
router.get("/profile/:instituteId", authenticateToken, async (req, res) => {
  try {
    const { instituteId } = req.params;
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
router.patch("/profile/:instituteId", authenticateToken, async (req, res) => {
  try {
    const { instituteId } = req.params;
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
router.get("/faculties/:instituteId", authenticateToken, async (req, res) => {
  try {
    const { instituteId } = req.params;
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
    const { instituteId, name, description } = req.body;

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
router.get("/courses/:instituteId", authenticateToken, async (req, res) => {
  try {
    const { instituteId } = req.params;
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
    const { instituteId, name, faculty, duration, requirements, description, tuitionFee, capacity } = req.body;

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
router.get("/applications/:instituteId", authenticateToken, async (req, res) => {
  try {
    const { instituteId } = req.params;
    
    const applicationsSnap = await db.collection("applications")
      .where("institutionId", "==", instituteId)
      .get();

    const applications = [];
    
    for (const doc of applicationsSnap.docs) {
      const application = { id: doc.id, ...doc.data() };
      
      // Get student details
      const studentDoc = await db.collection("students").doc(application.studentId).get();
      if (studentDoc.exists) {
        application.studentName = studentDoc.data().name;
        application.studentEmail = studentDoc.data().email;
        application.studentPhone = studentDoc.data().phone;
      }
      
      // Get course details
      const courseDoc = await db.collection("courses").doc(application.courseId).get();
      if (courseDoc.exists) {
        application.courseName = courseDoc.data().name;
        application.courseFaculty = courseDoc.data().faculty;
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

    // Check if student is already admitted elsewhere
    if (status === 'admitted') {
      const applicationDoc = await db.collection("applications").doc(applicationId).get();
      const applicationData = applicationDoc.data();
      
      // Check if student has other admitted applications
      const otherAdmissions = await db.collection("applications")
        .where("studentId", "==", applicationData.studentId)
        .where("status", "==", "admitted")
        .get();

      if (!otherAdmissions.empty) {
        return res.status(400).json({ 
          error: "Student already admitted to another institution. Please wait for student to choose." 
        });
      }
    }

    await db.collection("applications").doc(applicationId).update({
      status,
      updatedAt: new Date(),
      ...(status === 'admitted' && { admittedAt: new Date() })
    });

    res.status(200).json({ message: `Application ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admitted students
router.get("/admissions/:instituteId", authenticateToken, async (req, res) => {
  try {
    const { instituteId } = req.params;
    
    const admissionsSnap = await db.collection("applications")
      .where("institutionId", "==", instituteId)
      .where("status", "==", "admitted")
      .get();

    const admissions = [];
    
    for (const doc of admissionsSnap.docs) {
      const admission = { id: doc.id, ...doc.data() };
      
      // Get student details
      const studentDoc = await db.collection("students").doc(admission.studentId).get();
      if (studentDoc.exists) {
        admission.studentName = studentDoc.data().name;
        admission.studentEmail = studentDoc.data().email;
        admission.studentPhone = studentDoc.data().phone;
      }
      
      // Get course details
      const courseDoc = await db.collection("courses").doc(admission.courseId).get();
      if (courseDoc.exists) {
        admission.courseName = courseDoc.data().name;
      }
      
      admissions.push(admission);
    }
    
    res.status(200).json(admissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish admissions
router.post("/publish-admissions", authenticateToken, async (req, res) => {
  try {
    const { instituteId } = req.body;
    
    // Get all pending applications and set them to waiting if not admitted
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
      updated: pendingApps.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;