/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- AlterTable
ALTER TABLE "ProjectGoal" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';

-- DropTable
DROP TABLE "Task";
