/**
 * Middleware for Role-based Access Control
 * Usage: checkRole("SUPER_ADMIN"), checkRole("COLLEGE_ADMIN")
 */

export const requireRole  = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user; // set by requireFirebaseUser

      if (!user || !user.role) {
        return res.status(403).json({ error: "Unauthorized: role missing" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};
