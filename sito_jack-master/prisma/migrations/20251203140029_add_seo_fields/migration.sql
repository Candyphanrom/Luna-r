-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "faq" JSONB,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "specs" JSONB;
