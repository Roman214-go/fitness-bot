import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTelegramResponse } from './authApi';

export interface VerifyAuthResponse {
  success: boolean;
  action: 'login' | 'register';
  user: {
    id: number;
    telegram_id: number;
    first_name: string;
    last_name: string;
    username: string;
    is_active: boolean;
    created_at: string;
  };
  profile_status: string;
  next_action: string;
  message: string;
  progress: {
    has_anthropometric_data: boolean;
    has_fitness_goals: boolean;
    has_nutrition_data: boolean;
    has_body_photos: boolean;
    has_medical_history: boolean;
    completion_percentage: number;
  };
}

interface AuthState {
  authData: VerifyAuthResponse | null;
  userData: UserTelegramResponse | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  authData: null,
  userData: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<VerifyAuthResponse>) {
      state.authData = action.payload;
      state.isLoading = false;
    },
    setUserData(state, action: PayloadAction<UserTelegramResponse>) {
      state.userData = action.payload;
    },
  },
});

export const { setAuthData, setUserData } = authSlice.actions;
export default authSlice.reducer;
