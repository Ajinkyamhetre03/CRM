
import User from "../../../Models/User.js";
import bcrypt from "bcryptjs";

const UserCURD = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select("-password"); // Exclude password field
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    ,
    // Additional CRUD operations can be added here
    createUser: async (req, res) => {
        try {
            const newUser = new User(req.body);
            await newUser.save();

            // Convert to plain object and exclude password
            const { password, ...userWithoutPassword } = newUser.toObject();

            res.status(201).json(userWithoutPassword);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(400).json({ error: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;

            // Step 1: Fetch existing user
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Step 2: Update fields from request body
            for (const key in req.body) {
                if (key === "password") {
                    user.password = await bcrypt.hash(req.body.password, 10);
                } else {
                    user[key] = req.body[key];
                }
            }

            // Step 3: Save updated user
            await user.save();

            // Step 4: Remove password from response
            const { password, ...userWithoutPassword } = user.toObject();

            res.json(userWithoutPassword);
        } catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                return res.status(400).json({ error: `${field} already exists` });
            }

            console.error("Error updating user:", error);
            res.status(400).json({ error: "Bad request" });
        }
    }
    ,
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(400).json({ error: "Bad request" });
        }
    }

};

export default UserCURD;
