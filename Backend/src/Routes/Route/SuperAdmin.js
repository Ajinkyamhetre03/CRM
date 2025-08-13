import express from "express";
import UserCURD from '../Controllers/SuperAdmin/UserCURD.js';
const router = express.Router();

// Define your routes here
// user routes Curd
router.get("/alluser", UserCURD.getAllUsers);
router.post("/createuser", UserCURD.createUser);
router.put("/updateuser/:id", UserCURD.updateUser);
router.delete("/deleteuser/:id", UserCURD.deleteUser);

export default router;
