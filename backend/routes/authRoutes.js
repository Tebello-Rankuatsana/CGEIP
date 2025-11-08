import express from "express";
import { db, auth } from "../config/firebase.js";

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, dateOfBirth, address, contactPerson, industry, website } = req.body;

    // Create user in Firebase Authentication
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    let userData = {
      name,
      email,
      role,
      createdAt: new Date(),
      status: "active",
    };

    // Add role-specific fields
    if (role === "student") {
      userData = {
        ...userData,
        phone: phone || "",
        dateOfBirth: dateOfBirth || "",
        address: address || "",
        highSchool: "",
        graduationYear: "",
        transcriptUrl: "",
      };
    } else if (role === "institute") {
      userData = {
        ...userData,
        address: address || "",
        contactPerson: contactPerson || "",
        phone: phone || "",
        website: website || "",
        description: "",
      };
    } else if (role === "company") {
      userData = {
        ...userData,
        industry: industry || "",
        website: website || "",
        description: "",
        address: address || "",
        phone: phone || "",
        size: "",
        status: "pending", // Companies need admin approval
      };
    }

    // Save user profile in Firestore
    await db.collection(role + "s").doc(user.uid).set(userData);

    res.status(201).json({
      message: `${role} registered successfully!`,
      userId: user.uid,
      user: { id: user.uid, name, email, role }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In a real implementation, you'd verify with Firebase Auth
    // For now, we'll simulate login by finding the user
    const studentsSnapshot = await db.collection("students").where("email", "==", email).get();
    const institutesSnapshot = await db.collection("institutions").where("email", "==", email).get();
    const companiesSnapshot = await db.collection("companies").where("email", "==", email).get();
    
    let userData = null;
    let userRole = null;

    if (!studentsSnapshot.empty) {
      studentsSnapshot.forEach(doc => {
        userData = { id: doc.id, ...doc.data() };
        userRole = "student";
      });
    } else if (!institutesSnapshot.empty) {
      institutesSnapshot.forEach(doc => {
        userData = { id: doc.id, ...doc.data() };
        userRole = "institute";
      });
    } else if (!companiesSnapshot.empty) {
      companiesSnapshot.forEach(doc => {
        userData = { id: doc.id, ...doc.data() };
        userRole = "company";
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // In a real app, verify password with Firebase Auth
    // For demo purposes, we'll assume successful login
    res.status(200).json({
      message: "Login successful",
      user: userData,
      token: "demo-token-" + userData.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify email
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    // In a real implementation, verify email token
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;