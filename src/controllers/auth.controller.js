// src/controllers/auth.controller.js
import { ok, created, badRequest } from "../utils/response.js";
import { ensureRoleSeed, findOrCreateUserFromFirebase } from "../services/user.service.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    await ensureRoleSeed(); // make sure "user" role exists
    const decoded = req.firebaseUser; // set by middleware
    const user = await findOrCreateUserFromFirebase(decoded);
    return ok(res, { uid: decoded.uid, user }, "Token verified & user synced");
  } catch (e) {
    next(e);
  }
};

// (Optional) complete profile after Google sign-in
export const completeProfile = async (req, res, next) => {
  try {
    const { user_id, phone_number, ...rest } = req.body;
    if (!user_id) return badRequest(res, "user_id is required");

    const updated = await prisma.user.update({
      where: { user_id: BigInt(user_id) },
      data: { phone_number, ...rest },
    });

    return created(res, updated, "Profile updated");
  } catch (e) {
    next(e);
  }
};
