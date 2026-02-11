// src/store/slices/subscriptionPlansSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionPlan, subscriptionPlansApi, SubscriptionPlansResponse } from './subscriptionApi';

interface SubscriptionPlansState {
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionPlansState = {
  plans: [],
  loading: false,
  error: null,
};

export const fetchSubscriptionPlans = createAsyncThunk<SubscriptionPlansResponse, number, { rejectValue: string }>(
  'subscriptionPlans/fetchAll',
  async (telegramId, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlansApi.getAll(telegramId);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки планов');
    }
  },
);

const subscriptionPlansSlice = createSlice({
  name: 'subscriptionPlans',
  initialState,
  reducers: {
    clearPlans: state => {
      state.plans = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSubscriptionPlans.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action: PayloadAction<SubscriptionPlansResponse>) => {
        state.loading = false;
        state.plans = action.payload.plans;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка';
      });
  },
});

export const { clearPlans } = subscriptionPlansSlice.actions;
export default subscriptionPlansSlice.reducer;
