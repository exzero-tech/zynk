import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Charger, addCharger as apiAddCharger, updateCharger as apiUpdateCharger, deleteCharger as apiDeleteCharger, toggleChargerStatus as apiToggleStatus, getChargers } from '../../services/api/charger.api';

interface ChargerState {
  chargers: Charger[];
  loading: boolean;
  error: string | null;
}

const initialState: ChargerState = {
  chargers: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchChargers = createAsyncThunk('charger/fetchChargers', async () => {
  return await getChargers();
});

export const createCharger = createAsyncThunk('charger/createCharger', async (data: Omit<Charger, 'id'>) => {
  return await apiAddCharger(data);
});

export const editCharger = createAsyncThunk('charger/editCharger', async (data: { id: string; updates: Partial<Omit<Charger, 'id'>> }) => {
  return await apiUpdateCharger({ id: data.id, ...data.updates });
});

export const removeCharger = createAsyncThunk('charger/removeCharger', async (id: string) => {
  await apiDeleteCharger(id);
  return id;
});

export const toggleStatus = createAsyncThunk('charger/toggleStatus', async (id: string) => {
  return await apiToggleStatus(id);
});

const chargerSlice = createSlice({
  name: 'charger',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChargers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChargers.fulfilled, (state, action: PayloadAction<Charger[]>) => {
        state.loading = false;
        state.chargers = action.payload;
      })
      .addCase(fetchChargers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch chargers';
      })
      .addCase(createCharger.fulfilled, (state, action: PayloadAction<Charger>) => {
        state.chargers.push(action.payload);
      })
      .addCase(editCharger.fulfilled, (state, action: PayloadAction<Charger>) => {
        const index = state.chargers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.chargers[index] = action.payload;
        }
      })
      .addCase(removeCharger.fulfilled, (state, action: PayloadAction<string>) => {
        state.chargers = state.chargers.filter(c => c.id !== action.payload);
      })
      .addCase(toggleStatus.fulfilled, (state, action: PayloadAction<Charger>) => {
        const index = state.chargers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.chargers[index] = action.payload;
        }
      });
  },
});

export const { clearError } = chargerSlice.actions;
export default chargerSlice.reducer;