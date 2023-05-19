-- CreateTable
CREATE TABLE `RefreshJWT` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jwt` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RefreshJWT_jwt_key`(`jwt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
