import prisma from "../../config/prisma.js";

/**
 * Add a branch under a department
 */
export const addBranch = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { name } = req.body;

    const branch = await prisma.branch.create({
      data: {
        name,
        department_id: parseInt(departmentId),
      },
    });

    res.json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get branches under a department
 */
export const getBranches = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const branches = await prisma.branch.findMany({
      where: { department_id: parseInt(departmentId) },
    });

    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
