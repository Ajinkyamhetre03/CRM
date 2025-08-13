import express from "express";
import UserCURD from '../Controllers/SuperAdmin/UserCURD.js';
import { auth } from '../../middleware/auth.js'
import { checkRole } from '../../middleware/roleCheck.js'
const router = express.Router();

// auth checker
router.use(auth)

// Role checker
router.use(checkRole('superadmin'))


// user routes Curd
router.get("/alluser", UserCURD.getAllUsers);
router.post("/createuser", UserCURD.createUser);
router.put("/updateuser/:id", UserCURD.updateUser);
router.delete("/deleteuser/:id", UserCURD.deleteUser);

export default router;
