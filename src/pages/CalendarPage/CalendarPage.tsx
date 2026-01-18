import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import Button from '../../common/components/Button';
import { HiddenText } from '../../common/components/HiddenText/HiddenText';
import { useNavigate } from 'react-router-dom';

type WorkoutStatus = 'planned' | 'completed' | 'last' | 'rest' | 'not_completed';

interface DayData {
  date: number;
  status: WorkoutStatus | null;
}

export const CalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0, 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const navigate = useNavigate();

  const weekDays = ['Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'];
  const months = [
    'Январь',
    'Декабрь',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const generateCalendarDays = (): DayData[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const days: DayData[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push({ date: 0, status: null });
    }

    const workoutDays: { [key: number]: WorkoutStatus } = {
      1: 'planned',
      3: 'planned',
      5: 'planned',
      8: 'planned',
      10: 'planned',
      12: 'planned',
      15: 'not_completed',
      17: 'completed',
      19: 'completed',
      22: 'completed',
      24: 'completed',
      26: 'completed',
      29: 'last',
    };

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        status: workoutDays[i] || null,
      });
    }

    return days;
  };

  const days = generateCalendarDays();

  const handleDayClick = (day: DayData) => {
    if (day.status === 'planned' && day.date > 0) {
      setSelectedDay(day.date);
      navigate('/trainee');
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getButtonClass = (status: WorkoutStatus | null): string => {
    const baseClass = 'calendar-day';
    if (!status) return `${baseClass} ${baseClass}--empty`;

    switch (status) {
      case 'planned':
        return `${baseClass} ${baseClass}--planned`;
      case 'completed':
        return `${baseClass} ${baseClass}--completed`;
      case 'last':
        return `${baseClass} ${baseClass}--last`;
      case 'not_completed':
        return `${baseClass} ${baseClass}--not_completed`;
      default:
        return baseClass;
    }
  };

  return (
    <div className='workout-calendar'>
      <h2 className='title'>Календарь тренировок</h2>
      <div className='calendar-header'>
        <button className='nav-button' onClick={goToPreviousMonth}>
          <ChevronLeft size={20} />
        </button>
        <p>{months[currentMonth.getMonth()]}</p>
        <button className='nav-button' onClick={goToNextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className='weekdays'>
        {weekDays.map(day => (
          <div key={day} className='weekday'>
            {day}
          </div>
        ))}
      </div>

      <div className='calendar-grid'>
        {days.map((day, index) => (
          <div key={index} className='calendar-cell'>
            {day.date > 0 && (
              <button className={getButtonClass(day.status)} onClick={() => handleDayClick(day)}>
                <span className='day-number'>{day.date}</span>
                {day.status && <Dumbbell className='workout-icon' size={16} />}
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ margin: '10px 0' }}>
        <HiddenText text='Информаци про календарь' />
      </div>
      <div className='legend'>
        <div className='legend-item'>
          <div className='legend-icon legend-icon--planned'>
            <Dumbbell size={16} />
          </div>
          <span>Запланированная тренировка</span>
        </div>
        <div className='legend-item'>
          <div className='legend-icon legend-icon--completed'>
            <Dumbbell size={16} />
          </div>
          <span>Завершенная тренировка</span>
        </div>
        <div className='legend-item'>
          <div className='legend-icon legend-icon--not_completed'>
            <Dumbbell size={16} />
          </div>
          <span>Незавершенная тренировка</span>
        </div>
        <div className='legend-item'>
          <div className='legend-icon legend-icon--last'>
            <Dumbbell size={16} />
          </div>
          <span>Last тренировка</span>
        </div>
        <div className='legend-item'>
          <div className='legend-icon legend-icon--rest'></div>
          <span>Выходной день</span>
        </div>
        <Button
          onClick={() => {
            console.log(selectedDay);
          }}
        >
          Домашнее задание
        </Button>
      </div>

      <style>{`
        .workout-calendar {
          color: #ffffff;
          padding: 20px;
          border-radius: 16px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .nav-button {
          background: none;
          border: none;
          color: #fbbf24;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }
        
        .title {
            text-align: center;
            font-size: 20px;
            margin-bottom: 20px;
        }
        
        .nav-button:hover {
          opacity: 0.7;
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .weekday {
          text-align: center;
          font-size: 12px;
          color: #E2F163;
          font-weight: 500;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }

        .calendar-cell {
          aspect-ratio: 1;
        }

        .calendar-day {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 8px;
          background-color: #2a2a2a;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          transition: all 0.2s;
          position: relative;
        }

        .calendar-day:hover {
          transform: scale(1.05);
        }

        .calendar-day--empty {
          background-color: transparent;
          cursor: default;
        }
        
        .calendar-day--not_completed {
          background-color: #fe003f;
          cursor: default;
        }
        
        .calendar-day--empty:hover {
          transform: none;
        }

        .calendar-day--planned {
          background-color: #7c3aed;
          background: linear-gradient(90deg,rgba(179, 160, 255, 1) 0%, rgba(137, 108, 254, 1) 100%);
        }

        .calendar-day--completed {
                  background-color: #00df25;

          border: 2px solid #1b8600;
        }

        .calendar-day--last {
          background-color: #fbbf24;
          color: #1a1a1a;
        }

        .day-number {
          font-size: 14px;
          font-weight: 600;
        }

        .workout-icon {
          opacity: 0.9;
        }

        .expand-button {
          width: 100%;
          background: none;
          border: none;
          color: #fbbf24;
          cursor: pointer;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: opacity 0.2s;
        }

        .expand-button:hover {
          opacity: 0.7;
        }

        .legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .legend-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .legend-icon--planned {
          background-color: #7c3aed;
        }

        .legend-icon--completed {
          background-color: #00df25;
          border: 2px solid #1b8600;
        }
        .legend-icon--not_completed {
          background-color: #fe003f;
        }

        .legend-icon--last {
          background-color: #fbbf24;
          color: #1a1a1a;
        }

        .legend-icon--rest {
          background-color: #2a2a2a;
        }

        .selected-info {
          margin-top: 20px;
          padding: 12px;
          background-color: #2a2a2a;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};
