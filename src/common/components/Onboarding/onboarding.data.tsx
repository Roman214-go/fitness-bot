import { ReactNode } from 'react';
import { BsCameraVideo, BsChatText } from 'react-icons/bs';
import { CiDumbbell } from 'react-icons/ci';
import { LuCalendar1 } from 'react-icons/lu';

export interface OnboardingSlideData {
  id: number;
  title: ReactNode;
  text: ReactNode;
  icon?: ReactNode;
}

export const onboardingSlides: OnboardingSlideData[] = [
  {
    id: 2,
    icon: <CiDumbbell fontSize={50} style={{ transform: 'rotate(-45deg)' }} />,
    title: 'Персональная программа тренировок',
    text: 'Тренировки, разработанные тренером специально для Вас. Программа формируется с учётом Ваших индивидуальных особенностей, целей и задач.',
  },
  {
    id: 3,
    icon: <BsChatText fontSize={50} />,
    title: 'Прямая связь с коучем',
    text: 'Получайте поддержку в любое время Задавайте вопросы, делитесь прогрессом и получайте рекомендации напрямую от своего коуча.',
  },
  {
    id: 4,
    icon: <BsCameraVideo fontSize={50} />,
    title: 'Видео-инструкции',
    text: 'Правильная техника каждого упражнения Смотрите подробные видео с объяснениями, чтобы выполнять упражнения безопасно и эффективно.',
  },
  {
    id: 5,
    icon: <LuCalendar1 fontSize={50} />,
    title: 'Интерактивный календарь',
    text: 'Ваш прогресс — наглядно и удобно. Отслеживайте выполненные тренировки, планируйте занятия и сохраняйте регулярность.',
  },
];
