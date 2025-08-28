import prisma from "../../config/prisma.js";

export const findOrCreateUser = async (userData) => {
  const { email, phone_number, auth_provider, role_id } = userData;

  let user = null;

  // First try finding user by email or phone
  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  } else if (phone_number) {
    user = await prisma.user.findUnique({ where: { phone_number } });
  }

  // If not found, create a new one
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        phone_number,
        password_hash: userData.password_hash || "", // blank if Firebase auth
        auth_provider,
        role_id, // pass a default role_id (like "user")
      },
    });
  }

  return user;
};
