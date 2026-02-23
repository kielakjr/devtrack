/*
  Warnings:

  - You are about to drop the column `forks` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `lastCommitDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `lastCommitMsg` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `openIssues` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `stars` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "forks",
DROP COLUMN "language",
DROP COLUMN "lastCommitDate",
DROP COLUMN "lastCommitMsg",
DROP COLUMN "lastSyncedAt",
DROP COLUMN "openIssues",
DROP COLUMN "stars";
