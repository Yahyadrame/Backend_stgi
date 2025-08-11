/*
  Warnings:

  - You are about to drop the column `order` on the `step` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `instruction` DROP FOREIGN KEY `Instruction_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `step` DROP FOREIGN KEY `Step_instructionId_fkey`;

-- DropIndex
DROP INDEX `Instruction_folderId_fkey` ON `instruction`;

-- DropIndex
DROP INDEX `Step_instructionId_fkey` ON `step`;

-- AlterTable
ALTER TABLE `step` DROP COLUMN `order`;

-- AddForeignKey
ALTER TABLE `Instruction` ADD CONSTRAINT `Instruction_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Step` ADD CONSTRAINT `Step_instructionId_fkey` FOREIGN KEY (`instructionId`) REFERENCES `Instruction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
