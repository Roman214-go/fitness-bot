import { axiosInstance } from '../../../utils/axiosInstance';

export interface PricingCurrency {
  base_price: number;
  final_price: number;
  savings: number;
  formatted_base_price: string;
  formatted_final_price: string;
  formatted_savings: string;
}

export interface SubscriptionPlan {
  location: string;
  id: number | null;
  name: string;
  description: string;
  duration_days: number;
  subscription_type: string;
  is_active: boolean;
  discount_percent: number;

  formatted_prices: {
    byn: string;
    rub: string;
  };

  pricing: {
    byn: PricingCurrency;
    rub: PricingCurrency;
  };
}

export interface SubscriptionPlansResponse {
  success: boolean;
  user_id: number;
  user_discount: number;
  plans: SubscriptionPlan[];
  location: string;
}

export interface TrialSubscriptionResponse {
  success: boolean;
  message?: string;
}

export const subscriptionPlansApi = {
  getAll: async (userId: number, currency: 'BYN' | 'RUB'): Promise<SubscriptionPlansResponse> => {
    const response = await axiosInstance.get<SubscriptionPlansResponse>(`subscriptions/${userId}/plans`, {
      params: { currency },
      headers: {
        accept: 'application/json',
      },
    });

    return response.data;
  },

  activateTrial: async (userId: number): Promise<TrialSubscriptionResponse> => {
    const response = await axiosInstance.post<TrialSubscriptionResponse>(`subscriptions/${userId}/trial`, null, {
      headers: {
        accept: 'application/json',
      },
    });

    return response.data;
  },
};
