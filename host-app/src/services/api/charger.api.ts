const API_BASE_URL = 'http://localhost:3000'; // Update with actual backend URL

export interface Charger {
  id: string;
  name: string;
  location: string;
  status: 'available' | 'offline' | 'maintenance';
}

export interface CreateChargerRequest {
  name: string;
  location: string;
  status: 'available' | 'offline' | 'maintenance';
}

export interface UpdateChargerRequest extends Partial<CreateChargerRequest> {
  id: string;
}

export const getChargers = async (): Promise<Charger[]> => {
  // Dummy implementation - return static data
  return [
    { id: '1', name: 'Charger A', status: 'available', location: 'Downtown' },
    { id: '2', name: 'Charger B', status: 'offline', location: 'Airport' },
    { id: '3', name: 'Charger C', status: 'maintenance', location: 'Mall' },
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
  const updatedCharger: Charger = { id: data.id, name: data.name!, location: data.location!, status: data.status! };
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
  // Dummy implementation - cycle through statuses
  const statuses: ('available' | 'offline' | 'maintenance')[] = ['available', 'offline', 'maintenance'];
  const dummyChargers = await getChargers();
  const charger = dummyChargers.find(c => c.id === id);
  if (!charger) throw new Error('Charger not found');
  const currentIndex = statuses.indexOf(charger.status);
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
  const updatedCharger = { ...charger, status: nextStatus };
  console.log('Toggling status:', updatedCharger);
  return updatedCharger;
  // const response = await fetch(`${API_BASE_URL}/chargers/${id}/toggle-status`, {
  //   method: 'PATCH',
  // });
  // if (!response.ok) throw new Error('Failed to toggle status');
  // return response.json();
};