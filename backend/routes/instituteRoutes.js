import express from "express";
import { db, auth } from "../config/firebase.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection("institutions").doc(user.uid).set({
      name,
      email,
      faculties: [],
      status: "active",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Institution registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/addFaculty", async (req, res) => {
  try {
    const { institutionId, facultyName } = req.body;

    const ref = await db.collection("faculties").add({
      institutionId,
      facultyName,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Faculty added successfully!", id: ref.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/applications/:institutionId", async (req, res) => {
  try {
    const { institutionId } = req.params;
    const appsSnap = await db
      .collection("applications")
      .where("institutionId", "==", institutionId)
      .get();

    const applications = [];
    appsSnap.forEach((doc) => applications.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/updateStatus/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // admitted / rejected / pending

    await db.collection("applications").doc(applicationId).update({ status });

    res.status(200).json({ message: "Application status updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/updateProfile/:institutionId", async (req, res) => {
  try {
    const { institutionId } = req.params;
    const updates = req.body;

    await db.collection("institutions").doc(institutionId).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Institution profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
