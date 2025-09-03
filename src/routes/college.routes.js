// src/routes/college.routes.js
import express from "express";
import { requireFirebaseUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

import { createCollege, getColleges } from "../controllers/college.controller.js";
import { addDepartment, getDepartments } from "../controllers/department.controller.js";

const router = express.Router();

// College routes - Remove role restriction for viewing colleges during onboarding
router.post("/", requireFirebaseUser, requireRole(["SUPER_ADMIN", "COLLEGE_ADMIN"]), createCollege);
router.get("/", requireFirebaseUser, getColleges); // ✅ Allow all authenticated users

// Department routes - Remove role restriction for viewing departments during onboarding  
router.post("/:collegeId/departments", requireFirebaseUser, requireRole(["SUPER_ADMIN", "COLLEGE_ADMIN"]), addDepartment);
router.get("/:collegeId/departments", requireFirebaseUser, getDepartments); // ✅ Allow all authenticated users

export default router;