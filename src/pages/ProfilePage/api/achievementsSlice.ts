// src/store/slices/achievementsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Achievement, achievementsApi, AchievementsResponse } from './achievementsApi';

interface AchievementsState {
  achievements: Achievement[];
  myAchievements: Achievement[];
  myMainAchievement: Achievement | null;
  loading: boolean;
  error: string | null;
}

const initialState: AchievementsState = {
  achievements: [],
  myAchievements: [],
  myMainAchievement: null,
  loading: false,
  error: null,
};

export const fetchAchievements = createAsyncThunk<
  AchievementsResponse,
  { telegramId: number; includeInactive?: boolean },
  { rejectValue: string }
>('achievements/fetchAll', async ({ telegramId, includeInactive = false }, { rejectWithValue }) => {
  try {
    const response = await achievementsApi.getAll(telegramId, includeInactive);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки достижений');
  }
});

export const fetchMyAchievements = createAsyncThunk<
  AchievementsResponse,
  { telegramId: number },
  { rejectValue: string }
>('achievements/fetchMy', async ({ telegramId }, { rejectWithValue }) => {
  try {
    const response = await achievementsApi.getMy(telegramId);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки достижений');
  }
});

export const fetchMyMainAchievement = createAsyncThunk<
  AchievementsResponse,
  { telegramId: number },
  { rejectValue: string }
>('achievements/fetchMyMain', async ({ telegramId }, { rejectWithValue }) => {
  try {
    const response = await achievementsApi.getMyMain(telegramId);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки достижений');
  }
});

export const setMainAchievement = createAsyncThunk<
  number,
  { telegramId: number; achievementId: number },
  { rejectValue: string }
>('achievements/setMain', async ({ telegramId, achievementId }, { rejectWithValue }) => {
  try {
    await achievementsApi.setMyMain(telegramId, achievementId);
    return achievementId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка установки основной ачивки');
  }
});

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    clearAchievements: state => {
      state.achievements = [];
      state.myAchievements = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAchievements.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action: PayloadAction<AchievementsResponse>) => {
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка';
      })
      .addCase(fetchMyAchievements.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAchievements.fulfilled, (state, action: PayloadAction<AchievementsResponse>) => {
        state.loading = false;
        state.myAchievements = action.payload;
      })
      .addCase(fetchMyAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка';
      })
      .addCase(fetchMyMainAchievement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyMainAchievement.fulfilled, (state, action: PayloadAction<Achievement[]>) => {
        state.loading = false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        state.myMainAchievement = action.payload.achievement;
      })
      .addCase(fetchMyMainAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка';
      });
  },
});

export const { clearAchievements } = achievementsSlice.actions;
export default achievementsSlice.reducer;
