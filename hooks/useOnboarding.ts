import { useContext } from 'react';
import { OnboardingContext } from '@/context/OnboardingContext';

export const useOnboarding = () => {
  return useContext(OnboardingContext);
};
