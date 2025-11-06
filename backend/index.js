import express from 'express';
const app = express();
import cors from 'cors';
import 'dotenv/config.js';
import studentRoutes from './routes/studentRoutes.js';


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('<h1>Backend is running.<h1>');
});

app.use("/api/student", studentRoutes);

// just insuring the route is working
app.get("/api/student",(req, res) => {
  res.status(200).json({ message: "Route found" });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`backend is running on port ${port}`);
});