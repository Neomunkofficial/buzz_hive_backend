// src/controllers/college.controller.js
import prisma from "../../config/prisma.js";

/**
 * Create a new college
 * Only SUPER_ADMIN allowed
 */
export const createCollege = async (req, res) => {
  try {
    const { name, location } = req.body;

    const college = await prisma.college.create({
      data: { name },
    });

    res.json(college);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get colleges - Allow all authenticated users to view colleges during onboarding
 */
export const getColleges = async (req, res) => {
  try {
    console.log("🏫 Fetching colleges for user:", req.user.role);
    
    // Allow all users (including new users during onboarding) to see all colleges
    const colleges = await prisma.college.findMany({
      select: {
        college_id: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`📋 Found ${colleges.length} colleges`);
    res.json(colleges);
  } catch (error) {
    console.error("❌ Error fetching colleges:", error);
    res.status(500).json({ error: error.message });
  }
};