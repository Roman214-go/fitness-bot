import { ReactNode } from 'react';
import { Paywall } from '../common/components/Paywall/Paywall';
import { useAppSelector } from '../common/store/hooks';
import { checkSubscriptionStatus } from '../common/utils/checkSubscription';

type Props = {
  children: ReactNode;
};

export const SubscriptionGuard = ({ children }: Props) => {
  const { authData, userData } = useAppSelector(state => state.auth);

  if (!authData) return <>{children}</>;

  return (
    <>
      {children}
      {(!checkSubscriptionStatus(userData?.subscription) || !userData?.has_workout_plan) && <Paywall />}
    </>
  );
};
