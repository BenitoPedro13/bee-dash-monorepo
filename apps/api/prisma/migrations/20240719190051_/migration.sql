/*
  Warnings:

  - You are about to drop the column `performanceId` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_performanceId_fkey";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "performanceId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
