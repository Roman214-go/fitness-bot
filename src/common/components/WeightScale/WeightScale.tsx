import styles from './WeightScale.module.scss';

interface Props {
  value: number; // 70
}

export const WeightPrediction = ({ value }: Props) => {
  const ticks = 40;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Ориентировочный вес
        <br />
        через 30 дней
      </div>

      <div className={styles.value}>
        <span style={{ color: '#B3A0FF' }}>{value - 2.5}кг</span>
        <span style={{ fontSize: 42 }}>{value}кг</span>
        <span style={{ color: '#B3A0FF' }}>{value + 2.5}кг</span>
      </div>

      <div className={styles.scale}>
        {Array.from({ length: ticks }).map((_, i) => {
          const isCenter = i === ticks / 2;
          const isSide = i === 10 || i === 30;
          console.log(i, ticks);

          return (
            <div
              key={i}
              className={[styles.tick, isCenter && styles.tickCenter, isSide && styles.tickSide].join(' ')}
            />
          );
        })}
      </div>

      <div className={styles.range}></div>
    </div>
  );
};
