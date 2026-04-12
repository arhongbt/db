'use client';

import { useEffect } from 'react';

export function TextScaleLoader() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScale = localStorage.getItem('sr_text_scale');
      const scaleValue = savedScale
        ? parseFloat(savedScale)
        : 1;
      document.documentElement.style.setProperty('--text-scale', scaleValue.toString());
    }
  }, []);

  return null;
}
