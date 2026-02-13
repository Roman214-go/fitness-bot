/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../common/store/store';
import { process } from '../../../common/constants/process';

export const getHomework = createApi({
  reducerPath: 'homeworkApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const telegramId = state.auth.userData?.telegram_id;

      if (telegramId) {
        headers.set('X-Telegram-Auth', JSON.stringify({ telegram_id: telegramId }));
      }

      headers.set('accept', 'application/json');
      return headers;
    },
  }),

  endpoints: builder => ({
    getAllHomework: builder.query<any[], void>({
      query: () => '/homework/my?limit=100&offset=0',
    }),
  }),
});

export const { useGetAllHomeworkQuery } = getHomework;
