import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chargerAPI, Charger, ChargerFilters, SearchParams } from '@/app/services/api/charger.api';

interface ChargerState {
  chargers: Charger[];
  selectedCharger: Charger | null;
  nearbyChargers: Charger[];
  filters: ChargerFilters;
  searchParams: SearchParams | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChargerState = {
  chargers: [],
  selectedCharger: null,
  nearbyChargers: [],
  filters: {},
  searchParams: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchChargers = createAsyncThunk(
  'charger/fetchChargers',
  async (filters?: ChargerFilters) => {
    return await chargerAPI.getChargers(filters);
  }
);

export const fetchChargerById = createAsyncThunk(
  'charger/fetchChargerById',
  async (id: number) => {
    return await chargerAPI.getChargerById(id);
  }
);

export const searchNearbyChargers = createAsyncThunk(
  'charger/searchNearbyChargers',
  async (params: SearchParams) => {
    return await chargerAPI.searchChargers(params);
  }
);

export const bookCharger = createAsyncThunk(
  'charger/bookCharger',
  async ({ chargerId, userId, duration }: { chargerId: number; userId: number; duration: number }) => {
    return await chargerAPI.bookCharger(chargerId, userId, duration);
  }
);

export const startChargingSession = createAsyncThunk(
  'charger/startChargingSession',
  async ({ chargerId, connectorId }: { chargerId: number; connectorId: number }) => {
    await chargerAPI.startCharging(chargerId, connectorId);
    return { chargerId, connectorId };
  }
);

export const stopChargingSession = createAsyncThunk(
  'charger/stopChargingSession',
  async ({ chargerId, transactionId }: { chargerId: number; transactionId: number }) => {
    await chargerAPI.stopCharging(chargerId, transactionId);
    return { chargerId, transactionId };
  }
);

const chargerSlice = createSlice({
  name: 'charger',
  initialState,
  reducers: {
    setSelectedCharger: (state, action: PayloadAction<Charger | null>) => {
      state.selectedCharger = action.payload;
    },
    setFilters: (state, action: PayloadAction<ChargerFilters>) => {
      state.filters = action.payload;
    },
    setSearchParams: (state, action: PayloadAction<SearchParams | null>) => {
      state.searchParams = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all chargers
    builder
      .addCase(fetchChargers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChargers.fulfilled, (state, action) => {
        state.loading = false;
        state.chargers = action.payload;
      })
      .addCase(fetchChargers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch chargers';
      });

    // Fetch charger by ID
    builder
      .addCase(fetchChargerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChargerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCharger = action.payload;
      })
      .addCase(fetchChargerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch charger details';
      });

    // Search nearby chargers
    builder
      .addCase(searchNearbyChargers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNearbyChargers.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyChargers = action.payload;
      })
      .addCase(searchNearbyChargers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search chargers';
      });

    // Book charger
    builder
      .addCase(bookCharger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookCharger.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bookCharger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to book charger';
      });

    // Start charging session
    builder
      .addCase(startChargingSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startChargingSession.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(startChargingSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to start charging session';
      });

    // Stop charging session
    builder
      .addCase(stopChargingSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stopChargingSession.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(stopChargingSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to stop charging session';
      });
  },
});

export const { setSelectedCharger, setFilters, setSearchParams, clearError } = chargerSlice.actions;
export default chargerSlice.reducer;
