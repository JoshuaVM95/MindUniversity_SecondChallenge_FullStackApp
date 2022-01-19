-- CreateTable
CREATE TABLE `account` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `name` VARCHAR(255) NOT NULL,
    `client` VARCHAR(255) NOT NULL,
    `lead` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `createdBy` CHAR(36) NOT NULL,
    `updatedBy` CHAR(36) NULL,
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isArchived` BOOLEAN NULL DEFAULT false,

    INDEX `account_createdby_foreign`(`createdBy`),
    INDEX `account_lead_foreign`(`lead`),
    INDEX `account_updatedby_foreign`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `useraccount` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `user` CHAR(36) NOT NULL,
    `account` CHAR(36) NOT NULL,
    `initDate` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `endDate` TIMESTAMP(0) NULL,
    `addedBy` CHAR(36) NOT NULL,
    `removedBy` CHAR(36) NULL,
    `position` VARCHAR(255) NOT NULL,

    INDEX `useraccount_account_foreign`(`account`),
    INDEX `useraccount_addedby_foreign`(`addedBy`),
    INDEX `useraccount_removedby_foreign`(`removedBy`),
    INDEX `useraccount_user_foreign`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `salt` VARCHAR(255) NOT NULL,
    `isSuper` BOOLEAN NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isArchived` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `user_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userinfo` (
    `id` CHAR(36) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `createdBy` CHAR(36) NOT NULL,
    `updatedBy` CHAR(36) NULL,
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isAdmin` BOOLEAN NULL DEFAULT false,
    `englishLevel` VARCHAR(255) NULL,
    `technicalSkills` VARCHAR(255) NULL,
    `cvLink` VARCHAR(255) NULL,

    INDEX `userinfo_createdby_foreign`(`createdBy`),
    INDEX `userinfo_updatedby_foreign`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_accountTouseraccount` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_accountTouseraccount_AB_unique`(`A`, `B`),
    INDEX `_accountTouseraccount_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_createdby_foreign` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_lead_foreign` FOREIGN KEY (`lead`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_updatedby_foreign` FOREIGN KEY (`updatedBy`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `useraccount` ADD FOREIGN KEY (`account`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `useraccount` ADD CONSTRAINT `useraccount_addedby_foreign` FOREIGN KEY (`addedBy`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `useraccount` ADD CONSTRAINT `useraccount_removedby_foreign` FOREIGN KEY (`removedBy`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `useraccount` ADD CONSTRAINT `useraccount_user_foreign` FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_createdby_foreign` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_id_foreign` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_updatedby_foreign` FOREIGN KEY (`updatedBy`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_accountTouseraccount` ADD FOREIGN KEY (`A`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_accountTouseraccount` ADD FOREIGN KEY (`B`) REFERENCES `useraccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
