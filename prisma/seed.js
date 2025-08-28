import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userRole.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  await prisma.userRole.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });
}

main()
  .then(() => {
    console.log("✅ Roles seeded");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
