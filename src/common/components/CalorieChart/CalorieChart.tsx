import React from 'react';

import styles from './CalorieChart.module.scss';

interface CalorieSegment {
  value: number;
  color: string;
  label: string;
  id: number;
}

interface CalorieChartProps {
  totalCalories: number;
  segments: CalorieSegment[];
}

export const CalorieChart: React.FC<CalorieChartProps> = ({ totalCalories, segments }) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 26;

  let currentOffset = 0;

  const segmentElements = segments.map((segment, index) => {
    const segmentLength = (segment.value / total) * circumference;
    const offset = currentOffset;
    // eslint-disable-next-line react-hooks/immutability
    currentOffset += segmentLength;

    return (
      <circle
        key={index}
        cx='110'
        cy='110'
        r={radius}
        stroke={segment.color}
        strokeWidth={strokeWidth}
        fill='none'
        strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
        strokeDashoffset={-offset}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '110px 110px',
          transition: 'stroke-dashoffset 0.6s ease-in-out',
        }}
      />
    );
  });

  return (
    <div className={styles.calories}>
      <p>Рассчет КБЖУ</p>

      <div
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '40px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '220px',
            height: '220px',
          }}
        >
          <svg width='220' height='220' viewBox='0 0 220 220' style={{ display: 'block' }}>
            {segmentElements}
          </svg>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '30px',
                fontWeight: 700,
                lineHeight: 1,
                color: 'white',
                marginBottom: '4px',
              }}
            >
              {totalCalories}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'white',
                lineHeight: 1.2,
              }}
            >
              калорий в день
            </div>
          </div>
        </div>
      </div>
      <div className={styles.segments}>
        {segments.map(segment => (
          <div key={segment.id} className={styles.segment}>
            <div className={styles.segment_labelContainer}>
              <div className={styles.segment_color} style={{ background: segment.color }} />
              <p>{segment.label}</p>
            </div>
            <p style={{ color: '#E2F163' }}>{segment.value} гр./день</p>
          </div>
        ))}
      </div>
    </div>
  );
};
