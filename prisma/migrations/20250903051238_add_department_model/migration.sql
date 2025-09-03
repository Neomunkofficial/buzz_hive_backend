/*
  Warnings:

  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "department",
ADD COLUMN     "department_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."Department" (
    "department_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "college_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_college_id_key" ON "public"."Department"("name", "college_id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."Department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "public"."College"("college_id") ON DELETE CASCADE ON UPDATE CASCADE;
