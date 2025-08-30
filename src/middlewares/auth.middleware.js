// src/middlewares/auth.middleware.js
import auth from "../../config/firebase.js";

export async function requireFirebaseUser(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const decoded = await auth.verifyIdToken(token);
    req.firebaseUser = decoded; // uid, email, phone_number, firebase.sign_in_provider, etc.
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
}
