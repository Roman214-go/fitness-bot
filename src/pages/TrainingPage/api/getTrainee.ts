/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../common/store/store';
import { process } from '../../../common/constants/process';

export const getTraineeApi = createApi({
  reducerPath: 'api',
  tagTypes: ['UpcomingWorkout'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
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
    completeExercise: builder.mutation<void, { exerciseId: number; weight?: number }>({
      query: ({ exerciseId, weight }) => ({
        url: `/personal-workout-plans/exercises/${exerciseId}/complete`,
        method: 'POST',
        body: weight ? { weight } : {}, // если веса нет — отправляем пустое тело
      }),
    }),
    incompleteExercise: builder.mutation<void, { exerciseId: number }>({
      query: ({ exerciseId }) => ({
        url: `/personal-workout-plans/exercises/${exerciseId}/incomplete`,
        method: 'POST',
      }),
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
  useCompleteExerciseMutation,
  useIncompleteExerciseMutation,
  useGetUpcomingWorkoutQuery,
} = getTraineeApi;
