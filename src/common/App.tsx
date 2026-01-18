import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from '../context/AuthContext';
import { Layout } from './components/Layout/Layout';

import styles from './App.module.scss';
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

const App = () => {
  return (
    <div className={styles.main_container}>
      <AuthProvider>
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
                  <SubscriptionGuard>
                    <ChatPage />
                  </SubscriptionGuard>
                }
              />{' '}
              <Route path='/profile' element={<ProfilePage />} />
            </Route>
            <Route path='/profile-edit' element={<ProfileEditPage />} />
            <Route path='/trainee' element={<TrainingPage />} />
            <Route path='/workout' element={<WorkoutPage />} />
          </Routes>
        </OnboardingGuard>
      </AuthProvider>
    </div>
  );
};

export default App;
