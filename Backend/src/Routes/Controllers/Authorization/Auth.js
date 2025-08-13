import User from "../../../Models/User.js";
import jwt from "jsonwebtoken";

const Auth = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

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

            // 3. Generate JWT token
            const token = jwt.sign(
                { id: user._id, role: user.role, email: user.email }, // Payload
                process.env.JWT_SECRET, // Secret key from .env
                { expiresIn: "24h" } // Token expiry
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
};

export default Auth;
