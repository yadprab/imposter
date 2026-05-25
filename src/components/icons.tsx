interface SizeProps {
  size?: number;
}

export function VillainMask({ size = 64 }: SizeProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 80 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vmask" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4d6d" />
          <stop offset="1" stopColor="#80082b" />
        </linearGradient>
      </defs>
      <path
        d="M4 14 C 4 4, 14 0, 26 4 L 36 8 L 44 8 L 54 4 C 66 0, 76 4, 76 14 C 76 28, 64 40, 50 40 C 44 40, 41 36, 40 32 C 39 36, 36 40, 30 40 C 16 40, 4 28, 4 14 Z"
        fill="url(#vmask)"
        stroke="#2a0008"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse cx="20" cy="20" rx="8" ry="4.5" fill="#1a0207" />
      <ellipse cx="60" cy="20" rx="8" ry="4.5" fill="#1a0207" />
      <circle cx="23" cy="19" r="1.6" fill="#ff4d6d" />
      <circle cx="63" cy="19" r="1.6" fill="#ff4d6d" />
      <path d="M12 16 L 20 12" stroke="#ff8aa0" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M52 12 L 60 16" stroke="#ff8aa0" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

interface StarProps extends SizeProps {
  color?: string;
}

export function Sparkle({ size = 20, color = '#ffd866' }: StarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 1.5 L 13.6 10.4 L 22.5 12 L 13.6 13.6 L 12 22.5 L 10.4 13.6 L 1.5 12 L 10.4 10.4 Z" />
    </svg>
  );
}

export function StarShape({ size = 20, color = '#ffd866' }: StarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 2 L 14.85 8.78 L 22 9.27 L 16.5 14.14 L 18.2 21.5 L 12 17.6 L 5.8 21.5 L 7.5 14.14 L 2 9.27 L 9.15 8.78 Z" />
    </svg>
  );
}

export function Shush({ size = 18 }: SizeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14 Q 12 16 16 14" />
      <path d="M9 10 L 9 10.5" />
      <path d="M15 10 L 15 10.5" />
      <path d="M12 16 L 12 21" />
      <path d="M11 18 L 13 18" />
    </svg>
  );
}
