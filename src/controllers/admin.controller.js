import prisma from "../../config/prisma.js";

/**
 * POST /api/admin/assign-role
 * Assign a role to a user (only SUPER_ADMIN can do this)
 */
export const assignRole = async (req, res) => {
  try {
    const { user_id, role, college_id } = req.body;

    const validRoles = ["SUPER_ADMIN", "COLLEGE_ADMIN", "STUDENT"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const updatedUser = await prisma.users.update({
      where: { user_id: Number(user_id) },
      data: {
        role,
        college_id: college_id ? Number(college_id) : null,
      },
    });

    res.json({ message: "Role assigned successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
