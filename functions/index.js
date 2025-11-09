import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';

// Import your route files
import studentRoutes from './routes/studentRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Firebase Functions SDK
import * as functions from 'firebase-functions';

// Initialize Express
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Test root route
app.get('/', (req, res) => {
  res.send('<h1>Backend is running.<h1>');
});

// Use your routes
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/institute", institutionRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);

// Example Firestore routes (if using Firebase DB)
app.get("/api/institutions", async (req, res) => {
  try {
    const institutionsSnap = await db.collection("institutions").where("status", "==", "active").get();
    const institutions = [];
    institutionsSnap.forEach(doc => institutions.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(institutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/institutions/:institutionId/courses", async (req, res) => {
  try {
    const { institutionId } = req.params;
    const coursesSnap = await db.collection("courses").where("institutionId", "==", institutionId).get();
    const courses = [];
    coursesSnap.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test routes
app.get("/api/student", (req, res) => res.status(200).json({ message: "Route found" }));
app.get("/api/admin", (req, res) => res.status(200).json({ message: "Route found" }));
app.get("/api/institute", (req, res) => res.status(200).json({ message: "Route found" }));
app.get("/api/company", (req, res) => res.status(200).json({ message: "Route found" }));

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
