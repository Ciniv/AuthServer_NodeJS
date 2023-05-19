/*
  Warnings:

  - Added the required column `email` to the `RefreshJWT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RefreshJWT` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `RefreshJWT` ADD CONSTRAINT `RefreshJWT_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
