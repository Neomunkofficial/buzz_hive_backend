import prisma from "../../config/prisma.js";

/**
 * Middleware to verify college access
 */
export const verifyCollegeAccess = async (req, res, next) => {
  try {
    const user = req.user; // comes from requireFirebaseUser
    const { collegeId } = req.params;

    if (!user || !user.role) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // SUPER_ADMIN → unrestricted
    if (user.role === "SUPER_ADMIN" || user.role === "STUDENT") {
      return next();
    }

    // COLLEGE_ADMIN / STUDENT → must match their assigned college
    if (["COLLEGE_ADMIN", "STUDENT"].includes(user.role)) {
      if (Number(user.college_id) !== Number(collegeId)) {
        return res.status(403).json({ error: "Access denied to this college" });
      }
      return next();
    }

    return res.status(403).json({ error: "Unauthorized role" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
