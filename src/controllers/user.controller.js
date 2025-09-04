// src/controllers/user.controller.js
import prisma from "../../config/prisma.js";

/**
 * Update user onboarding data - called at the end of onboarding flow
 */
export const updateOnboardingData = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { 
      name, 
      dob, 
      gender, 
      college_id, 
      department_id, // Changed from 'department' to match your schema
      batch_year, 
      interests,
      id_card_front,
      id_card_back
    } = req.body;

    console.log("🔄 Updating onboarding data for user:", userId);
    console.log("📋 Data received:", req.body);

    // Convert gender to match your enum
    const genderMap = {
      "He/Him": "MALE",
      "She/Her": "FEMALE", 
      "They/Them": "OTHER",
      "Prefer not to say": "OTHER"
    };

    // Parse the data
    const updateData = {
      name: name || null,
      dob: dob ? new Date(dob) : null,
      gender: gender ? genderMap[gender] || null : null,
      college_id: college_id ? parseInt(college_id) : null,
      department_id: department_id ? parseInt(department_id) : null, // Fixed field name
      batch_year: batch_year ? parseInt(batch_year) : null,
      id_card_front,
      id_card_back,
    };

    console.log("🔄 Processed update data:", updateData);

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { user_id: BigInt(userId) },
      data: updateData,
      include: {
        role: true,
        college: true,
        department: true,
      }
    });

    // Handle interests separately if provided
    if (interests && Array.isArray(interests) && interests.length > 0) {
      console.log("🎯 Updating interests:", interests);
      
      // Delete existing interests
      await prisma.userInterest.deleteMany({
        where: { user_id: BigInt(userId) }
      });
      
      // Add new interests
      const interestData = interests.map(interestId => ({
        user_id: BigInt(userId),
        interest_id: parseInt(interestId)
      }));
      
      await prisma.userInterest.createMany({
        data: interestData
      });
    }

    console.log("✅ Onboarding data updated successfully");
    
    res.json({ 
      success: true, 
      message: "Onboarding completed successfully",
      user: {
        user_id: updatedUser.user_id.toString(),
        name: updatedUser.name,
        college: updatedUser.college?.name,
        department: updatedUser.department?.name,
        batch_year: updatedUser.batch_year,
      }
    });

  } catch (error) {
    console.error('❌ Onboarding update error:', error);
    res.status(500).json({ 
      error: error.message,
      details: "Failed to update onboarding data"
    });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { user_id: BigInt(id) },
      include: {
        role: true,
        college: true,
        department: true,
        photos: true,
        interests: {
          include: {
            interest: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await prisma.user.update({
      where: { user_id: BigInt(id) },
      data: updates,
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Assign user to college (legacy function)
 */
export const assignUserToCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { college_id, department_id, batch_year } = req.body;

    const updatedUser = await prisma.user.update({
      where: { user_id: BigInt(id) },
      data: {
        college_id: college_id ? parseInt(college_id) : null,
        department_id: department_id ? parseInt(department_id) : null,
        batch_year: batch_year ? parseInt(batch_year) : null,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user profile with college details
 */
export const getUserProfileWithCollege = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { user_id: BigInt(id) },
      include: {
        college: true,
        department: true,
        role: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};