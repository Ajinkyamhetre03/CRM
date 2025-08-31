// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Centralized enums
const roles = ["ceo", "superadmin", "admin", "manager", "employee", "intern"];
const departments = ["hr", "iot", "software", "financial", "business"];
const genders = ["male", "female", "trans"];

// Image pool
const imageLinks = [
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618880/ldgzns8nayzkyttqc2oj.jpg",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/m3it88sswp1k6w9qsgmp.jpg",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/qvvd5txuwarxot4jwisb.jpg",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/bhjpomsydazfswiof5nm.jpg",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/o8imgfarxuaihgtmslqb.png",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/nlbrbdro7uwbsgfign8d.jpg",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/yikblioi2jaraj07taum.jpg",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/vmg32bcowvdjqxufjy86.png",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/qr3ohjdzecjqwqrjhr8o.jpg",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/pwksm615qrkyzkuuopum.png",
  "https://res.cloudinary.com/dnz2wikje/image/upload/v1756618879/byrlnibvgjta2jlarzk6.jpg"
];



const userSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: /^EMP\d{2}[A-Z]{2,3}\d{3}$/ // Example: EMP25CE001 or EMP25HRM001
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: roles,
      default: "employee"
    },
    department: {
      type: String,
      enum: departments,
      required: function () {
        return !["ceo", "superadmin", "admin"].includes(this.role);
      }
    },
    gender: {
      type: String,
      enum: genders,
      default: null
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    contact: {
      type: String,
      required: true,
      match: /^\+?\d{10,15}$/ // Allows country codes
    },
    Salary: {
      type: Number,
      required: true,
      min: 0
    },
    accountType: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active"
    },
    dateOfJoining: {
      type: Date,
      default: Date.now
    },
    lastLogin: Date,
    createdBy: String,
    profileImage: {
      type: String,
      default: function () {
        return imageLinks[Math.floor(Math.random() * imageLinks.length)];
      }
    }
    ,
    lastSeen: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },
    isTabVisible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Hash password + sync avatar/profileImage before saving
userSchema.pre("save", async function (next) {
  // Ensure name is always same as username
  if (this.isModified("username")) {
    this.name = this.username;
  }

  // Ensure avatar is same as profileImage
  if (!this.avatar) {
    this.avatar = this.profileImage;
  }

  // Hash password if modified
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
