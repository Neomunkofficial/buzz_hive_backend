// src/controllers/department.controller.js
import prisma from "../../config/prisma.js";

/**
 * Add a new department to a college
 */
export const addDepartment = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { name } = req.body;

    const department = await prisma.department.create({
      data: {
        name,
        college_id: parseInt(collegeId),
      },
    });

    res.json(department);
  } catch (error) {
    console.error("❌ Error creating department:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get departments for a college - Allow all authenticated users
 */
export const getDepartments = async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    console.log("📚 Fetching departments for college:", collegeId);

    const departments = await prisma.department.findMany({
      where: { 
        college_id: parseInt(collegeId) 
      },
      select: {
        department_id: true,
        name: true,
        college_id: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`📋 Found ${departments.length} departments for college ${collegeId}`);
    res.json(departments);
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    res.status(500).json({ error: error.message });
  }
};