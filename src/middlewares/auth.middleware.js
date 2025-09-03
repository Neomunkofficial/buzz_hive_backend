// src/middlewares/auth.middleware.js
import admin from "firebase-admin";
import prisma from "../../config/prisma.js";

export const requireFirebaseUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("🔑 Decoded Token:", decodedToken);

    // Find user in database
    let user = await prisma.user.findUnique({
      where: { phone_number: decodedToken.phone_number },
      include: { 
        role: true,
        college: true,
        department: true 
      }
    });

    // If user doesn't exist, create them during onboarding
    if (!user) {
      console.log("👤 Creating new user for onboarding:", decodedToken.phone_number);
      
      // Get the default STUDENT role
      const studentRole = await prisma.userRole.findFirst({
        where: { name: "STUDENT" }
      });

      if (!studentRole) {
        // Create STUDENT role if it doesn't exist
        const newRole = await prisma.userRole.create({
          data: { name: "STUDENT" }
        });
        
        user = await prisma.user.create({
          data: {
            phone_number: decodedToken.phone_number,
            role_id: newRole.role_id,
            is_verified: true,
            auth_provider: "firebase",
          },
          include: { 
            role: true,
            college: true,
            department: true 
          }
        });
      } else {
        user = await prisma.user.create({
          data: {
            phone_number: decodedToken.phone_number,
            role_id: studentRole.role_id,
            is_verified: true,
            auth_provider: "firebase",
          },
          include: { 
            role: true,
            college: true,
            department: true 
          }
        });
      }
    }

    // Attach user info to request
    req.user = {
      user_id: user.user_id.toString(),
      phone_number: user.phone_number,
      role: user.role.name,
      college_id: user.college_id,
      firebase_uid: decodedToken.uid,
      ...user
    };

    console.log("✅ User authenticated:", {
      user_id: req.user.user_id,
      phone: req.user.phone_number,
      role: req.user.role
    });

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};