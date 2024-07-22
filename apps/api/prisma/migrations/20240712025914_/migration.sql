-- CreateEnum
CREATE TYPE "PostsType" AS ENUM ('STORIES', 'FEED', 'TIKTOK');

-- CreateTable
CREATE TABLE "Influencers" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Influencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "type" "PostsType" NOT NULL,
    "isVideo" BOOLEAN NOT NULL,
    "impressions" INTEGER NOT NULL,
    "interactions" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "videoViews" INTEGER NOT NULL,
    "engagement" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "postDate" TIMESTAMP(3) NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "performanceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Influencers_username_key" ON "Influencers"("username");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
