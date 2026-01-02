import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from '../context/AuthContext';
import { Layout } from './components/Layout/Layout';

import styles from './App.module.scss';
import HomePage from '../pages/HomePage/HomePage';
import { OnboardingGuard } from './components/Onboarding/OnboardingGuard';
import { MainFormPage } from '../pages/MainFormPage/MainFormPage';
import Onboarding from './components/Onboarding';

const App = () => {
  return (
    <div className={styles.main_container}>
      <AuthProvider>
        <OnboardingGuard>
          <Routes>
            <Route path='/onboarding' element={<Onboarding />} />
            <Route path='/main-form' element={<MainFormPage />} />
            <Route element={<Layout />}>
              {/* Публичные маршруты */}
              <Route path='/' element={<HomePage />} />
              {/* <Route path='/features' element={<FeaturesPage />} />
            <Route path='/subscription' element={<SubscriptionPage />} />
            <Route path='/forbidden' element={<ForbiddenPage />} /> */}

              {/* Защищенные маршруты только для Premium пользователей */}
              {/* <Route element={<ProtectedRoute requirePremium={true} />}>
              <Route path='/premium' element={<PremiumPage />} />
              </Route> */}
            </Route>
          </Routes>
        </OnboardingGuard>
      </AuthProvider>
    </div>
  );
};

export default App;
