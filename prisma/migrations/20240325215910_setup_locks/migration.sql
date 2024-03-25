-- CreateEnum
CREATE TYPE "LOCK_STATUS" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LOCK_TYPE" AS ENUM ('ACCOUNT', 'USER');

-- CreateTable
CREATE TABLE "Lock" (
    "id" TEXT NOT NULL,
    "type" "LOCK_TYPE" NOT NULL,
    "lockedAt" TIMESTAMP(3),
    "unlockAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL,
    "status" "LOCK_STATUS" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "accountId" TEXT,

    CONSTRAINT "Lock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lock" ADD CONSTRAINT "Lock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lock" ADD CONSTRAINT "Lock_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
