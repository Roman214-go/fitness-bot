import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../auth/authApi';
import authReducer from '../auth/authSlice';
import { getTraineeApi } from '../../pages/TrainingPage/api/getTrainee';
import { getHomework } from '../../pages/HomeworkPage/api/getHomework';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [getTraineeApi.reducerPath]: getTraineeApi.reducer,
    [getHomework.reducerPath]: getHomework.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware).concat(getTraineeApi.middleware).concat(getHomework.middleware), // <-- добавляем сюда
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
