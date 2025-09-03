import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // make sure bcryptjs is installed

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  const userRole = await prisma.userRole.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  await prisma.userRole.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  // Create dummy users
  const password = "Test1234"; // plain password for testing
  const hashedPassword = await bcrypt.hash(password, 10); // bcrypt hash

  await prisma.user.upsert({
    where: { phone_number: "9998887777" },
    update: {},
    create: {
      phone_number: "9998887777",
      password_hash: hashedPassword,
      is_verified: true,
      is_active: true,
      role_id: userRole.role_id, // use the role_id from upsert above
      name: "Test User",
      dob: new Date("2000-01-01"),
      gender: "MALE",
    },
  });

  console.log("✅ Roles and test user seeded");
}

main()
  .then(() => {
    console.log("Seed finished");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
