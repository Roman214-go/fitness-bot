import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreatePaymentRequest, CreatePaymentResponse } from './paymentApi';
import { subscriptionPlansApi } from './subscriptionApi';

interface PaymentState {
  loading: boolean;
  error: string | null;
  lastPayment: CreatePaymentResponse | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  lastPayment: null,
};

interface CreatePaymentParams {
  userId: number;
  paymentData: CreatePaymentRequest;
  telegramId: number;
}

export const createPayment = createAsyncThunk<CreatePaymentResponse, CreatePaymentParams, { rejectValue: string }>(
  'payment/create',
  async ({ userId, paymentData, telegramId }, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlansApi.createPayment(userId, paymentData, telegramId);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания платежа');
    }
  },
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createPayment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action: PayloadAction<CreatePaymentResponse>) => {
        state.loading = false;
        state.lastPayment = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка';
      });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
