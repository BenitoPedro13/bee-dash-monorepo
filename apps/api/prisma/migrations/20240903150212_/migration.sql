-- AlterTable
ALTER TABLE "PostsPack" ADD COLUMN     "creatorId" INTEGER;

-- AddForeignKey
ALTER TABLE "PostsPack" ADD CONSTRAINT "PostsPack_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
