import { useState } from 'react';

import { onboardingSlides } from './onboarding.data';
import { OnboardingSlide } from './OnboardingSlide';
import { OnboardingDots } from './OnboardingDots';
import Button from '../Button';

import styles from './Onboarding.module.scss';
import { useNavigate } from 'react-router-dom';

export const Onboarding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (activeIndex < onboardingSlides.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    navigate('/main-form');
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.wrapper_skip} onClick={finishOnboarding}>
        пропустить
      </button>

      <OnboardingSlide data={onboardingSlides[activeIndex]} />
      <div className={styles.wrapper_next}>
        <OnboardingDots total={onboardingSlides.length} active={activeIndex} />

        <Button onClick={next}>Далее</Button>
      </div>
    </div>
  );
};
