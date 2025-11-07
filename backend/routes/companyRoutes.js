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

    await db.collection("companies").doc(user.uid).set({
      name,
      email,
      status: "pending",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Company registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/postJob", async (req, res) => {
  try {
    const { companyId, title, description, requirements } = req.body;

    const ref = await db.collection("jobs").add({
      companyId,
      title,
      description,
      requirements,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Job posted successfully!", id: ref.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/applicants/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const appsSnap = await db
      .collection("applications")
      .where("jobId", "==", jobId)
      .get();

    const applicants = [];
    appsSnap.forEach((doc) => applicants.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/updateProfile/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;
    const updates = req.body;

    await db.collection("companies").doc(companyId).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Company profile updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
