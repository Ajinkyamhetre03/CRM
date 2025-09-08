import User from "../../../Models/User.js";
import jwt from "jsonwebtoken";

const Auth = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // 1. Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // 2. Compare passwords
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Update online status
            user.isOnline = true;
            user.isTabVisible = true;
            await user.save();

            // 3. Generate JWT token
            const token = jwt.sign(
                { id: user._id, role: user.role, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "9h" }
            );

            // 4. Convert to plain object and remove password
            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;

            // 5. Send response
            res.status(200).json({
                message: "Login successful",
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;
            
            // Get token from Authorization header
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ error: 'Access token required' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Validate input
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ 
                    error: 'Current password, new password, and confirm password are required' 
                });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: 'New password and confirm password do not match' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'New password must be at least 6 characters long' });
            }

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Verify current password
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(401).json({ error: "Current password is incorrect" });
            }

            // Update password (assuming your User model has a method to hash passwords)
            user.password = newPassword; // This should trigger pre-save middleware to hash the password
            await user.save();

            res.status(200).json({
                message: "Password reset successful"
            });

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            console.error("Error resetting password:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export default Auth;