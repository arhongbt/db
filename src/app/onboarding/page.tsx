'use client';

import { DodsboProvider } from '@/lib/context';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

// Note: OnboardingFlow component is complex with many nested components.
// Ensure all visible text strings in @/components/onboarding/OnboardingFlow.tsx are wrapped with t().

export default function OnboardingPage() {
  return (
    <DodsboProvider>
      <OnboardingFlow />
    </DodsboProvider>
  );
}
