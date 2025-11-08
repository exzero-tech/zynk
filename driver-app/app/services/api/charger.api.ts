const API_BASE_URL = 'http://localhost:3002/api/v1';

export interface Charger {
  id: number;
  name: string;
  hostId: number;
  ocppChargePointId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  pricePerHour: number;
  availability: 'Available' | 'Occupied' | 'Offline' | 'Maintenance';
  connectorType?: string;
  powerKw?: number;
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChargerFilters {
  hostId?: number;
  availability?: string;
  minPricePerHour?: number;
  maxPricePerHour?: number;
}

export interface SearchParams {
  lat: number;
  lng: number;
  radius: number; // in kilometers
  availability?: string;
  maxPricePerHour?: number;
}

class ChargerAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers when JWT is implemented
          // 'Authorization': `Bearer ${token}`,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get all chargers with optional filters
  async getChargers(filters?: ChargerFilters): Promise<Charger[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString();
    const endpoint = query ? `/chargers?${query}` : '/chargers';
    return this.request<Charger[]>(endpoint);
  }

  // Get charger by ID
  async getChargerById(id: number): Promise<Charger> {
    return this.request<Charger>(`/chargers/${id}`);
  }

  // Search chargers by geolocation (to be implemented on backend)
  async searchChargers(params: SearchParams): Promise<Charger[]> {
    const queryParams = new URLSearchParams({
      lat: String(params.lat),
      lng: String(params.lng),
      radius: String(params.radius),
    });

    if (params.availability) {
      queryParams.append('availability', params.availability);
    }
    if (params.maxPricePerHour) {
      queryParams.append('maxPricePerHour', String(params.maxPricePerHour));
    }

    return this.request<Charger[]>(`/chargers/search?${queryParams.toString()}`);
  }

  // Book a charger (create reservation - to be implemented)
  async bookCharger(
    chargerId: number,
    userId: number,
    duration: number
  ): Promise<{ reservationId: number }> {
    return this.request(`/chargers/${chargerId}/book`, {
      method: 'POST',
      body: JSON.stringify({ userId, duration }),
    });
  }

  // Start charging session (OCPP remote start)
  async startCharging(chargerId: number, connectorId: number): Promise<void> {
    return this.request(`/chargers/${chargerId}/remote-start`, {
      method: 'POST',
      body: JSON.stringify({ connectorId }),
    });
  }

  // Stop charging session (OCPP remote stop)
  async stopCharging(chargerId: number, transactionId: number): Promise<void> {
    return this.request(`/chargers/${chargerId}/remote-stop`, {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    });
  }

  // Get charger availability in real-time
  async getChargerStatus(chargerId: number): Promise<{ availability: string }> {
    return this.request(`/chargers/${chargerId}/status`);
  }
}

export const chargerAPI = new ChargerAPI();
