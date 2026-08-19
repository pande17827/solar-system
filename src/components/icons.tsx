interface IconProps {
  className?: string;
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.5 5.6c0-1.2 1.3-1.9 2.3-1.3l9.2 5.9c.9.6.9 2 0 2.6l-9.2 5.9c-1 .6-2.3-.1-2.3-1.3V5.6z" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6.2" y="4.5" width="4" height="15" rx="1.4" />
      <rect x="13.8" y="4.5" width="4" height="15" rx="1.4" />
    </svg>
  );
}

export function ResetIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3.5 8.5A9 9 0 1 1 3 13" />
      <path d="M3.5 3.5v5h5" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={className}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 5.5L8 12l6.5 6.5" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.5 5.5L16 12l-6.5 6.5" />
    </svg>
  );
}

export function OrbitMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="6.5" fill="#F5AE45" />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="5.4"
        stroke="#8FB8DE"
        strokeWidth="1.6"
        transform="rotate(-18 16 16)"
      />
      <circle cx="27.4" cy="10.2" r="2.1" fill="#8FB8DE" />
    </svg>
  );
}
