/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from '../utils/axiosInstance';

export interface VerifyRequest {
  telegram_id: number;
  username: string;
  first_name: string;
  last_name: string;
  photo_url: string;
  language_code: string;
}

export interface VerifyAuthResponse {
  success: boolean;
  action: 'login' | 'register';
  user: {
    id: number;
    telegram_id: number;
    first_name: string;
    last_name: string;
    username: string;
    is_active: boolean;
    created_at: string;
  };
  profile_status: string;
  next_action: string;
  message: string;
  progress: {
    has_anthropometric_data: boolean;
    has_fitness_goals: boolean;
    has_nutrition_data: boolean;
    has_body_photos: boolean;
    has_medical_history: boolean;
    completion_percentage: number;
  };
}
// src/shared/api/types.ts

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_active: boolean;
}

export interface UserTelegramResponse {
  id: number;
  telegram_id: number;
  username: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  language_code: string;
  is_active: boolean;
  profile_completed: boolean;
  has_workout_plan: boolean;
  created_at: string;
  updated_at: string;
  role: Role;
  anthropometric_data: any | null;
  body_photos: any | null;
  fitness_goals: any | null;
  subscription: any | null;
  nutrition: any | null;
  medical_history: any | null;
  personal_workout_plan: any | null;
}

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: unknown;
      params?: unknown;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    verifyAuth: builder.mutation<any, any>({
      query: body => ({ url: '/auth/verify', method: 'POST', data: body }),
    }),

    getUserByTelegram: builder.query<UserTelegramResponse, { telegramId: number }>({
      query: ({ telegramId }) => ({
        url: `/users/telegram/${telegramId}`,
        method: 'GET',
        params: { include_relations: true },
      }),
    }),
  }),
});

export const { useVerifyAuthMutation, useGetUserByTelegramQuery } = authApi;
