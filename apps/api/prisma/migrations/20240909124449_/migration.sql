/*
  Warnings:

  - Made the column `postsPackId` on table `Posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `socialNetworkId` on table `Posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_postsPackId_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_socialNetworkId_fkey";

-- AlterTable
ALTER TABLE "Attachments" ADD COLUMN     "postsId" INTEGER;

-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "city" TEXT;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "comments" INTEGER DEFAULT 0,
ADD COLUMN     "likes" INTEGER DEFAULT 0,
ADD COLUMN     "linkClicks" INTEGER DEFAULT 0,
ADD COLUMN     "saves" INTEGER DEFAULT 0,
ADD COLUMN     "shares" INTEGER DEFAULT 0,
ADD COLUMN     "stickerClicks" INTEGER DEFAULT 0,
ALTER COLUMN "impressions" DROP NOT NULL,
ALTER COLUMN "impressions" SET DEFAULT 0,
ALTER COLUMN "interactions" DROP NOT NULL,
ALTER COLUMN "interactions" SET DEFAULT 0,
ALTER COLUMN "clicks" DROP NOT NULL,
ALTER COLUMN "clicks" SET DEFAULT 0,
ALTER COLUMN "postsPackId" SET NOT NULL,
ALTER COLUMN "socialNetworkId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_socialNetworkId_fkey" FOREIGN KEY ("socialNetworkId") REFERENCES "SocialNetworks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_postsPackId_fkey" FOREIGN KEY ("postsPackId") REFERENCES "PostsPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
