/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "creatorId",
ADD COLUMN     "socialNetworkId" INTEGER;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_socialNetworkId_fkey" FOREIGN KEY ("socialNetworkId") REFERENCES "SocialNetworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
