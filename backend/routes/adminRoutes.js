import express from "express";
import { db, auth } from "../config/firebase.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await auth.createUser({ email, password, displayName: name });

    await db.collection("admins").doc(user.uid).set({
      name,
      email,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/addInstitution", async (req, res) => {
  try {
    const { name, description } = req.body;

    const docRef = await db.collection("institutions").add({
      name,
      description,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Institution added successfully!",
      id: docRef.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/addCourse", async (req, res) => {
  try {
    const { institutionId, faculty, name, minRequirement } = req.body;

    const ref = await db.collection("courses").add({
      institutionId,
      faculty,
      name,
      minRequirement,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Course added successfully!", id: ref.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/company/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'approved', 'suspended'

    await db.collection("companies").doc(id).update({ status });

    res.status(200).json({ message: `Company ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/reports", async (req, res) => {
  try {
    const [inst, studs, comps] = await Promise.all([
      db.collection("institutions").get(),
      db.collection("students").get(),
      db.collection("companies").get(),
    ]);

    res.status(200).json({
      institutions: inst.size,
      students: studs.size,
      companies: comps.size,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
