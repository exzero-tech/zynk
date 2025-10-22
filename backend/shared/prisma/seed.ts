import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load environment variables from backend/.env
config({ path: resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Enable PostGIS extension
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS postgis;`;

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zynk.com' },
    update: {},
    create: {
      email: 'admin@zynk.com',
      password: adminPassword,
      role: 'ADMIN',
      name: 'ZYNK Admin',
      phone: '+94771234567',
      isVerified: true,
    },
  });

  // Create sample host
  const hostPassword = await bcrypt.hash('host123', 10);
  const host = await prisma.user.upsert({
    where: { email: 'host@zynk.com' },
    update: {},
    create: {
      email: 'host@zynk.com',
      password: hostPassword,
      role: 'HOST',
      name: 'John Host',
      phone: '+94771234568',
      isVerified: true,
    },
  });

  // Create sample driver
  const driverPassword = await bcrypt.hash('driver123', 10);
  const driver = await prisma.user.upsert({
    where: { email: 'driver@zynk.com' },
    update: {},
    create: {
      email: 'driver@zynk.com',
      password: driverPassword,
      role: 'DRIVER',
      name: 'Jane Driver',
      phone: '+94771234569',
      isVerified: true,
    },
  });

  // Create sample charger (using raw SQL for PostGIS)
  await prisma.$executeRaw`
    INSERT INTO "chargers" ("hostId", name, type, "connectorType", "powerOutput", "chargingSpeed", "pricePerHour", "isByoc", location, address, status, description)
    VALUES (
      ${host.id},
      'Colombo Central Charger',
      'LEVEL2',
      'TYPE2',
      7200,
      '7.2 kW',
      250.00,
      false,
      ST_GeomFromText('POINT(79.8612 6.9271)', 4326),
      '123 Main Street, Colombo',
      'AVAILABLE',
      'Fast charger at central location'
    )
    ON CONFLICT DO NOTHING
  `;

  // Create sample amenity
  await prisma.amenity.upsert({
    where: { id: 1 },
    update: {},
    create: {
      hostId: host.id,
      type: 'CAFE',
      name: 'Central Cafe',
      description: 'Coffee shop with WiFi',
      isPromoted: true,
    },
  });

  console.log('✅ Database seeding completed!');
  console.log('👤 Created users:');
  console.log(`   Admin: admin@zynk.com / admin123`);
  console.log(`   Host: host@zynk.com / host123`);
  console.log(`   Driver: driver@zynk.com / driver123`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });