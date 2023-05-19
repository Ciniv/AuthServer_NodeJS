/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `RefreshJWT` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `RefreshJWT_email_key` ON `RefreshJWT`(`email`);
