// seedUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../Models/User.js"; // Adjust path to your User model

dotenv.config();

const getYearCode = () => new Date().getFullYear().toString().slice(-2);

const roleCodeMap = {
  manager: "M",
  employee: "E",
  intern: "I"
};

const deptCodeMap = {
  hr: "HR",
  iot: "IO",
  software: "SW",
  financial: "FN",
  business: "BN"
};

const globalRoleCodeMap = {
  ceo: "CE",
  admin: "AM",
  superadmin: "SA"
};

const seedUsers = async () => {
  try {
    await mongoose.connect("mongodb+srv://coppercloud2023:sOoFdXTHbRmv6vQ8@cluster0.imnm6.mongodb.net/MyPlatfromIOT", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Connected to MongoDB");

    const departments = ["hr", "iot", "software", "financial", "business"];
    const users = [];
    const yearCode = getYearCode();

    // Counters for numbering
    const globalCounters = { CE: 1, AM: 1, SA: 1 };
    const deptCounters = {};

    // Initialize department counters
    for (const dept of departments) {
      for (const role in roleCodeMap) {
        deptCounters[`${dept}${role}`] = 1;
      }
    }

    // Global roles without department
    ["ceo", "superadmin", "admin"].forEach(role => {
      const code = globalRoleCodeMap[role];
      const number = String(globalCounters[code]++).padStart(3, "0");
      const employeeCode = `EMP${yearCode}${code}${number}`;

      users.push({
        employeeCode,
        username: `${role}_user`,
        password: "Password@123", // Will be hashed later
        role,
        email: `${role}@example.com`,
        contact: `+9112345678${number}`,
        Salary: role === "ceo" ? 300000 : role === "superadmin" ? 250000 : 200000,
        accountType: true,
        status: "active",
        createdBy: "system",
        profileImage:"https://res.cloudinary.com/dpjymq0vc/image/upload/v1750147101/cld-sample-2.jpg"
      });
    });

    // Department-based roles
    for (const dept of departments) {
      for (const role in roleCodeMap) {
        const deptCode = deptCodeMap[dept];
        const roleCode = roleCodeMap[role];
        const counterKey = `${dept}${role}`;
        const number = String(deptCounters[counterKey]++).padStart(3, "0");

        const employeeCode = `EMP${yearCode}${deptCode}${roleCode}${number}`;

        users.push({
          employeeCode,
          username: `${dept}_${role}`,
          password: "Password@123", // Will be hashed later
          role,
          department: dept,
          email: `${dept}.${role}@example.com`,
          contact: `+91123456${Math.floor(1000 + Math.random() * 8999)}`,
          Salary: role === "manager" ? 90000 : role === "employee" ? 45000 : 15000,
          accountType: false,
          status: "active",
          createdBy: "system"
        });
      }
    }

    // Hash all passwords before inserting
    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Clear old data
    await User.deleteMany({});
    console.log("🗑️ Old users removed");

    // Insert new users
    await User.insertMany(users);
    console.log("✅ Users inserted successfully");

    mongoose.connection.close();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    mongoose.connection.close();
  }
};

seedUsers();
