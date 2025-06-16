-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(50) NULL,
    `position` VARCHAR(255) NULL,
    `department` VARCHAR(255) NULL,
    `company_id` VARCHAR(36) NULL,
    `joinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `avatarUrl` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `bio` TEXT NULL,
    `skills` TEXT NULL,
    `certifications` TEXT NULL,
    `languages` TEXT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_company_id_idx`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `companies_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(36) NOT NULL,
    `nomProjet` VARCHAR(255) NOT NULL,
    `societe` VARCHAR(255) NULL,
    `responsableRealisation` VARCHAR(255) NULL,
    `priorite` VARCHAR(50) NULL,
    `dateDebutPrevue` DATETIME(3) NULL,
    `dateFinPrevue` DATETIME(3) NULL,
    `commentaires` TEXT NULL,
    `budget` DOUBLE NULL,
    `materials` TEXT NULL,
    `materialBudget` DOUBLE NULL,
    `validite` VARCHAR(50) NULL,
    `serviceDemandeur` VARCHAR(255) NULL,
    `demandeur` VARCHAR(255) NULL,
    `site` VARCHAR(255) NULL,
    `unite` VARCHAR(255) NULL,
    `intervenant` VARCHAR(255) NULL,
    `etat` VARCHAR(100) NULL,
    `pourcentageAvance` INTEGER NULL,
    `dateDebutReelle` DATETIME(3) NULL,
    `dateFinReelle` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
