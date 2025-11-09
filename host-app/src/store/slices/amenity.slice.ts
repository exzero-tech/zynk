import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Amenity, CreateAmenityRequest, UpdateAmenityRequest, getAmenities, addAmenity, updateAmenity, deleteAmenity, toggleAmenityPromotion } from '../../services/api/amenity.api';

interface AmenityState {
  amenities: Amenity[];
  loading: boolean;
  error: string | null;
}

const initialState: AmenityState = {
  amenities: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAmenities = createAsyncThunk('amenity/fetchAmenities', async () => {
  return await getAmenities();
});

export const createAmenity = createAsyncThunk('amenity/createAmenity', async (data: CreateAmenityRequest) => {
  return await addAmenity(data);
});

export const editAmenity = createAsyncThunk('amenity/editAmenity', async (data: UpdateAmenityRequest) => {
  return await updateAmenity(data);
});

export const removeAmenity = createAsyncThunk('amenity/removeAmenity', async (id: string) => {
  await deleteAmenity(id);
  return id;
});

export const toggleAmenityPromotionThunk = createAsyncThunk('amenity/toggleAmenityPromotion', async (id: string) => {
  return await toggleAmenityPromotion(id);
});

const amenitySlice = createSlice({
  name: 'amenity',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAmenities.fulfilled, (state, action: PayloadAction<Amenity[]>) => {
        state.loading = false;
        state.amenities = action.payload;
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch amenities';
      })
      .addCase(createAmenity.fulfilled, (state, action: PayloadAction<Amenity>) => {
        state.amenities.push(action.payload);
      })
      .addCase(editAmenity.fulfilled, (state, action: PayloadAction<Amenity>) => {
        const index = state.amenities.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.amenities[index] = action.payload;
        }
      })
      .addCase(removeAmenity.fulfilled, (state, action: PayloadAction<string>) => {
        state.amenities = state.amenities.filter(a => a.id !== action.payload);
      })
      .addCase(toggleAmenityPromotionThunk.fulfilled, (state, action: PayloadAction<Amenity>) => {
        const index = state.amenities.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.amenities[index] = action.payload;
        }
      });
  },
});

export const { clearError } = amenitySlice.actions;
export default amenitySlice.reducer;