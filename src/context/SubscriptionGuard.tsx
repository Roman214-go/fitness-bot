import { ReactNode } from 'react';
import { Paywall } from '../common/components/Paywall/Paywall';
import { useAppSelector } from '../common/store/hooks';

type Props = {
  children: ReactNode;
};

export const SubscriptionGuard = ({ children }: Props) => {
  const { authData, userData } = useAppSelector(state => state.auth);

  if (!authData) return <>{children}</>;

  return (
    <>
      {children}
      {(userData?.subscription.status !== 'active' || !userData.has_workout_plan) && <Paywall />}
    </>
  );
};
