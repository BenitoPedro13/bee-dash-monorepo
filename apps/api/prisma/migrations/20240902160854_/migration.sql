/*
  Warnings:

  - You are about to drop the column `color` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "color" TEXT;
