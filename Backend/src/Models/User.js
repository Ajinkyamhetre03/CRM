// models/User.js
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// Centralized enums
const roles = ['superadmin', 'admin', 'hr', 'manager', 'employee', 'intern', 'ceo'];
const departments = ['hr', 'iot', 'software', 'financial', 'business'];

const userSchema = new mongoose.Schema({
    employeeCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        match: /^EMP\d{3,}$/ // Example: EMP001
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
        default: 'employee'
    },
    department: {
        type: String,
        enum: departments,
        required: true
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
    accountType: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    dateOfJoining: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date,
    createdBy: String,
    profileImage: String
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
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

export default mongoose.model('User', userSchema);
// This code defines a User model with various fields and methods for password hashing and comparison.