/*
  Warnings:

  - You are about to drop the column `Content` on the `Message` table. All the data in the column will be lost.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdOn` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "Content",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdOn" INTEGER NOT NULL;
