import { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Paywall } from '../common/components/Paywall/Paywall';

type Props = {
  children: ReactNode;
};

export const SubscriptionGuard = ({ children }: Props) => {
  const { isPremium, isLoading, isAuthenticated } = useAuth();
  console.log(isPremium);

  if (isLoading) return null;

  // гость — не показываем paywall, этим занимается Auth / Onboarding
  if (!isAuthenticated) return <>{children}</>;

  return (
    <>
      {children}
      {!isPremium && <Paywall />}
    </>
  );
};
