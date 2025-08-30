// src/services/user.service.js
import prisma from "../../config/prisma.js";

export async function findUserByEmailOrPhone({ email, phone_number }) {
  if (email) return prisma.user.findUnique({ where: { email } });
  if (phone_number) return prisma.user.findUnique({ where: { phone_number } });
  return null;
}

export async function ensureRoleSeed() {
  await prisma.userRole.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });
}

export async function findOrCreateUserFromFirebase(decoded) {
  const email = decoded.email ?? null;
  const phone_number = decoded.phone_number ?? null;
  const provider = decoded?.firebase?.sign_in_provider || "google";

  // default role: "user"
  const defaultRole = await prisma.userRole.findUnique({ where: { name: "user" } });
  const role_id = defaultRole?.role_id ?? 1;

  let user = await findUserByEmailOrPhone({ email, phone_number });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        phone_number,
        password_hash: "", // blank for Firebase accounts (you said no hashing yet)
        auth_provider: provider,
        role_id,
      },
    });
  }

  return user;
}
