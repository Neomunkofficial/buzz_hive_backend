// src/controllers/user.controller.js
import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";

/**
 * Update Onboarding Data
 */
export const updateOnboardingData = async (req, res) => {
  try {
    const userId = req.user.user_id; // from auth middleware
    const {
      name,
      dob,
      gender,
      college_id,
      department_id,
      batch_year,
      id_card_front,
      id_card_back,
      dp,
      email,
      password,
      show_social_on_profile,
      interests,
      photos,
      socials,
    } = req.body;

    console.log("🔄 Updating onboarding data for user:", userId);

    // ✅ Hash password if provided
    let password_hash = undefined;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // ✅ Map gender to Prisma enum
    const genderMap = {
      male: "MALE",
      female: "FEMALE",
      other: "OTHER",
    };
    let mappedGender = undefined;
    if (gender) {
      const g = gender.toLowerCase();
      if (genderMap[g]) {
        mappedGender = genderMap[g];
      } else {
        return res.status(400).json({ error: `Invalid gender: ${gender}` });
      }
    }

    // ✅ Prepare nested updates
    const updateData = {
      name,
      dob: dob ? new Date(dob) : undefined,
      gender: mappedGender,
      batch_year,
      id_card_front,
      id_card_back,
      dp,
      email,
      password_hash,
      show_social_on_profile,
      updated_at: new Date(),
    };

    // ✅ Connect college & department
    if (college_id) {
      updateData.college = { connect: { college_id: Number(college_id) } };
    }
    if (department_id) {
      updateData.department = { connect: { department_id: Number(department_id) } };
    }

    // ✅ Photos (replace old with new, skip null/empty)
    if (Array.isArray(photos)) {
      const cleanPhotos = photos.filter((url) => url && url.trim() !== "");
      updateData.photos = {
        deleteMany: {}, // remove old
        create: cleanPhotos.map((url) => ({ url })),
      };
    }

    // ✅ Interests (link existing or create new if needed)
    if (Array.isArray(interests)) {
      updateData.interests = {
        deleteMany: {},
        create: interests.map((interestName) => ({
          interest: {
            connectOrCreate: {
              where: { name: interestName },
              create: { name: interestName },
            },
          },
        })),
      };
    }

    // ✅ Socials (replace old with new, mapped to enum)
    if (socials && typeof socials === "object") {
      updateData.socials = {
        deleteMany: {},
        create: Object.entries(socials)
          .filter(([_, url]) => url && url.trim() !== "")
          .map(([platform, url]) => ({
            type: platform.toUpperCase(), // must match SocialType enum
            url,
          })),
      };
    }

    // ✅ Update user
    const updatedUser = await prisma.user.update({
      where: { user_id: BigInt(userId) },
      data: updateData,
      include: {
        role: true,
        college: true,
        department: true,
        photos: true,
        interests: { include: { interest: true } },
        socials: true,
      },
    });

    console.log("✅ Onboarding updated for user:", updatedUser.user_id);
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Onboarding update error:", error);
    res.status(500).json({ error: error.message });
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
    console.error("❌ Error fetching user:", error);
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
    console.error("❌ Error updating user profile:", error);
    res.status(500).json({ error: error.message });
  }
};


/**
 * Assign user to college (legacy)
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
    console.error("❌ Error assigning user to college:", error);
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
    console.error("❌ Error fetching profile with college:", error);
    res.status(500).json({ error: error.message });
  }
};
