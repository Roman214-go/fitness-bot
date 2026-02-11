import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { onboardingSlides } from './onboarding.data.tsx';
import { OnboardingSlide } from './OnboardingSlide';
import { OnboardingDots } from './OnboardingDots';
import Button from '../Button';

import styles from './Onboarding.module.scss';
import { PaymentSwiper } from '../PaymentSwiper/PaymentSwiper';
import { useAppSelector } from '../../store/hooks';

export const Onboarding = () => {
  const { authData } = useAppSelector(state => state.auth);

  const [activeIndex, setActiveIndex] = useState(
    authData?.progress.has_anthropometric_data && authData.progress.has_body_photos ? 5 : 0,
  );
  const navigate = useNavigate();

  const isLastSlide = activeIndex === onboardingSlides.length;

  const next = () => {
    if (!isLastSlide) {
      setActiveIndex(prev => prev + 1);
      return;
    }

    finishOnboarding();
  };

  const finishOnboarding = () => {
    if (authData?.progress.has_anthropometric_data && authData.progress.has_body_photos) {
      navigate('/');
      return;
    }
    navigate('/main-form', { replace: true });
  };

  return (
    <div className={styles.wrapper} style={{ padding: isLastSlide ? '0' : '5%' }}>
      {!isLastSlide ? (
        activeIndex === 0 ? (
          <div />
        ) : (
          <button type='button' className={styles.wrapper_skip} onClick={() => setActiveIndex(onboardingSlides.length)}>
            Пропустить
          </button>
        )
      ) : (
        <p className={styles.wrapper_subscription}>Выберите подходящий для вас тип подписки</p>
      )}
      <div style={{ width: '100%' }}>
        {isLastSlide ? <PaymentSwiper /> : <OnboardingSlide data={onboardingSlides[activeIndex]} />}
      </div>

      <div className={styles.wrapper_next} style={{ padding: isLastSlide ? '0 5% 5% 5%' : '0' }}>
        {!isLastSlide && <OnboardingDots total={onboardingSlides.length} active={activeIndex} />}

        <Button buttonType={isLastSlide ? 'secondary' : 'primary'} onClick={next}>
          {isLastSlide ? 'Пропустить оплату' : 'Далее'}
        </Button>
      </div>
    </div>
  );
};
