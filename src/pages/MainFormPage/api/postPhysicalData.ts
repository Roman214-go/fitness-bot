import { axiosInstance } from '../../../common/utils/axiosInstance';
import { MainFormValues } from '../MainFormPage';

export const postPhysicalData = async (payload: MainFormValues, telegramId: number): Promise<void> => {
  const formData = new FormData();

  formData.append('height', String(payload.height));
  formData.append('weight', String(payload.weight));
  formData.append('age', String(payload.age));

  formData.append('gender', payload.gender);
  formData.append('daily_steps_level', payload.daily_steps_level);
  formData.append('experience_level', payload.experience_level);
  formData.append('goal', payload.goal);
  formData.append('posture_correction', String(payload.healthy_goal?.includes('posture_correction')));
  formData.append('back_pain_relief', String(payload.healthy_goal?.includes('back_pain_relief')));
  formData.append('workout_format', payload.workout_format);
  formData.append('workouts_per_week', String(payload.workouts_per_week));
  formData.append('health_limitation', payload.health_limitation ?? '');

  if (payload.photos.front_photo) {
    formData.append('front_photo', payload.photos.front_photo);
  }
  if (payload.photos.back_photo) {
    formData.append('back_photo', payload.photos.back_photo);
  }
  if (payload.photos.left_front_photo) {
    formData.append('left_front_photo', payload.photos.left_front_photo);
  }
  if (payload.photos.left_incline_photo) {
    formData.append('left_incline_photo', payload.photos.left_incline_photo);
  }

  await axiosInstance.post('forms/physical-data', formData, {
    headers: {
      'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
    },
  });
};
