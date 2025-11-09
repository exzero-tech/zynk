const API_BASE_URL = 'http://localhost:3000'; // Update with actual backend URL

export interface Charger {
  id: string;
  name: string;
  location: string;
  type: 'Level 1' | 'Level 2' | 'DC Fast';
  powerOutput: number;
  pricePerKwh: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'OFFLINE' | 'MAINTENANCE';
}

export interface CreateChargerRequest {
  name: string;
  location: string;
  type: 'Level 1' | 'Level 2' | 'DC Fast';
  powerOutput: number;
  pricePerKwh: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'OFFLINE' | 'MAINTENANCE';
}

export interface UpdateChargerRequest extends Partial<CreateChargerRequest> {
  id: string;
}

export const getChargers = async (): Promise<Charger[]> => {
  // Dummy implementation - return realistic Sri Lankan data
  return [
    {
      id: '1',
      name: 'Colombo Station - Connector 1',
      location: 'Kollupitiya, Colombo 03',
      type: 'DC Fast',
      powerOutput: 60,
      pricePerKwh: 145,
      status: 'AVAILABLE',
    },
    {
      id: '2',
      name: 'Kandy Road Station - Connector 1',
      location: 'Kadawatha, Gampaha',
      type: 'Level 2',
      powerOutput: 22,
      pricePerKwh: 115,
      status: 'OCCUPIED',
    },
  ];
  // const response = await fetch(`${API_BASE_URL}/chargers`);
  // if (!response.ok) throw new Error('Failed to fetch chargers');
  // return response.json();
};

export const addCharger = async (data: CreateChargerRequest): Promise<Charger> => {
  // Dummy implementation
  const newCharger: Charger = { ...data, id: Date.now().toString() };
  console.log('Adding charger:', newCharger);
  return newCharger;
  // const response = await fetch(`${API_BASE_URL}/chargers`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Failed to add charger');
  // return response.json();
};

export const updateCharger = async (data: UpdateChargerRequest): Promise<Charger> => {
  // Dummy implementation
  const updatedCharger: Charger = {
    id: data.id,
    name: data.name!,
    location: data.location!,
    type: data.type!,
    powerOutput: data.powerOutput!,
    pricePerKwh: data.pricePerKwh!,
    status: data.status!,
  };
  console.log('Updating charger:', updatedCharger);
  return updatedCharger;
  // const response = await fetch(`${API_BASE_URL}/chargers/${data.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Failed to update charger');
  // return response.json();
};

export const deleteCharger = async (id: string): Promise<void> => {
  // Dummy implementation
  console.log('Deleting charger:', id);
  // const response = await fetch(`${API_BASE_URL}/chargers/${id}`, {
  //   method: 'DELETE',
  // });
  // if (!response.ok) throw new Error('Failed to delete charger');
};

export const toggleChargerStatus = async (id: string): Promise<Charger> => {
  // Dummy implementation - toggle between AVAILABLE and OFFLINE
  const dummyChargers = await getChargers();
  const charger = dummyChargers.find(c => c.id === id);
  if (!charger) throw new Error('Charger not found');
  
  const nextStatus: 'AVAILABLE' | 'OFFLINE' = charger.status === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
  const updatedCharger = { ...charger, status: nextStatus };
  console.log('Toggling status:', updatedCharger);
  return updatedCharger;
  // const response = await fetch(`${API_BASE_URL}/chargers/${id}/toggle-status`, {
  //   method: 'PATCH',
  // });
  // if (!response.ok) throw new Error('Failed to toggle status');
  // return response.json();
};