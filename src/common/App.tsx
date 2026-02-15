import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import { OnboardingGuard } from './components/Onboarding/OnboardingGuard';
import { MainFormPage } from '../pages/MainFormPage/MainFormPage';
import Onboarding from './components/Onboarding';
import { AnamnesisFormPage } from '../pages/AnamnesisFormPage/AnamnesisFormPage';
import { CalendarPage } from '../pages/CalendarPage/CalendarPage';
import { LeadersPage } from '../pages/LeadersPage/LeadersPage';
import { ChatPage } from '../pages/ChatPage/ChatPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import ProfileEditPage from '../pages/ProfileEditPage/ProfileEditPage';
import { TrainingPage } from '../pages/TrainingPage/TrainingPage';
import { WorkoutPage } from '../pages/WorkoutPage/WorkoutPage';
import { SubscriptionGuard } from '../context/SubscriptionGuard';
import { AuthInitializer } from './auth/AuthInitializer';
import { HomeworkPage } from '../pages/HomeworkPage/HomeworkPage';

import styles from './App.module.scss';
import { useAppSelector } from './store/hooks';
import { AdminChatPage } from '../pages/ChatPage/AdminChatPage';
import { ErrorBoundary } from '../pages/ErrorBoundary/ErrorBoundary';

const App = () => {
  const [authLoaded, setAuthLoaded] = useState(false);
  const { userData } = useAppSelector(state => state.auth);

  if (!authLoaded) {
    return <AuthInitializer onAuthLoaded={() => setAuthLoaded(true)} />;
  }

  return (
    <ErrorBoundary>
      <div className={styles.main_container}>
        <OnboardingGuard>
          <Routes>
            <Route path='/onboarding' element={<Onboarding />} />
            <Route path='/main-form' element={<MainFormPage />} />
            <Route path='/anamnesis-form' element={<AnamnesisFormPage />} />

            <Route element={<Layout />}>
              <Route path='/' element={<HomePage />} />
              <Route
                path='/calendar'
                element={
                  <SubscriptionGuard>
                    <CalendarPage />
                  </SubscriptionGuard>
                }
              />
              <Route path='/leaders' element={<LeadersPage />} />
              <Route
                path='/chat'
                element={
                  userData?.role.name === 'admin' ? (
                    <AdminChatPage />
                  ) : (
                    <SubscriptionGuard subscribed>
                      <ChatPage />
                    </SubscriptionGuard>
                  )
                }
              />
              <Route path='/profile' element={<ProfilePage />} />
            </Route>
            <Route path='/profile-edit' element={<ProfileEditPage />} />
            <Route path='/training/:date' element={<TrainingPage />} />
            <Route path='/workout/:date' element={<WorkoutPage />} />
            <Route path='/homework' element={<HomeworkPage />} />
          </Routes>
        </OnboardingGuard>
      </div>
    </ErrorBoundary>
  );
};

export default App;
