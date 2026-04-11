'use client';

import Image from 'next/image';

interface DoveLogoProps {
  size?: number;
  className?: string;
}

export function DoveLogo({ size = 40, className = '' }: DoveLogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Sista Resan"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
