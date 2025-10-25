/*
  Warnings:

  - You are about to drop the column `finalMeterReadingDriver` on the `charging_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `finalMeterReadingHost` on the `charging_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `initialMeterReadingDriver` on the `charging_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `initialMeterReadingHost` on the `charging_sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ocppChargePointId]` on the table `chargers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ocppChargePointId` on table `chargers` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OcppTransactionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'STOPPED');

-- CreateEnum
CREATE TYPE "OcppStatus" AS ENUM ('AVAILABLE', 'PREPARING', 'CHARGING', 'SUSPENDED_EVSE', 'SUSPENDED_EV', 'FINISHING', 'RESERVED', 'UNAVAILABLE', 'FAULTED', 'OFFLINE');

-- AlterTable
ALTER TABLE "chargers" ADD COLUMN     "ocppStatus" "OcppStatus" DEFAULT 'OFFLINE',
ADD COLUMN     "ocppVersion" TEXT,
ALTER COLUMN "ocppChargePointId" SET NOT NULL;

-- AlterTable
ALTER TABLE "charging_sessions" DROP COLUMN "finalMeterReadingDriver",
DROP COLUMN "finalMeterReadingHost",
DROP COLUMN "initialMeterReadingDriver",
DROP COLUMN "initialMeterReadingHost",
ADD COLUMN     "connectorId" INTEGER,
ADD COLUMN     "endMeterReading" DECIMAL(10,2),
ADD COLUMN     "finalDriverReading" DECIMAL(10,2),
ADD COLUMN     "finalHostReading" DECIMAL(10,2),
ADD COLUMN     "initialDriverReading" DECIMAL(10,2),
ADD COLUMN     "initialHostReading" DECIMAL(10,2),
ADD COLUMN     "startMeterReading" DECIMAL(10,2),
ALTER COLUMN "ocppTransactionId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "ocpp_transactions" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "connectorId" INTEGER NOT NULL,
    "idTag" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "startMeterValue" DECIMAL(10,2) NOT NULL,
    "endMeterValue" DECIMAL(10,2),
    "energyConsumed" DECIMAL(10,2),
    "status" "OcppTransactionStatus" NOT NULL DEFAULT 'ACTIVE',
    "chargingSessionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocpp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocpp_messages" (
    "id" SERIAL NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "direction" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocpp_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ocpp_transactions_transactionId_key" ON "ocpp_transactions"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ocpp_transactions_chargingSessionId_key" ON "ocpp_transactions"("chargingSessionId");

-- CreateIndex
CREATE INDEX "ocpp_messages_chargePointId_createdAt_idx" ON "ocpp_messages"("chargePointId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "chargers_ocppChargePointId_key" ON "chargers"("ocppChargePointId");

-- AddForeignKey
ALTER TABLE "ocpp_transactions" ADD CONSTRAINT "ocpp_transactions_chargingSessionId_fkey" FOREIGN KEY ("chargingSessionId") REFERENCES "charging_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocpp_transactions" ADD CONSTRAINT "ocpp_transactions_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "chargers"("ocppChargePointId") ON DELETE RESTRICT ON UPDATE CASCADE;
