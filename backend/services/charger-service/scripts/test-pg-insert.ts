import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const run = async () => {
  const client = await pool.connect();
  try {
    // Find or create a host user to satisfy foreign key
    let hostId: number | null = null;
    const hostRes = await client.query("SELECT id FROM users WHERE role = 'HOST' LIMIT 1");
    if (hostRes.rows.length > 0) {
      hostId = hostRes.rows[0].id;
    } else {
      const insertUser = await client.query('INSERT INTO users ("email", "password", "role", "name", "createdAt", "updatedAt") VALUES ($1,$2,$3,$4, now(), now()) RETURNING id', ['host-test@example.com', 'password', 'HOST', 'Host Test']);
      hostId = insertUser.rows[0].id;
      console.log('Created host user id:', hostId);
    }
    const name = 'PG Raw Test Charger ' + Date.now();
    const ocppId = 'pg-test-ocpp-' + Date.now();
    const lng = 79.8612;
    const lat = 6.9271;
    const power = 7200;
    const price = 150.00;

    const locationJson = { type: 'Point', coordinates: [lng, lat] };

    const insertSql = `INSERT INTO chargers ("hostId", "name", "type", "connectorType", "powerOutput", "chargingSpeed", "pricePerHour", "isByoc", "ocppChargePointId", "location", "address", "status", "description", "vendor", "createdAt", "updatedAt")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, now(), now()) RETURNING id`;

  const res = await client.query(insertSql, [hostId, name, 'LEVEL2', 'TYPE2', power, null, price, false, ocppId, JSON.stringify(locationJson), 'Test address', 'AVAILABLE', 'Inserted by pg test', 'TestVendor']);
    console.log('Inserted charger id:', res.rows[0]);

  const sel = await client.query('SELECT id, name, "ocppChargePointId" FROM chargers WHERE "ocppChargePointId" = $1', [ocppId]);
  console.log('Selected rows:', sel.rows);
  } catch (err) {
    console.error('PG insert failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
};

run();
