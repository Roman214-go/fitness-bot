export const checkSubscriptionStatus = (subscription?: { status?: string }): boolean => {
  return subscription?.status === 'active';
};
