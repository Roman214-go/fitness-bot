/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreatePaymentRequest, paymentApi } from './paymentApi';

interface PaymentState {
  loading: boolean;
  error: string | null;
  lastPayment: any;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  lastPayment: null,
};

interface CreatePaymentParams {
  userId: number;
  paymentData: CreatePaymentRequest;
}

export const createPayment = createAsyncThunk<any, CreatePaymentParams, { rejectValue: string }>(
  'payment/create',
  async ({ userId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createPayment(userId, paymentData);
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
      .addCase(createPayment.fulfilled, (state, action: PayloadAction<any>) => {
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
