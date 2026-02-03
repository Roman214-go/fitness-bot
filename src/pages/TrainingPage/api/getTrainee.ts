/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../common/store/store';

export const getTraineeApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const telegramId = state.auth.userData?.telegram_id;
      if (telegramId) {
        headers.set('X-Telegram-Auth', JSON.stringify({ telegram_id: telegramId }));
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    getWorkoutByDate: builder.query<any, string>({
      query: date => `/personal-workout-plans/my/workouts/date/${date}`,
    }),
    completeSet: builder.mutation<void, number>({
      query: setId => ({
        url: `/personal-workout-plans/sets/${setId}/complete`,
        method: 'POST',
      }),
    }),
    completeWorkout: builder.mutation<void, number>({
      query: workoutDateId => ({
        url: `/personal-workout-plans/workout-dates/${workoutDateId}/complete`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetWorkoutByDateQuery, useCompleteSetMutation, useCompleteWorkoutMutation } = getTraineeApi;
