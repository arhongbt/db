'use client';

/** Decorative SVG blob — organic shape behind content */
export function BlobDecoration({
  className = '',
  color = '#E8F0E8',
  size = 200,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={`absolute pointer-events-none opacity-50 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '42% 58% 62% 38% / 45% 55% 45% 55%',
        background: color,
        zIndex: 0,
      }}
    />
  );
}

/** Decorative leaf SVG — subtle nature element */
export function LeafDecoration({
  className = '',
  size = 24,
  color = '#7A9E7E',
  opacity = 0.15,
}: {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ opacity, zIndex: 0 }}
    >
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.31 12-12h-3Z"
        fill={color}
      />
      <path
        d="M17 8c-2 5-5.93 8.5-9 9.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

/** Sparkle/star decoration */
export function SparkleDecoration({
  className = '',
  size = 16,
  color = '#7A9E7E',
  opacity = 0.12,
}: {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ opacity, zIndex: 0 }}
    >
      <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
    </svg>
  );
}
