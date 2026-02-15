import { ReactNode } from 'react';
import { Paywall } from '../common/components/Paywall/Paywall';
import { useAppSelector } from '../common/store/hooks';
import { checkSubscriptionStatus } from '../common/utils/checkSubscription';

type Props = {
  children: ReactNode;
  subscribed?: boolean;
};

export const SubscriptionGuard = ({ children, subscribed = false }: Props) => {
  const { authData, userData } = useAppSelector(state => state.auth);

  if (!authData) return <>{children}</>;

  const showPaywall = () => {
    if (subscribed && checkSubscriptionStatus(userData?.subscription)) {
      return false;
    }

    if (checkSubscriptionStatus(userData?.subscription) && userData?.has_workout_plan) {
      return false;
    }

    return true;
  };
  return (
    <>
      {children}
      {showPaywall() && <Paywall />}
    </>
  );
};
