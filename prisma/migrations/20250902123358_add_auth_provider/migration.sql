-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "auth_provider" VARCHAR(20) DEFAULT 'phone';
