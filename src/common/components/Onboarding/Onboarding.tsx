import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { onboardingSlides } from './onboarding.data.tsx';
import { OnboardingSlide } from './OnboardingSlide';
import { OnboardingDots } from './OnboardingDots';
import Button from '../Button';

import styles from './Onboarding.module.scss';
import { PaymentSwiper } from '../PaymentSwiper/PaymentSwiper';
import { useAppSelector } from '../../store/hooks';
import { PrivacyModal } from '../../../pages/PrivacyModal/PrivacyModal.tsx';

export const Onboarding = () => {
  const { userData } = useAppSelector(state => state.auth);

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [privacyId, setPrivacyId] = useState(0);
  const [activeIndex, setActiveIndex] = useState(userData?.anthropometric_data && userData.body_photos ? 5 : 0);
  const navigate = useNavigate();

  const slides = useMemo(() => {
    return [
      {
        id: 1,
        title: 'Согласие',
        text: (
          <p>
            Нажимая кнопку «Далее» вы принимаете политику{' '}
            <span
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                setPrivacyId(1);
                setIsPrivacyOpen(true);
              }}
            >
              обработки персональных данных
            </span>{' '}
            и{' '}
            <span
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                setPrivacyId(2);
                setIsPrivacyOpen(true);
              }}
            >
              соглашение на их обработку
            </span>
          </p>
        ),
      },
      ...onboardingSlides,
    ];
  }, []);

  const isLastSlide = activeIndex === slides.length;

  const next = () => {
    if (!isLastSlide) {
      setActiveIndex(prev => prev + 1);
      return;
    }

    finishOnboarding();
  };

  const finishOnboarding = () => {
    if (userData?.anthropometric_data && userData.body_photos) {
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
          <button type='button' className={styles.wrapper_skip} onClick={() => setActiveIndex(slides.length)}>
            Пропустить
          </button>
        )
      ) : (
        <p className={styles.wrapper_subscription}>Выберите подходящий для вас тип подписки</p>
      )}
      <div style={{ width: '100%' }}>
        {isLastSlide ? <PaymentSwiper /> : <OnboardingSlide data={slides[activeIndex]} />}
      </div>

      <div className={styles.wrapper_next} style={{ padding: isLastSlide ? '0 5% 5% 5%' : '0' }}>
        {!isLastSlide && <OnboardingDots total={slides.length} active={activeIndex} />}

        <Button buttonType={isLastSlide ? 'secondary' : 'primary'} onClick={next}>
          {isLastSlide ? 'Пропустить оплату' : 'Далее'}
        </Button>
      </div>
      {isPrivacyOpen && <PrivacyModal id={privacyId} onClose={() => setIsPrivacyOpen(false)} />}
    </div>
  );
};
