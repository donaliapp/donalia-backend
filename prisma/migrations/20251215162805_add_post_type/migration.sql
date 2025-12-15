-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('OFFER', 'NEED');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'NEED';
