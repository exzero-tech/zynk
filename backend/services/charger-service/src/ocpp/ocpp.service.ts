import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OCPPService {
  /**
   * Register or update a charge point in the database
   */
  async registerChargePoint(chargePointId: string, bootData: any) {
    try {
      // Check if charger already exists
      const existingCharger = await prisma.charger.findFirst({
        where: { ocppChargePointId: chargePointId }
      });

      let charger;
      if (existingCharger) {
        // Update existing charger
        charger = await prisma.charger.update({
          where: { id: existingCharger.id },
          data: { status: 'AVAILABLE' }
        });
      } else {
        // Create a system user if it doesn't exist (for unclaimed chargers)
        let systemUser = await prisma.user.findFirst({
          where: { email: 'system@zynk.platform' }
        });

        if (!systemUser) {
          systemUser = await prisma.user.create({
            data: {
              email: 'system@zynk.platform',
              password: 'system', // Not used
              role: 'ADMIN',
              name: 'System',
              isVerified: true
            }
          });
        }

        // Create new charger using data from BootNotification
        charger = await prisma.charger.create({
          data: {
            hostId: systemUser.id, // Will be updated when host claims this charger
            name: `${bootData.chargePointVendor || 'Unknown'} ${bootData.chargePointModel || 'Charger'}`,
            type: 'LEVEL2', // Default - will be updated based on model
            connectorType: 'TYPE2', // Default - will be updated based on model
            powerOutput: 7200, // Default - will be updated based on specifications
            chargingSpeed: '7.2 kW', // Default - will be calculated from power output
            pricePerHour: 0, // No price until configured by host
            ocppChargePointId: chargePointId,
            ocppVersion: '1.6',
            status: 'OFFLINE', // Start offline until location/configuration is set
            vendor: bootData.chargePointVendor,
            description: `Firmware: ${bootData.firmwareVersion || 'Unknown'}, Serial: ${bootData.chargePointSerialNumber || 'Unknown'}`,
            location: { type: 'Point', coordinates: [79.8612, 6.9271] }, // Default Colombo location - will be updated when deployed
            address: `Charge Point ${chargePointId}` // Default - will be updated when deployed
          }
        });
      }

      // Log the OCPP message
      await prisma.ocppMessage.create({
        data: {
          chargePointId,
          messageType: 'BootNotification',
          action: 'BootNotification',
          uniqueId: `boot-${Date.now()}`,
          payload: bootData,
          direction: 'INBOUND'
        }
      });

      return charger;
    } catch (error) {
      console.error('Error registering charge point:', error);
      throw error;
    }
  }

  async updateChargerStatus(chargePointId: string, connectorId: number, status: string, errorCode?: string) {
    try {
      // Map OCPP status to our database status
      const statusMapping: { [key: string]: string } = {
        'Available': 'AVAILABLE',
        'Preparing': 'OCCUPIED',
        'Charging': 'OCCUPIED',
        'SuspendedEVSE': 'OFFLINE',
        'SuspendedEV': 'OCCUPIED',
        'Finishing': 'OCCUPIED',
        'Reserved': 'OCCUPIED',
        'Unavailable': 'OFFLINE',
        'Faulted': 'MAINTENANCE',
      };

      const dbStatus = statusMapping[status] || 'OFFLINE';

      await prisma.charger.updateMany({
        where: { ocppChargePointId: chargePointId },
        data: { status: dbStatus as any }
      });

      // Log the OCPP message
      await prisma.ocppMessage.create({
        data: {
          chargePointId,
          messageType: 'StatusNotification',
          action: 'StatusNotification',
          uniqueId: `status-${Date.now()}`,
          payload: { connectorId, status, errorCode },
          direction: 'INBOUND'
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating charger status:', error);
      throw error;
    }
  }

  async updateChargerConnectionStatus(chargePointId: string, isOnline: boolean) {
    try {
      const status = isOnline ? 'AVAILABLE' : 'OFFLINE';

      await prisma.charger.updateMany({
        where: { ocppChargePointId: chargePointId },
        data: { status: status as any }
      });

      console.log(`Updated charger ${chargePointId} connection status: ${isOnline ? 'online' : 'offline'}`);
      return { success: true };
    } catch (error) {
      console.error('Error updating charger connection status:', error);
      throw error;
    }
  }
}

export const ocppService = new OCPPService();