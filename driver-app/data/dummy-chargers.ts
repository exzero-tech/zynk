export interface DummyCharger {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'OFFLINE' | 'MAINTENANCE';
  type: 'LEVEL1' | 'LEVEL2' | 'DC_FAST';
  connectorType: 'TYPE1' | 'TYPE2' | 'CCS1' | 'CCS2' | 'CHADEMO' | 'TESLA' | 'GBT' | 'NACS' | 'THREE_PIN' | 'BLUE_COMMANDO';
  powerOutput: number;
  chargingSpeed: string;
  pricePerKwh: number; // Changed from pricePerHour to pricePerKwh
  description?: string;
  vendor?: string;
  amenities?: string[];
}

// Battaramulla coordinates (Sri Lanka)
const BATTARAMULLA_LAT = 6.9000;
const BATTARAMULLA_LNG = 79.9070;

// Generate random coordinates within 10km radius of Battaramulla
const generateRandomLocation = (centerLat: number, centerLng: number, radiusKm: number) => {
  const radiusInDegrees = radiusKm / 111.32; // Rough conversion km to degrees
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  return {
    latitude: centerLat + y,
    longitude: centerLng + x,
  };
};

export const dummyChargers: DummyCharger[] = [
  {
    id: 1,
    name: "Battaramulla Central Charging Hub",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "No. 123, Main Street, Battaramulla",
    status: "AVAILABLE",
    type: "DC_FAST",
    connectorType: "CCS2",
    powerOutput: 150,
    chargingSpeed: "Ultra-Rapid (150+ kW)",
    pricePerKwh: 145.00,
    description: "Premium DC fast charging station with multiple connectors",
    vendor: "ChargeMaster Pro",
    amenities: ["WiFi", "Restrooms", "Cafe", "Covered Parking", "24/7 Access"]
  },
  {
    id: 2,
    name: "Colombo Road EV Station",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Colombo Road, Near Railway Station, Battaramulla",
    status: "AVAILABLE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 22,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 95.00,
    description: "Convenient Level 2 charging for daily commuters",
    vendor: "EV Lanka"
  },
  {
    id: 3,
    name: "Shopping Mall Charger",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Liberty Plaza Shopping Mall, Battaramulla",
    status: "OCCUPIED",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 11,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 110.00,
    description: "Charge while you shop - mall parking available",
    vendor: "MallCharge",
    amenities: ["Shopping Mall", "Food Court", "Restrooms", "Security"]
  },
  {
    id: 4,
    name: "Tesla Supercharger Battaramulla",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Highway Junction, Battaramulla",
    status: "AVAILABLE",
    type: "DC_FAST",
    connectorType: "TESLA",
    powerOutput: 250,
    chargingSpeed: "Ultra-Rapid (150+ kW)",
    pricePerKwh: 150.00,
    description: "Tesla Supercharger - fastest charging available",
    vendor: "Tesla Energy"
  },
  {
    id: 5,
    name: "Government Office Charging",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Provincial Council Building, Battaramulla",
    status: "AVAILABLE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 7,
    chargingSpeed: "Slow (3-7 kW)",
    pricePerKwh: 80.00,
    description: "Public charging station for government employees",
    vendor: "Public Charge Lanka"
  },
  {
    id: 6,
    name: "Hotel Paradise Charger",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Hotel Paradise, Paradise Road, Battaramulla",
    status: "AVAILABLE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 11,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 120.00,
    description: "Premium hotel charging with valet service",
    vendor: "Hotel Paradise"
  },
  {
    id: 7,
    name: "BYOC Community Station",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Community Center, Sri Jayawardenepura Road, Battaramulla",
    status: "AVAILABLE",
    type: "LEVEL1",
    connectorType: "THREE_PIN",
    powerOutput: 3,
    chargingSpeed: "Slow (3-7 kW)",
    pricePerKwh: 85.00,
    description: "Bring Your Own Charger - community shared station",
    vendor: "BYOC Lanka"
  },
  {
    id: 8,
    name: "Petrol Station EV Hub",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Lanka IOC Petrol Station, Battaramulla",
    status: "AVAILABLE",
    type: "DC_FAST",
    connectorType: "CHADEMO",
    powerOutput: 50,
    chargingSpeed: "Rapid (43-50 kW)",
    pricePerKwh: 135.00,
    description: "Combined fuel and EV charging station",
    vendor: "Lanka IOC"
  },
  {
    id: 9,
    name: "University Campus Charger",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "University of Sri Jayewardenepura, Battaramulla",
    status: "OCCUPIED",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 22,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 90.00,
    description: "Student and staff charging facility",
    vendor: "USJP Facilities"
  },
  {
    id: 10,
    name: "Residential Complex Station",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Palm Grove Apartments, Battaramulla",
    status: "AVAILABLE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 11,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 100.00,
    description: "Dedicated charging for apartment residents",
    vendor: "Palm Grove Management"
  },
  {
    id: 11,
    name: "Highway Rest Stop Charger",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Southern Expressway Rest Area, Battaramulla",
    status: "AVAILABLE",
    type: "DC_FAST",
    connectorType: "CCS2",
    powerOutput: 100,
    chargingSpeed: "Rapid (43-50 kW)",
    pricePerKwh: 140.00,
    description: "Highway charging for long distance travelers",
    vendor: "Highway Authority"
  },
  {
    id: 12,
    name: "Cafe Charging Point",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Star Cafe, Main Road, Battaramulla",
    status: "AVAILABLE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 7,
    chargingSpeed: "Slow (3-7 kW)",
    pricePerKwh: 105.00,
    description: "Charge while enjoying coffee and snacks",
    vendor: "Star Cafe"
  },
  {
    id: 13,
    name: "Medical Center Station",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Battaramulla Medical Center, Hospital Road",
    status: "AVAILABLE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 11,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 115.00,
    description: "Emergency vehicle charging facility",
    vendor: "Medical Center"
  },
  {
    id: 14,
    name: "Office Complex Charger",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "World Trade Center, Battaramulla",
    status: "OCCUPIED",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 22,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 98.00,
    description: "Corporate office building charging",
    vendor: "World Trade Center"
  },
  {
    id: 15,
    name: "Park & Ride Station",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Battaramulla Park & Ride, Railway Station",
    status: "AVAILABLE",
    type: "DC_FAST",
    connectorType: "CCS2",
    powerOutput: 75,
    chargingSpeed: "Rapid (43-50 kW)",
    pricePerKwh: 130.00,
    description: "Park and charge while taking train",
    vendor: "Railway Authority"
  },
  {
    id: 16,
    name: "Supermarket Charging",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Keells Super, Battaramulla Junction",
    status: "AVAILABLE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 11,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 108.00,
    description: "Charge while grocery shopping",
    vendor: "Keells Super"
  },
  {
    id: 17,
    name: "Gym & Fitness Center",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Fitness First, Battaramulla",
    status: "AVAILABLE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 7,
    chargingSpeed: "Slow (3-7 kW)",
    pricePerKwh: 92.00,
    description: "Charge while working out",
    vendor: "Fitness First"
  },
  {
    id: 18,
    name: "Airport Transfer Station",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Airport Taxi Stand, Battaramulla",
    status: "AVAILABLE",
    type: "DC_FAST",
    connectorType: "CHADEMO",
    powerOutput: 62,
    chargingSpeed: "Rapid (43-50 kW)",
    pricePerKwh: 138.00,
    description: "Quick charging for airport transfers",
    vendor: "Airport Services"
  },
  {
    id: 19,
    name: "Bank Branch Charger",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Commercial Bank, Main Branch, Battaramulla",
    status: "OFFLINE",
    type: "LEVEL2",
    connectorType: "TYPE2",
    powerOutput: 11,
    chargingSpeed: "Fast (7-22 kW)",
    pricePerKwh: 102.00,
    description: "Bank branch customer charging",
    vendor: "Commercial Bank"
  },
  {
    id: 20,
    name: "Temple Grounds Station",
    ...generateRandomLocation(BATTARAMULLA_LAT, BATTARAMULLA_LNG, 10),
    address: "Gangaramaya Temple Grounds, Battaramulla",
    status: "AVAILABLE",
    type: "LEVEL1",
    connectorType: "THREE_PIN",
    powerOutput: 3,
    chargingSpeed: "Slow (3-7 kW)",
    pricePerKwh: 88.00,
    description: "Traditional temple grounds charging",
    vendor: "Temple Management"
  }
];