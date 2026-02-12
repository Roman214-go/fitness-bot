import { useEffect, useState } from 'react';
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
import { activateTrial } from './api/trialSlice';
import { SubscriptionPlan } from './api/subscriptionApi';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axiosInstance';
import { setUserData } from '../../auth/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import { PaymentModal } from './PaymentModal';
import Loader from '../Loader';

export const PaymentSwiper = () => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(state => state.auth);
  const { plans, location, loading, error } = useAppSelector(state => state.subscriptionPlans);
  const { loading: paymentLoading } = useAppSelector(state => state.payment);
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (userData?.id) {
      dispatch(
        fetchSubscriptionPlans({
          userId: userData.id,
          currency: 'BYN',
        }),
      );
    }
  }, [dispatch, userData?.id]);

  const getCurrencyByLocation = (location?: string): 'BYN' | 'RUB' => {
    if (location === 'BY') return 'BYN';
    return 'RUB'; // ru | any | undefined
  };

  const handleBuyPlan = async (plan: SubscriptionPlan, currency: 'BYN' | 'RUB') => {
    if (!userData?.id) {
      return;
    }

    const price = currency === 'BYN' ? plan.pricing.byn.final_price : plan.pricing.rub.final_price;

    if (price !== 0) {
      setSelectedPlan(plan);
      setIsPaymentModalOpen(true);
      return;
    }

    if (price === 0) {
      try {
        const result = await dispatch(activateTrial(userData.id)).unwrap();

        if (result.success) {
          const res = await axiosInstance.get(`/users/telegram/${userData.telegram_id}`, {
            params: { include_relations: true },
          });

          dispatch(setUserData(res.data));

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          !userData.body_photos
            ? navigate('/main-form')
            : !userData.medical_history
              ? navigate('/anamnesis-form')
              : navigate('/');
        }
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        toast(error);
      }

      return;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    throw new Error(error);
  }

  if (plans.length === 0) {
    return <div className={styles.empty}>Нет доступных планов</div>;
  }

  return (
    <>
      <Swiper spaceBetween={50} slidesPerView={1} modules={[Navigation]} navigation>
        {plans.map(plan => {
          const currency = getCurrencyByLocation(location);
          const price = currency === 'BYN' ? plan.pricing.byn : plan.pricing.rub;

          return (
            <SwiperSlide key={plan.subscription_type}>
              <div className={styles.swiper_container}>
                <div>
                  <h2 className={styles.title}>{plan.name}</h2>
                  <p style={{ textAlign: 'start' }}>{plan.duration_days} дней</p>
                </div>

                <p style={{ textAlign: 'start' }}> {plan.description}</p>

                <div>
                  {/* Старая цена */}
                  {price.savings > 0 && <p className={styles.discount_price}>{price.formatted_base_price}</p>}

                  {/* Итоговая цена */}
                  <p className={styles.price}>{price.formatted_final_price}</p>

                  {/* Скидка */}
                  {plan.discount_percent > 0 && (
                    <p className={styles.discount}>
                      Скидка − {plan.discount_percent}% (экономия {price.formatted_savings})
                    </p>
                  )}
                </div>

                <Button disabled={paymentLoading} onClick={() => handleBuyPlan(plan, currency)}>
                  {price.final_price === 0 ? 'Активировать' : paymentLoading ? 'Загрузка...' : 'Купить'}
                </Button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {isPaymentModalOpen && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          currency={getCurrencyByLocation(location)}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}

      <ToastContainer theme='light' hideProgressBar autoClose={3000} style={{ position: 'absolute' }} />
    </>
  );
};
