import { axiosInstance } from '../../../utils/axiosInstance';
import { CreatePaymentRequest, CreatePaymentResponse } from './paymentApi';

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  duration_days: number;
  price_byn: number;
  price_rub: number;
  subscription_type: string;
  is_active: boolean;
  formatted_prices: {
    byn: string;
    rub: string;
  };
}

export interface SubscriptionPlansResponse {
  success: boolean;
  plans: SubscriptionPlan[];
}

export const subscriptionPlansApi = {
  getAll: async (telegramId: number): Promise<SubscriptionPlansResponse> => {
    const response = await axiosInstance.get<SubscriptionPlansResponse>('/subscription-plans/admin/all', {
      headers: {
        accept: 'application/json',
        'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
      },
    });
    return response.data;
  },

  createPayment: async (
    userId: number,
    paymentData: CreatePaymentRequest,
    telegramId: number,
  ): Promise<CreatePaymentResponse> => {
    const response = await axiosInstance.post<CreatePaymentResponse>(
      `/subscriptions/${userId}/payment/create`,
      paymentData,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
        },
      },
    );
    return response.data;
  },
};
