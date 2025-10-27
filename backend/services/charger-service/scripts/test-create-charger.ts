import { createCharger, getChargers } from '../src/services/charger.service.js';

const run = async () => {
  console.log('Testing createCharger (in-memory fallback if DB not available)');
  const payload = {
    name: 'Test Charger - UnitTest',
    description: 'Created by test script',
    type: 'level2',
    connectorType: 'type2',
    power: 7200,
    pricePerHour: 100,
    isByoc: false,
    location: { type: 'Point', coordinates: [79.8612, 6.9271] },
    hostId: 1
  };

  const created = await createCharger(payload);
  console.log('Created ->', created);

  const list = await getChargers({});
  console.log('Charger list length:', Array.isArray(list) ? list.length : 'unknown');
  process.exit(0);
};

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
