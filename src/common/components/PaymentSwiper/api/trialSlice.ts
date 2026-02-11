import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { subscriptionPlansApi } from './subscriptionApi';

interface TrialState {
  loading: boolean;
  error: string | null;
}

const initialState: TrialState = {
  loading: false,
  error: null,
};

export const activateTrial = createAsyncThunk<{ success: boolean }, number, { rejectValue: string }>(
  'trial/activate',
  async (userId, { rejectWithValue }) => {
    try {
      return await subscriptionPlansApi.activateTrial(userId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка активации пробного периода');
    }
  },
);

const trialSlice = createSlice({
  name: 'trial',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(activateTrial.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateTrial.fulfilled, state => {
        state.loading = false;
      })
      .addCase(activateTrial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка';
      });
  },
});

export default trialSlice.reducer;
