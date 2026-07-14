/*
  Warnings:

  - You are about to drop the column `influencerId` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the `Influencers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_influencerId_fkey";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "influencerId",
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Influencers";
