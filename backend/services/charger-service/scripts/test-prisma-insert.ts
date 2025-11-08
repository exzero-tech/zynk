import { PrismaClient } from '@prisma/client';

const run = async () => {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('Connected to DB via Prisma');

    const hostId = 1;
    const name = 'Raw SQL Test Charger ' + Date.now();
    const ocppId = 'test-ocpp-' + Date.now();
    const lng = 79.8612;
    const lat = 6.9271;
    const power = 7200;
    const price = 150.00;

    // Insert using raw SQL so we can set the PostGIS geography column
    const insertSql = `INSERT INTO chargers (host_id, name, type, connector_type, power_output, charging_speed, price_per_hour, is_byoc, ocpp_charge_point_id, location, address, status, description, vendor, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, ST_GeogFromText($10), $11, $12, $13, $14, now(), now()) RETURNING id`;

    const pointWkt = `SRID=4326;POINT(${lng} ${lat})`;

    // Use $executeRawUnsafe with parameters
    const result: any = await prisma.$queryRawUnsafe(insertSql, hostId, name, 'LEVEL2', 'TYPE2', power, null, price, false, ocppId, pointWkt, 'Test address', 'AVAILABLE', 'Inserted by test script', 'TestVendor');

    console.log('Insert result:', result);

    // Fetch back the inserted row
    const rows: any = await prisma.$queryRawUnsafe('SELECT id, host_id, name, ocpp_charge_point_id FROM chargers WHERE ocpp_charge_point_id = $1', ocppId);
    console.log('Fetched rows:', rows);

    await prisma.$disconnect();
  } catch (err) {
    console.error('Prisma raw insert failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

run();
