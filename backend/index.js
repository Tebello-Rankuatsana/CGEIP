import express from 'express';
const app = express();
import cors from 'cors';
import 'dotenv/config.js';


import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import instituteRoutes from "./routes/instituteRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('<h1>Backend is running.<h1>');
});

app.use("/api/student", studentRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/company", companyRoutes);


// just insuring the routes are working
app.get("/api/student",(req, res) => {
  res.status(200).json({ message: "Route found" });
});
app.get("/api/admin",(req, res) => {
  res.status(200).json({ message: "Route found" });
});
app.get("/api/institute",(req, res) => {
  res.status(200).json({ message: "Route found" });
}); 
app.get("/api/company",(req, res) => {
  res.status(200).json({ message: "Route found" });
});


const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`backend is running on port ${port}`);
});