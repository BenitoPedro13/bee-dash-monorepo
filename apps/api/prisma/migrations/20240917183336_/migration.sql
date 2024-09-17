-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "_CampaignToCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignToCategories_AB_unique" ON "_CampaignToCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignToCategories_B_index" ON "_CampaignToCategories"("B");

-- AddForeignKey
ALTER TABLE "_CampaignToCategories" ADD CONSTRAINT "_CampaignToCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToCategories" ADD CONSTRAINT "_CampaignToCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
