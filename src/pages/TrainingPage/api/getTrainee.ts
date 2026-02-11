/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../common/store/store';

export const getTraineeApi = createApi({
  reducerPath: 'api',
  tagTypes: ['UpcomingWorkout'],
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
      query: date => `/personal-workout-plans/date/${date}/workout`,
    }),

    completeSet: builder.mutation<void, number>({
      query: setId => ({
        url: `/personal-workout-plans/sets/${setId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['UpcomingWorkout'],
    }),

    completeWorkout: builder.mutation<void, number>({
      query: workoutDateId => ({
        url: `/personal-workout-plans/workout-dates/${workoutDateId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['UpcomingWorkout'],
    }),

    getUpcomingWorkout: builder.query<any, void>({
      query: () => `/personal-workout-plans/my/workouts/upcoming`,
      providesTags: ['UpcomingWorkout'],
    }),
  }),
});

export const {
  useGetWorkoutByDateQuery,
  useCompleteSetMutation,
  useCompleteWorkoutMutation,
  useGetUpcomingWorkoutQuery,
} = getTraineeApi;
