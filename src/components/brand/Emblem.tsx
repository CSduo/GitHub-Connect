interface EmblemProps {
  className?: string;
  size?: number;
}

export function Emblem({ className = "", size = 58 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Anvikshiki emblem"
    >
      {/* Outer circle */}
      <circle
        cx="128"
        cy="128"
        r="118"
        fill="var(--surface)"
        stroke="var(--gold)"
        strokeWidth="3"
      />
      {/* Arch */}
      <path
        d="M58 208V92c0-16 16-23 28-23 6-24 78-24 84 0 12 0 28 7 28 23v116"
        stroke="var(--gold)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Book base */}
      <path
        d="M70 203c28-14 45-8 58 2 13-10 30-16 58-2"
        stroke="var(--gold)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tree trunk */}
      <line
        x1="128"
        y1="198"
        x2="128"
        y2="111"
        stroke="var(--gold)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Tree branches */}
      <path
        d="M128 120c-24-24-40-14-54 3"
        stroke="var(--gold)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M128 120c24-24 40-14 54 3"
        stroke="var(--gold)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lamp */}
      <line
        x1="128"
        y1="75"
        x2="128"
        y2="110"
        stroke="var(--gold)"
        strokeWidth="2"
      />
      <rect
        x="116"
        y="76"
        width="24"
        height="36"
        rx="7"
        stroke="var(--gold)"
        strokeWidth="3"
        fill="none"
        className="emblem-lamp"
      />
      {/* Lamp flame */}
      <path
        d="M128 105c9 8 9 18 0 26-9-8-9-18 0-26Z"
        fill="var(--rose)"
      />
      {/* Decorative dots */}
      <circle cx="88" cy="130" r="6" fill="var(--rose)" opacity="0.7" />
      <circle cx="168" cy="130" r="6" fill="var(--rose)" opacity="0.7" />
    </svg>
  );
}
