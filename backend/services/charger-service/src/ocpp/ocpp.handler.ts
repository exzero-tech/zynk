import { registerChargePointDefault, updateChargerStatusDefault, logOCPPMessageDefault, createOcppTransactionDefault, updateOcppTransactionDefault, calculateEnergyConsumed } from '../services/ocpp.service.js';
import { connectionMetadata } from './ocpp.server.js';

// Handler functions for OCPP messages
// Each handler receives (chargePointId: string, payload: any) and returns response

export async function handleBootNotification(chargePointId: string, payload: any) {
  console.log(`BootNotification from ${chargePointId}:`, payload);

  // Register the charge point
  await registerChargePointDefault(chargePointId, payload);

  // Return acceptance response
  return {
    status: 'Accepted',
    currentTime: new Date().toISOString(),
    interval: 300 // Heartbeat interval in seconds
  };
}

export async function handleStatusNotification(chargePointId: string, payload: any) {
  console.log(`StatusNotification from ${chargePointId}:`, payload);

  // Update charger status
  await updateChargerStatusDefault(chargePointId, {
    connectorId: payload.connectorId,
    status: payload.status,
    errorCode: payload.errorCode
  });

  // StatusNotification has empty response payload
  return {};
}

export async function handleHeartbeat(chargePointId: string, payload: any) {
  console.log(`Heartbeat from ${chargePointId}`);

  // Update last heartbeat time
  const metadata = connectionMetadata.get(chargePointId);
  if (metadata) {
    metadata.lastHeartbeat = new Date();
  }

  // Return current time
  return {
    currentTime: new Date().toISOString()
  };
}

export async function handleAuthorize(chargePointId: string, payload: any) {
  console.log(`Authorize from ${chargePointId}:`, payload);

  try {
    const { idTag } = payload;

    if (!idTag || typeof idTag !== 'string') {
      console.log(`Invalid idTag format: ${idTag}`);
      return {
        idTagInfo: {
          status: 'Invalid',
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          parentIdTag: idTag
        }
      };
    }

    // Validate the idTag against user database
    const validation = await validateIdTag(idTag);

    // Log authorization attempt
    console.log(`Authorization result for idTag ${idTag}: ${validation.status}`);

    // Log the OCPP message
    await logOCPPMessageDefault(
      chargePointId,
      'Authorize',
      'Authorize',
      {
        idTag,
        validationResult: validation.status,
        userId: validation.userId
      }
    );

    return {
      idTagInfo: {
        status: validation.status,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        parentIdTag: idTag
      }
    };

  } catch (error) {
    console.error('Error in handleAuthorize:', error);
    return {
      idTagInfo: {
        status: 'Invalid',
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        parentIdTag: payload?.idTag || 'unknown'
      }
    };
  }
}

export async function handleStartTransaction(chargePointId: string, payload: any) {
  console.log(`StartTransaction from ${chargePointId}:`, payload);

  try {
    const { connectorId, idTag, meterStart, timestamp, reservationId } = payload;

    // Validate required fields
    if (!connectorId || typeof connectorId !== 'number') {
      throw new Error('Invalid connectorId');
    }
    if (!idTag || typeof idTag !== 'string') {
      throw new Error('Invalid idTag');
    }
    if (typeof meterStart !== 'number') {
      throw new Error('Invalid meterStart value');
    }

    // Generate unique transaction ID
    const transactionId = `TXN-${chargePointId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create OCPP transaction record
    const transaction = await createOcppTransactionDefault({
      transactionId,
      chargePointId,
      connectorId,
      idTag,
      startMeterValue: meterStart,
      // TODO: Link to charging session when reservation system is implemented
      // chargingSessionId: reservationId
    });

    // Update charger status to CHARGING
    await updateChargerStatusDefault(chargePointId, {
      connectorId,
      status: 'Charging',
      errorCode: 'NoError'
    });

    // Log the OCPP message
    await logOCPPMessageDefault(
      chargePointId,
      'StartTransaction',
      'StartTransaction',
      {
        transactionId,
        connectorId,
        idTag,
        meterStart,
        timestamp,
        reservationId
      }
    );

    console.log(`Started transaction ${transactionId} for ${chargePointId}, connector ${connectorId}`);

    return {
      transactionId,
      idTagInfo: {
        status: 'Accepted'
      }
    };

  } catch (error) {
    console.error('Error in handleStartTransaction:', error);

    // Log the error
    await logOCPPMessageDefault(
      chargePointId,
      'StartTransaction',
      'StartTransaction',
      {
        payload,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    );

    return {
      transactionId: null,
      idTagInfo: {
        status: 'Blocked',
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    };
  }
}

export async function handleStopTransaction(chargePointId: string, payload: any) {
  console.log(`StopTransaction from ${chargePointId}:`, payload);

  try {
    const { transactionId, idTag, timestamp, meterStop, reason } = payload;

    // Validate required fields
    if (!transactionId || typeof transactionId !== 'string') {
      throw new Error('Invalid transactionId');
    }
    if (!idTag || typeof idTag !== 'string') {
      throw new Error('Invalid idTag');
    }
    if (typeof meterStop !== 'number') {
      throw new Error('Invalid meterStop value');
    }

    // Get the transaction to calculate energy consumed
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const transaction = await prisma.ocppTransaction.findUnique({
      where: { transactionId }
    });

    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    // Calculate energy consumed
    const energyConsumed = calculateEnergyConsumed(Number(transaction.startMeterValue), meterStop);

    // Update OCPP transaction with final values
    await updateOcppTransactionDefault(transactionId, {
      endTime: new Date(timestamp || Date.now()),
      endMeterValue: meterStop,
      energyConsumed,
      status: 'COMPLETED'
    });

    // Update charger status to Available (assuming transaction complete)
    await updateChargerStatusDefault(chargePointId, {
      connectorId: transaction.connectorId,
      status: 'Available',
      errorCode: 'NoError'
    });

    // Log the OCPP message
    await logOCPPMessageDefault(
      chargePointId,
      'StopTransaction',
      'StopTransaction',
      {
        transactionId,
        idTag,
        timestamp,
        meterStop,
        reason,
        energyConsumed
      }
    );

    console.log(`Completed transaction ${transactionId} for ${chargePointId}: ${energyConsumed} kWh consumed`);

    await prisma.$disconnect();

    return {
      idTagInfo: {
        status: 'Accepted'
      }
    };

  } catch (error) {
    console.error('Error in handleStopTransaction:', error);

    // Log the error
    await logOCPPMessageDefault(
      chargePointId,
      'StopTransaction',
      'StopTransaction',
      {
        payload,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    );

    return {
      idTagInfo: {
        status: 'Blocked',
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    };
  }
}

export async function handleMeterValues(chargePointId: string, payload: any) {
  console.log(`MeterValues from ${chargePointId}:`, payload);

  try {
    const { connectorId, transactionId, meterValue } = payload;

    // Validate required fields
    if (!connectorId || typeof connectorId !== 'number') {
      throw new Error('Invalid connectorId');
    }
    if (!Array.isArray(meterValue)) {
      throw new Error('Invalid meterValue format - must be array');
    }

    // Process meter values
    let energyValue = null;
    let powerValue = null;
    let currentValues = [];

    for (const sample of meterValue) {
      if (!sample.sampledValue || !Array.isArray(sample.sampledValue)) {
        continue;
      }

      for (const value of sample.sampledValue) {
        const { value: val, unit, measurand } = value;

        if (measurand === 'Energy.Active.Import.Register' && unit === 'kWh') {
          energyValue = parseFloat(val);
        } else if (measurand === 'Power.Active.Import' && unit === 'W') {
          powerValue = parseFloat(val);
        } else if (measurand?.includes('Current') && unit === 'A') {
          currentValues.push(parseFloat(val));
        }
      }
    }

    // If we have a transaction ID, update the transaction with latest meter values
    if (transactionId && typeof transactionId === 'number') {
      try {
        // Get current transaction to calculate incremental energy
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        const transaction = await prisma.ocppTransaction.findUnique({
          where: { transactionId: transactionId.toString() }
        });

        if (transaction && energyValue !== null) {
          const currentEnergy = Number(transaction.startMeterValue);
          const incrementalEnergy = energyValue - currentEnergy;

          // Update transaction with current meter reading
          await updateOcppTransactionDefault(transactionId.toString(), {
            energyConsumed: Math.max(0, incrementalEnergy)
          });
        }

        await prisma.$disconnect();
      } catch (error) {
        console.warn('Could not update transaction with meter values:', error);
      }
    }

    // Log the OCPP message
    await logOCPPMessageDefault(
      chargePointId,
      'MeterValues',
      'MeterValues',
      {
        connectorId,
        transactionId,
        meterValue,
        processedValues: {
          energyKwh: energyValue,
          powerWatts: powerValue,
          currentAmps: currentValues
        }
      }
    );

    console.log(`Processed meter values for ${chargePointId}: Energy=${energyValue}kWh, Power=${powerValue}W`);

    // MeterValues has empty response payload
    return {};

  } catch (error) {
    console.error('Error in handleMeterValues:', error);

    // Log the error
    await logOCPPMessageDefault(
      chargePointId,
      'MeterValues',
      'MeterValues',
      {
        payload,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    );

    // Return empty response even on error (OCPP spec)
    return {};
  }
}

// Map of action names to handler functions
export const ocppHandlers: { [key: string]: (chargePointId: string, payload: any) => Promise<any> } = {
  BootNotification: handleBootNotification,
  StatusNotification: handleStatusNotification,
  Heartbeat: handleHeartbeat,
  Authorize: handleAuthorize,
  StartTransaction: handleStartTransaction,
  StopTransaction: handleStopTransaction,
  MeterValues: handleMeterValues,
};

// Authorization service functions
export const validateIdTag = async (idTag: string): Promise<{ isValid: boolean; userId?: number; status: string }> => {
  try {
    // For now, assume idTag could be:
    // 1. User ID (number)
    // 2. User email
    // 3. RFID tag/card ID

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    let user = null;

    // Try to find by ID first (if it's a number)
    if (!isNaN(Number(idTag))) {
      user = await prisma.user.findUnique({
        where: { id: Number(idTag) }
      });
    }

    // If not found by ID, try by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: idTag }
      });
    }

    // TODO: In future, add RFID tag validation when user management is enhanced

    await prisma.$disconnect();

    if (user) {
      // Check if user is verified and active
      if (user.isVerified) {
        return {
          isValid: true,
          userId: user.id,
          status: 'Accepted'
        };
      } else {
        return {
          isValid: false,
          status: 'Blocked'
        };
      }
    }

    // For development/testing, accept unknown tags with a warning
    console.warn(`Unknown idTag: ${idTag} - accepting for development`);
    return {
      isValid: true,
      status: 'Accepted'
    };

  } catch (error) {
    console.error('Error validating idTag:', error);
    return {
      isValid: false,
      status: 'Invalid'
    };
  }
};
