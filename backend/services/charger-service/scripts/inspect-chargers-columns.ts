import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const run = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='chargers'");
    console.log('Columns for chargers:');
    console.table(res.rows);
  } catch (err) {
    console.error('Failed to inspect columns:', err);
  } finally {
    client.release();
    await pool.end();
  }
};

run();
