-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[];
