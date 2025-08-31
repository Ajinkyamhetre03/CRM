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
        { expiresIn: "24h" }
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
}};

export default Auth;
