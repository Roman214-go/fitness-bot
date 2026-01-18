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

const DEV_USER: User = {
  id: 'dev-user',
  telegramId: 0,
  username: 'dev_user',
  firstName: 'Dev',
  lastName: 'User',
  role: 'free',
  mainFormCompleted: true,
  anamnesisCompleted: true,
  subscriptionExpiry: undefined,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (telegramId: number): Promise<User> => {
    return {
      ...DEV_USER,
      id: String(telegramId),
      telegramId,
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

  useLayoutEffect(() => {
    const init = async () => {
      const tg = window.Telegram?.WebApp;

      if (tg?.initDataUnsafe?.user) {
        tg.ready();
        tg.expand();

        const telegramUser = tg.initDataUnsafe.user;
        const userData = await fetchUserData(telegramUser.id);
        setUser(userData);
        setIsLoading(false);
        return;
      }

      setUser(DEV_USER);
      setIsLoading(false);
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
