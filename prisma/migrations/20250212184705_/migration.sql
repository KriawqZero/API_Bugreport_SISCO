/*
  Warnings:

  - You are about to drop the `BugReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `BugReport`;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(20) NOT NULL,
    `emailUsuario` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `passosReproducao` TEXT NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `navegador` VARCHAR(255) NULL,
    `sistemaOperacional` VARCHAR(255) NULL,
    `prioridade` VARCHAR(50) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'aberto',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anexo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `feedbackId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Anexo` ADD CONSTRAINT `Anexo_feedbackId_fkey` FOREIGN KEY (`feedbackId`) REFERENCES `Feedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
