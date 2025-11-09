const API_BASE_URL = 'http://localhost:3000'; // Update with actual backend URL

export interface Amenity {
  id: string;
  name: string;
  description: string;
  type: string;
  isPromoted: boolean;
}

export interface CreateAmenityRequest {
  name: string;
  description: string;
  type: string;
  isPromoted: boolean;
}

export interface UpdateAmenityRequest extends Partial<CreateAmenityRequest> {
  id: string;
}

export const getAmenities = async (): Promise<Amenity[]> => {
  // Dummy implementation - return static data
  return [
    { id: '1', name: 'Free WiFi', description: 'High-speed internet access', type: 'Connectivity', isPromoted: true },
    { id: '2', name: 'EV Charging', description: 'Fast electric vehicle charging', type: 'Charging', isPromoted: false },
    { id: '3', name: 'Restrooms', description: 'Clean and accessible facilities', type: 'Facility', isPromoted: true },
  ];
  // const response = await fetch(`${API_BASE_URL}/amenities`);
  // if (!response.ok) throw new Error('Failed to fetch amenities');
  // return response.json();
};

export const addAmenity = async (data: CreateAmenityRequest): Promise<Amenity> => {
  // Dummy implementation
  const newAmenity: Amenity = { ...data, id: Date.now().toString() };
  console.log('Adding amenity:', newAmenity);
  return newAmenity;
  // const response = await fetch(`${API_BASE_URL}/amenities`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Failed to add amenity');
  // return response.json();
};

export const updateAmenity = async (data: UpdateAmenityRequest): Promise<Amenity> => {
  // Dummy implementation
  const updatedAmenity: Amenity = { id: data.id!, name: data.name!, description: data.description!, type: data.type!, isPromoted: data.isPromoted! };
  console.log('Updating amenity:', updatedAmenity);
  return updatedAmenity;
  // const response = await fetch(`${API_BASE_URL}/amenities/${data.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Failed to update amenity');
  // return response.json();
};

export const deleteAmenity = async (id: string): Promise<void> => {
  // Dummy implementation
  console.log('Deleting amenity:', id);
  // const response = await fetch(`${API_BASE_URL}/amenities/${id}`, {
  //   method: 'DELETE',
  // });
  // if (!response.ok) throw new Error('Failed to delete amenity');
};

export const toggleAmenityPromotion = async (id: string): Promise<Amenity> => {
  // Dummy implementation - toggle promotion
  const dummyAmenities = await getAmenities();
  const amenity = dummyAmenities.find(a => a.id === id);
  if (!amenity) throw new Error('Amenity not found');
  const updatedAmenity = { ...amenity, isPromoted: !amenity.isPromoted };
  console.log('Toggling promotion:', updatedAmenity);
  return updatedAmenity;
  // const response = await fetch(`${API_BASE_URL}/amenities/${id}/toggle-promotion`, {
  //   method: 'PATCH',
  // });
  // if (!response.ok) throw new Error('Failed to toggle promotion');
  // return response.json();
};