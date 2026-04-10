'use client';

import { DodsboProvider } from '@/lib/context';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  return (
    <DodsboProvider>
      <OnboardingFlow />
    </DodsboProvider>
  );
}
