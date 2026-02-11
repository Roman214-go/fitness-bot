import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './PaymentSwiper.module.scss';
import Button from '../Button';
import { Navigation } from 'swiper/modules';
import { useAppSelector, useAppDispatch } from '../../store/hooks'; // ваши typed hooks

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import 'swiper/css/navigation';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import 'swiper/css';
import { fetchSubscriptionPlans } from './api/subscriptionSlice';
import { createPayment } from './api/paymentSlice';
import { CreatePaymentRequest } from './api/paymentApi';

export const PaymentSwiper = () => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(state => state.auth);
  const { plans, loading, error } = useAppSelector(state => state.subscriptionPlans);
  const { loading: paymentLoading } = useAppSelector(state => state.payment);

  const telegramId = userData?.telegram_id;

  useEffect(() => {
    if (telegramId) {
      dispatch(fetchSubscriptionPlans(telegramId));
    }
  }, [dispatch, telegramId]);

  const handleBuyPlan = async (subscriptionType: string, currency: 'BYN' | 'RUB') => {
    if (!telegramId) {
      alert('Не удалось определить пользователя');
      return;
    }

    const paymentData: CreatePaymentRequest = {
      subscription_type: subscriptionType,
      currency: currency,
      user_email: userData.username || 'user@example.com',
      billing_info: {
        first_name: userData.first_name || 'Имя',
        last_name: userData.last_name || 'Фамилия',
        phone: '+375000000000',
        country: 'BY',
        city: 'Минск',
        address: 'Адрес',
        zip_code: '220000',
      },
      card_holder: `${userData.first_name || 'Имя'} ${userData.last_name || 'Фамилия'}`,
    };
    const userId = userData.id;
    try {
      const result = await dispatch(createPayment({ userId, paymentData, telegramId })).unwrap();

      if (result.success && result.payment_url) {
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = result.payment_url;
      }
    } catch (error) {
      console.error('Ошибка при создании платежа:', error);
      alert('Не удалось создать платёж. Попробуйте позже.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка планов...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  if (plans.length === 0) {
    return <div className={styles.empty}>Нет доступных планов</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Загрузка планов...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  if (plans.length === 0) {
    return <div className={styles.empty}>Нет доступных планов</div>;
  }

  return (
    <Swiper spaceBetween={50} slidesPerView={1} modules={[Navigation]} navigation>
      {plans.map(item => (
        <SwiperSlide key={item.id}>
          <div className={styles.swiper_container}>
            <div>
              <h2 className={styles.title}>{item.name}</h2>
              <p style={{ textAlign: 'start' }}>{item.duration_days} дней</p>
            </div>
            <p style={{ textAlign: 'start' }}>{item.description}</p>
            <div>
              <div style={{ display: 'flex', justifyContent: 'end', margin: '10px 0' }}>
                <p className={styles.discount_price}>{item.formatted_prices.rub}</p>
              </div>
              <p className={styles.price}>{item.formatted_prices.byn}</p>
            </div>
            <Button disabled={paymentLoading} onClick={() => handleBuyPlan(item.subscription_type, 'BYN')}>
              {paymentLoading ? 'Загрузка...' : 'Купить'}
            </Button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
