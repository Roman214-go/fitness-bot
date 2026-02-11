import { axiosInstance } from '../../../utils/axiosInstance';
import { SubscriptionPlansResponse } from './subscriptionApi';

export interface BillingInfo {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
}

export interface CreatePaymentRequest {
  subscription_type: string;
  currency: 'BYN' | 'RUB';
  user_email: string;
  billing_info: BillingInfo;
  card_holder: string;
}

export interface PlanInfo {
  name: string;
  description: string;
  duration_days: number;
  price: number;
  currency: string;
  formatted_price: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  payment_url: string;
  payment_id: string;
  tracking_id: string;
  amount: number;
  currency: string;
  description: string;
  plan_info: PlanInfo;
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
    planId: number,
    paymentData: CreatePaymentRequest,
    telegramId: number,
  ): Promise<CreatePaymentResponse> => {
    const response = await axiosInstance.post<CreatePaymentResponse>(
      `/subscriptions/${planId}/payment/create`,
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
