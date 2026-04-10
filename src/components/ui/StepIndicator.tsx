'use client';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-2.5 rounded-full transition-all duration-300 ${
            i === currentStep
              ? 'w-8 bg-accent'
              : i < currentStep
              ? 'w-2.5 bg-success'
              : 'w-2.5 bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
