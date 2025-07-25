-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "services" TEXT[] DEFAULT ARRAY[]::TEXT[];
