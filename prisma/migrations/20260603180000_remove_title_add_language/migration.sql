-- AlterTable
ALTER TABLE "Post" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "User" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'zh';
