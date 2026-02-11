import { axiosInstance } from '../../../common/utils/axiosInstance';

export interface Achievement {
  id: number;
  achievement_id?: number;
  name: string;
  photo_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export type AchievementsResponse = Achievement[];

export const achievementsApi = {
  getAll: async (telegramId: number, includeInactive: boolean = false): Promise<AchievementsResponse> => {
    const response = await axiosInstance.get<AchievementsResponse>('/achievements/all', {
      params: {
        include_inactive: includeInactive,
      },
      headers: {
        'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
      },
    });
    return response.data;
  },

  getMy: async (telegramId: number): Promise<AchievementsResponse> => {
    const response = await axiosInstance.get<AchievementsResponse>('/achievements/my', {
      headers: {
        'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
      },
    });
    return response.data;
  },

  getMyMain: async (telegramId: number): Promise<Achievement[]> => {
    const response = await axiosInstance.get<AchievementsResponse>('/achievements/my/main', {
      headers: {
        'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
      },
    });
    return response.data;
  },

  setMyMain: async (telegramId: number, achievementId: number): Promise<void> => {
    await axiosInstance.put(
      '/achievements/my/main',
      {
        achievement_id: achievementId,
      },
      {
        headers: {
          'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
        },
      },
    );
  },
};
