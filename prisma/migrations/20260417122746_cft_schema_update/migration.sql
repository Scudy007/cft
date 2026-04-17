/*
  Warnings:

  - The values [ON_PROGESS] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `category` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `system` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('L1', 'L2', 'L3', 'ADMIN');

-- CreateEnum
CREATE TYPE "Criticality" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
ALTER TABLE "Issue" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Issue" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Issue" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "assignedToUserId" TEXT,
ADD COLUMN     "category" VARCHAR(255) NOT NULL,
ADD COLUMN     "criticality" "Criticality" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "discoveryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "riskScore" DOUBLE PRECISION,
ADD COLUMN     "system" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" "Role" NOT NULL DEFAULT 'L1',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "issueId" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
