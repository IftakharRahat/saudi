-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "address" VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN     "contactEmail" VARCHAR(100) NOT NULL DEFAULT '';
