// src/store/slices/subscriptionPlansSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SubscriptionPlan, subscriptionPlansApi, SubscriptionPlansResponse } from './subscriptionApi';

interface SubscriptionPlansState {
  plans: SubscriptionPlan[];
  userDiscount: number;
  loading: boolean;
  location: string;
  error: string | null;
}

const initialState: SubscriptionPlansState = {
  plans: [],
  location: '',
  userDiscount: 0,
  loading: false,
  error: null,
};

export const fetchSubscriptionPlans = createAsyncThunk<
  SubscriptionPlansResponse,
  { userId: number; currency: 'BYN' | 'RUB' },
  { rejectValue: string }
>('subscriptionPlans/fetchAll', async ({ userId, currency }, { rejectWithValue }) => {
  try {
    return await subscriptionPlansApi.getAll(userId, currency);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки планов');
  }
});

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
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.plans;
        state.location = action.payload.location;
        state.userDiscount = action.payload.user_discount;
      })

      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка';
      });
  },
});

export const { clearPlans } = subscriptionPlansSlice.actions;
export default subscriptionPlansSlice.reducer;
