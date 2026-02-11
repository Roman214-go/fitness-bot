// api/leaderboardSlice.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../../common/utils/axiosBaseQuery';

export interface LeaderboardUser {
  position: number;
  user_id: number;
  total_points: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  photo_url?: string;
}

export interface UserStatsResponse {
  total_ratings_count: number;
  total_points_earned: number;
  current_month_points: number;
  daily_awards_today: number;
  monthly_awards_current: number;
  global_position: number;
}

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    getLeaderboard: builder.query<LeaderboardUser[], number | void>({
      query: (limit = 20) => ({
        url: '/rating/leaderboard',
        params: { limit },
      }),
    }),

    getUserStats: builder.query({
      query: ({ userId, telegramId }) => ({
        url: `/rating/user/${userId}/stats`,
        headers: {
          'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
        },
      }),
    }),
  }),
});

export const { useGetLeaderboardQuery, useGetUserStatsQuery } = leaderboardApi;
