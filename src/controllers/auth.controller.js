import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { adminAuth } from "../../config/firebase.js";

const prisma = new PrismaClient();

/**
 * Login with phone + password
 */
export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("Login attempt for phone:", phone);

    const user = await prisma.user.findUnique({ where: { phone_number: phone } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.user_id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { ...user, user_id: user.user_id.toString() },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Signup with phone + Firebase OTP
 */
export const signupUser = async (req, res) => {
  try {
    const { phone, idToken } = req.body;
    if (!phone || !idToken) {
      return res.status(400).json({ error: "Phone and ID token are required" });
    }

    // ✅ Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (err) {
      console.error("Firebase token verification failed:", err);
      return res.status(401).json({ error: "Invalid or expired Firebase token" });
    }

    // ✅ (Optional) cross-check phone number from Firebase
    try {
      const firebaseUser = await adminAuth.getUser(decodedToken.uid);
      if (firebaseUser.phoneNumber && firebaseUser.phoneNumber !== phone) {
        return res.status(401).json({ error: "Phone number mismatch" });
      }
    } catch (err) {
      console.warn("Could not fetch Firebase user:", err);
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { phone_number: phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone_number: phone,
          password_hash: await bcrypt.hash("default_password", 10), // temp pw
          auth_provider: "phone",
          is_verified: true,
          role_id: 1,
        },
      });
    }

    // ✅ Issue backend JWT
    const token = jwt.sign(
      { id: user.user_id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { ...user, user_id: user.user_id.toString() },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
