import styles from './Onboarding.module.scss';

interface OnboardingDotsProps {
  total: number;
  active: number;
}

export const OnboardingDots = ({ total, active }: OnboardingDotsProps) => {
  return (
    <div className={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={i === active ? styles.activeDot : styles.dot} />
      ))}
    </div>
  );
};
