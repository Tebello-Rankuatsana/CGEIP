import express from "express";
import { db, auth } from "../config/firebase.js";

const router = express.Router();

//TODO:Testing the student routes
// student registration
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
    });

    res.status(201).json({
      message: "Student registered successfully!",
      studentId: user.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// student login
// Backend admin SDK cannot verify passwords directly —
// this will be handled on the frontend with Firebase Auth.
// This route is just a placeholder for future JWT logic.
router.post("/login", async (req, res) => {
  res.status(501).json({
    message:
      "Login should be handled on the frontend using Firebase Authentication.",
  });
});

// updating student information
router.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await db.collection("students").doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// applying for a course
router.post("/apply", async (req, res) => {
  try {
    const { studentId, institutionId, courseId } = req.body;

// Fetch student's previous applications
    const studentRef = db.collection("students").doc(studentId);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists)
      return res.status(404).json({ error: "Student not found" });

    const studentData = studentDoc.data();

// Restricting to 2 courses per institution
    const applicationsRef = db
      .collection("applications")
      .where("studentId", "==", studentId)
      .where("institutionId", "==", institutionId);

    const snapshot = await applicationsRef.get();
    if (snapshot.size >= 2) {
      return res
        .status(400)
        .json({ error: "You can only apply for 2 courses per institution." });
    }

// Create a new application
    const newApp = {
      studentId,
      institutionId,
      courseId,
      status: "pending",
      appliedAt: new Date(),
    };

    await db.collection("applications").add(newApp);

    res.status(201).json({ message: "Course application submitted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// view admission status
router.get("/admissions/:studentId", async (req, res) => {
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

// uploading transcripts
router.post("/uploadTranscript", async (req, res) => {
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

// job recommendations for student
router.get("/jobs/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const jobsSnap = await db.collection("jobs").get();
    const jobs = [];

    jobsSnap.forEach((doc) => jobs.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
