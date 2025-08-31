import express from "express";
import UserCURD from '../Controllers/SuperAdmin/UserCURD.js';
import {getEmailTrackingStats} from '../Controllers/SuperAdmin/Auth.js';
import { auth } from '../../middleware/auth.js'
import { checkRoleAndDepartment } from '../../middleware/roleCheck.js'
import { getApiStats } from "../../middleware/apiTracker.js";
const router = express.Router();

// auth checker
router.use(auth)

router.use(
    checkRoleAndDepartment(
        ["superadmin"],  // Allowed roles
        []              // Allowed departments
    )
);


// user routes Curd
router.get("/alluser", UserCURD.getAllUsers);
router.post("/createuser", UserCURD.createUser);
router.put("/updateuser/:id", UserCURD.updateUser);
router.delete("/deleteuser/:id", UserCURD.deleteUser);

router.get("/stats", (req, res) => { res.json(getApiStats()); });

router.get('/email-tracking-stats', getEmailTrackingStats);



export default router;
