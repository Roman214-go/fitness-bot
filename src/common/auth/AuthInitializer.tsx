/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useVerifyAuthMutation } from './authApi';
import { useAppDispatch } from '../store/hooks';
import { setAuthData, setUserData } from './authSlice';
import { axiosInstance } from '../utils/axiosInstance';
import Loader from '../components/Loader';
import { ErrorScreen } from '../../pages/ErrorScreen/ErrorScreen';

export const AuthInitializer: React.FC<{ onAuthLoaded: () => void }> = ({ onAuthLoaded }) => {
  const [verifyAuth] = useVerifyAuthMutation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const tg = window.Telegram?.WebApp;
      const telegramUser = tg?.initDataUnsafe?.user;

      try {
        const authResponse = await verifyAuth({
          telegram_id: 739771074,
          username: telegramUser?.username ?? '',
          first_name: telegramUser?.first_name ?? '',
          last_name: telegramUser?.last_name ?? '',
          photo_url: telegramUser?.photo_url ?? '',
          language_code: telegramUser?.language_code ?? 'ru',
        }).unwrap();

        dispatch(setAuthData(authResponse));
        console.log('res data', authResponse.user.telegram_id);

        const res = await axiosInstance.get(`/users/telegram/${authResponse.user.telegram_id}`, {
          params: { include_relations: true },
        });

        dispatch(setUserData(res.data));

        setLoading(false);
        onAuthLoaded();
      } catch (err: any) {
        if (!err?.status) {
          setError('Сервер недоступен');
        } else {
          setError('Ошибка авторизации');
        }
      }
    };

    initAuth();
  }, [verifyAuth, dispatch, onAuthLoaded]);

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (loading) {
    return <Loader />;
  }

  return null;
};
