-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "autoScroll" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
