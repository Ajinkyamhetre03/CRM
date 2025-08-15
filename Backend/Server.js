import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";


// routes imports
import Authorization from './src/Routes/Route/Authorization.js'
import SuperAdmin from './src/Routes/Route/SuperAdmin.js'
import Hr from './src/Routes/Route/hr.js'
import Candidate from "./src/Routes/Route/candidate.js"

import userRoutes from './src/Routes/Route/DemoUSer.js'

dotenv.config();
const app = express();

app.use(morgan("dev"))
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/superadmin", SuperAdmin);
app.use('/api/auth', Authorization)
app.use('/api/hr', Hr)
app.use('/api/candidate', Candidate)

if(process.env.DEVELOPMENT=="true"){

  app.use('/api', userRoutes);
}



app.use((req, res, next) => {
    res.status(404).send("Route not found");
    next();
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
