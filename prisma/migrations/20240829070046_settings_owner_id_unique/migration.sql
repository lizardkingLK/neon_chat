/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Settings_ownerId_key" ON "Settings"("ownerId");
