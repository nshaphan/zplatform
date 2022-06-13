-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID', 'PASSPORT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UN_VERIFIED', 'PENDING', 'VERIFICATION', 'VERIFIED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "documentAttachment" TEXT,
ADD COLUMN     "documentType" "DocumentType",
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "isTwoFactorEnabled" BOOLEAN,
ADD COLUMN     "loginLinkToken" TEXT,
ADD COLUMN     "otpToken" TEXT,
ADD COLUMN     "status" "Status" DEFAULT E'UN_VERIFIED',
ALTER COLUMN "profilePhoto" DROP NOT NULL;
