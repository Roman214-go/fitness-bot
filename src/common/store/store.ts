import { configureStore } from '@reduxjs/toolkit';

import { authApi } from '../auth/authApi';
import authReducer from '../auth/authSlice';

import { getTraineeApi } from '../../pages/TrainingPage/api/getTrainee';
import { getHomework } from '../../pages/HomeworkPage/api/getHomework';

import subscriptionPlansReducer from '../components/PaymentSwiper/api/subscriptionSlice';
import paymentReducer from '../components/PaymentSwiper/api/paymentSlice';
import trialReducer from '../components/PaymentSwiper/api/trialSlice';
import achievementsReducer from '../../pages/ProfilePage/api/achievementsSlice';
import { leaderboardApi } from '../../pages/LeadersPage/api/leaderboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,

    subscriptionPlans: subscriptionPlansReducer,
    payment: paymentReducer,
    trial: trialReducer,

    achievements: achievementsReducer,

    [authApi.reducerPath]: authApi.reducer,
    [getTraineeApi.reducerPath]: getTraineeApi.reducer,
    [getHomework.reducerPath]: getHomework.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(getTraineeApi.middleware)
      .concat(getHomework.middleware)
      .concat(leaderboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
