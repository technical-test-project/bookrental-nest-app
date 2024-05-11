-- CreateTable
CREATE TABLE `Book` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,

    UNIQUE INDEX `Book_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Member_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookRental` (
    `id` VARCHAR(191) NOT NULL,
    `memberCode` VARCHAR(191) NOT NULL,
    `bookCode` VARCHAR(191) NOT NULL,
    `rentalDate` DATETIME(3) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penalty` (
    `id` VARCHAR(191) NOT NULL,
    `memberCode` VARCHAR(191) NOT NULL,
    `penaltyDateUntil` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookRental` ADD CONSTRAINT `BookRental_memberCode_fkey` FOREIGN KEY (`memberCode`) REFERENCES `Member`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookRental` ADD CONSTRAINT `BookRental_bookCode_fkey` FOREIGN KEY (`bookCode`) REFERENCES `Book`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penalty` ADD CONSTRAINT `Penalty_memberCode_fkey` FOREIGN KEY (`memberCode`) REFERENCES `Member`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;
