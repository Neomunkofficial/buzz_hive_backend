-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SocialType" AS ENUM ('INSTAGRAM', 'SNAPCHAT', 'LINKEDIN', 'GITHUB', 'SPOTIFY');

-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('POST', 'EVENT');

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" BIGSERIAL NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "password_hash" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT,
    "dob" TIMESTAMP(3),
    "gender" "public"."Gender",
    "role_id" INTEGER NOT NULL,
    "college_id" INTEGER,
    "department" TEXT,
    "batch_year" INTEGER,
    "id_card_front" TEXT,
    "id_card_back" TEXT,
    "dp" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "role_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "public"."College" (
    "college_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "College_pkey" PRIMARY KEY ("college_id")
);

-- CreateTable
CREATE TABLE "public"."UserPhoto" (
    "photo_id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "UserPhoto_pkey" PRIMARY KEY ("photo_id")
);

-- CreateTable
CREATE TABLE "public"."Interest" (
    "interest_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("interest_id")
);

-- CreateTable
CREATE TABLE "public"."UserInterest" (
    "user_id" BIGINT NOT NULL,
    "interest_id" INTEGER NOT NULL,

    CONSTRAINT "UserInterest_pkey" PRIMARY KEY ("user_id","interest_id")
);

-- CreateTable
CREATE TABLE "public"."SocialLink" (
    "social_id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "type" "public"."SocialType" NOT NULL,
    "url" TEXT,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("social_id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "post_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "type" "public"."PostType" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" BIGINT NOT NULL,
    "college_id" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "event_id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "location" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "comment_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" BIGINT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "public"."Like" (
    "like_id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" BIGINT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("like_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "public"."User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_name_key" ON "public"."UserRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "College_name_key" ON "public"."College"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_name_key" ON "public"."Interest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_post_id_key" ON "public"."Event"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_user_id_post_id_key" ON "public"."Like"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."UserRole"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "public"."College"("college_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPhoto" ADD CONSTRAINT "UserPhoto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInterest" ADD CONSTRAINT "UserInterest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInterest" ADD CONSTRAINT "UserInterest_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "public"."Interest"("interest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SocialLink" ADD CONSTRAINT "SocialLink_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "public"."College"("college_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;
