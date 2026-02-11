import { OnboardingSlideData } from './onboarding.data.tsx';
import styles from './Onboarding.module.scss';

interface Props {
  data: OnboardingSlideData;
}

export const OnboardingSlide = ({ data }: Props) => {
  return (
    <div className={styles.slide}>
      <h2 className={styles.slide_title}>{data.title}</h2>
      <p className={styles.slide_text}>{data.text}</p>
    </div>
  );
};
