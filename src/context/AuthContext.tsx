import { createContext, useContext, useState, ReactNode, useLayoutEffect, useCallback } from 'react';

type UserRole = 'guest' | 'free' | 'premium' | 'admin';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  mainFormCompleted: boolean;
  anamnesisCompleted: boolean;
  subscriptionExpiry?: Date;
  telegramId: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  isLoading: boolean;
  checkSubscription: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * ВРЕМЕННАЯ заглушка
   * В проде здесь должен быть запрос к backend
   */
  const fetchUserData = async (telegramId: number): Promise<User> => {
    return {
      id: String(telegramId),
      telegramId,
      username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'user',
      firstName: window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'User',
      lastName: window.Telegram?.WebApp?.initDataUnsafe?.user?.last_name,
      role: 'guest', // 'guest' | 'free' | 'premium' | 'admin'
      mainFormCompleted: false,
      anamnesisCompleted: false,
      subscriptionExpiry: undefined,
    };
  };

  const checkSubscription = useCallback((): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role !== 'premium') return false;

    if (user.subscriptionExpiry) {
      return new Date() < new Date(user.subscriptionExpiry);
    }

    return false;
  }, [user]);

  const isAuthenticated = !!user;
  const isPremium = checkSubscription();

  /**
   * Инициализация Telegram WebApp
   * ВАЖНО: useLayoutEffect — чтобы избежать мерцаний
   */
  useLayoutEffect(() => {
    const init = async () => {
      const tg = window.Telegram?.WebApp;

      if (!tg) {
        setIsLoading(false);
        return;
      }

      tg.ready();
      tg.expand();

      const telegramUser = tg.initDataUnsafe?.user;

      if (!telegramUser) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData(telegramUser.id);
        setUser(userData);
      } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isPremium,
        isLoading,
        checkSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
