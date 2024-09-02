/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Attachments` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `creatorName` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `engagement` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `isVideo` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `videoViews` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `byPosts` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `campaignName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_executed_investment` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `total_initial_investment` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `url_table` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SocialNetworksType" AS ENUM ('INSTAGRAM', 'TIKTOK');

-- AlterEnum
ALTER TYPE "PostsType" ADD VALUE 'REELS';

-- DropForeignKey
ALTER TABLE "Attachments" DROP CONSTRAINT "Attachments_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "Performance" DROP CONSTRAINT "Performance_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_userEmail_fkey";

-- AlterTable
ALTER TABLE "Attachments" DROP COLUMN "userEmail",
ADD COLUMN     "campaignId" INTEGER;

-- AlterTable
ALTER TABLE "Performance" DROP COLUMN "userEmail",
ADD COLUMN     "campaignId" INTEGER;

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "creatorName",
DROP COLUMN "engagement",
DROP COLUMN "isVideo",
DROP COLUMN "price",
DROP COLUMN "userEmail",
DROP COLUMN "videoViews",
ADD COLUMN     "postsPackId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "byPosts",
DROP COLUMN "campaignName",
DROP COLUMN "color",
DROP COLUMN "estimated_executed_investment",
DROP COLUMN "total_initial_investment",
DROP COLUMN "url_table";

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" SERIAL NOT NULL,
    "urlProfilePicture" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialNetworks" (
    "id" SERIAL NOT NULL,
    "type" "SocialNetworksType" NOT NULL,
    "followers" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "creatorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialNetworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "userId" INTEGER NOT NULL,
    "byPosts" BOOLEAN NOT NULL DEFAULT false,
    "url_table" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsPack" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "campaignId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostsPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriesToCreator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialNetworks_type_username_key" ON "SocialNetworks"("type", "username");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesToCreator_AB_unique" ON "_CategoriesToCreator"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesToCreator_B_index" ON "_CategoriesToCreator"("B");

-- AddForeignKey
ALTER TABLE "SocialNetworks" ADD CONSTRAINT "SocialNetworks_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performance" ADD CONSTRAINT "Performance_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsPack" ADD CONSTRAINT "PostsPack_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_postsPackId_fkey" FOREIGN KEY ("postsPackId") REFERENCES "PostsPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToCreator" ADD CONSTRAINT "_CategoriesToCreator_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToCreator" ADD CONSTRAINT "_CategoriesToCreator_B_fkey" FOREIGN KEY ("B") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
