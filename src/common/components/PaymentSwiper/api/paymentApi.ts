import { axiosInstance } from '../../../utils/axiosInstance';

export interface BillingInfo {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
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

export interface PlanInfo {
  name: string;
  description: string;
  duration_days: number;
  price: number;
  currency: string;
  formatted_price: string;
}

export interface CreditCardPayload {
  number: string;
  verification_value: string;
  holder: string;
  exp_month: string;
  exp_year: string;
  token?: string;
}

export interface CreatePaymentRequest {
  subscription_type: string;
  currency: 'BYN' | 'RUB';
  user_email: string;

  return_url: string;
  language: 'ru' | 'en';

  credit_card: CreditCardPayload;

  card_holder: string;
}

export const paymentApi = {
  createPayment: async (userId: number, paymentData: CreatePaymentRequest): Promise<CreditCardPayload> => {
    const response = await axiosInstance.post<CreditCardPayload>(`/subscriptions/${userId}/payment/real`, paymentData, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
};
