-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "goals" TEXT[] DEFAULT ARRAY[]::TEXT[];
