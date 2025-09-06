import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ==============================
  // 1. Seed Roles
  // ==============================
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

  // ==============================
  // 2. Seed Colleges + Departments
  // ==============================
  const colleges = [
    {
      name: "Bharati Vidyapeeth College of Engineering",
      departments: [
        "Computer Science",
        "Electronics and Communication Engineering",
        "Information and Technology",
        "Electrical and Electronics Engineering",
      ],
    },
    {
      name: "Maharaja Surajmal Institute Of Technology",
      departments: [
        "Computer Science",
        "Electronics and Communication Engineering",
        "Information and Technology",
        "Electrical and Electronics Engineering",
      ],
    },
    {
      name: "Maharaja Agrasen Institute Of Technology",
      departments: [
        "Computer Science",
        "Electronics and Communication Engineering",
        "Electronics Engineering",
        "Mechanical Engineering",
        "Information and Technology",
        "Electrical and Electronics Engineering",
        "Instrumentation and Control Engineering",
        "Artificial Intelligence and Machine Learning Engineering",
      ],
    },
  ];

  for (const college of colleges) {
    const createdCollege = await prisma.college.upsert({
      where: { name: college.name },
      update: {},
      create: { name: college.name },
    });

    for (const dept of college.departments) {
      await prisma.department.upsert({
        where: {
          // prevent duplicates for same college + dept
          name_college_id: {
            name: dept,
            college_id: createdCollege.college_id,
          },
        },
        update: {},
        create: {
          name: dept,
          college_id: createdCollege.college_id,
        },
      });
    }
  }

  // ==============================
  // 3. Seed Dummy User
  // ==============================
  const password = "Test1234"; // plain password
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { phone_number: "9998887777" },
    update: {},
    create: {
      phone_number: "9998887777",
      password_hash: hashedPassword,
      is_verified: true,
      is_active: true,
      role_id: userRole.role_id,
      name: "Test User",
      dob: new Date("2000-01-01"),
      gender: "MALE",
    },
  });

  console.log("✅ Roles, Colleges, Departments, and Test User seeded");
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
