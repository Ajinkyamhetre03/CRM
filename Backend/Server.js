import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";

import { apiTracker } from "./src/middleware/apiTracker.js";

// routes imports
import Authorization from './src/Routes/Route/Authorization.js';
import SuperAdmin from './src/Routes/Route/SuperAdmin.js';
import Hr from './src/Routes/Route/hr.js';
import Candidate from "./src/Routes/Route/candidate.js";
import Manager from './src/Routes/Route/Manager.js';
import Employee from "./src/Routes/Route/Employee.js";
import Intern from "./src/Routes/Route/Intern.js";
import Chat from "./src/Routes/Route/Chat.js";
import userRoutes from './src/Routes/Route/DemoUSer.js';
import Attendance from './src/Routes/Route/Attendance.js'

// import socket handler
import { socketHandler } from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// middlewares
app.use(apiTracker);
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// mongo connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// routes
app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/superadmin", SuperAdmin);
app.use('/api/auth', Authorization);
app.use('/api/hr', Hr);
app.use('/api/candidate', Candidate);
app.use('/api/manager', Manager);
app.use('/api/employee', Employee);
app.use('/api/intern', Intern);
app.use('/api/attendance', Attendance);

if (process.env.DEVELOPMENT === "true") {
  app.use('/api', userRoutes);
}
if (process.env.CHAT === "true") {
  app.use('/api/chat', Chat);
  // setup socket
   socketHandler(io);
}

// 404 handler
app.use((req, res) => res.status(404).send("Route not found"));



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
