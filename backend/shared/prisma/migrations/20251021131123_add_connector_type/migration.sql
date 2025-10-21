/*
  Warnings:

  - Added the required column `connectorType` to the `chargers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConnectorType" AS ENUM ('TYPE1', 'TYPE2', 'CCS1', 'CCS2', 'CHADEMO', 'TESLA', 'GBT', 'NACS');

-- AlterTable: Add column with default value for existing rows
ALTER TABLE "chargers" ADD COLUMN "connectorType" "ConnectorType";

-- Update existing rows with a default value (TYPE2 is common for Level 2 chargers)
UPDATE "chargers" SET "connectorType" = 'TYPE2' WHERE "connectorType" IS NULL;

-- Make the column required
ALTER TABLE "chargers" ALTER COLUMN "connectorType" SET NOT NULL;
