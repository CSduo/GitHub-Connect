interface WordmarkProps {
  compact?: boolean;
  className?: string;
}

export function Wordmark({ compact = false, className = "" }: WordmarkProps) {
  return (
    <div className={`text-center ${className}`}>
      <span
        className="block font-display leading-[0.9] tracking-[-0.04em]"
        style={{ fontSize: compact ? "clamp(20px, 5vw, 28px)" : "clamp(26px, 7vw, 38px)" }}
      >
        {"\u0906}\u0928}\u094D}\u0935}\u0940}\u0915}\u094D}\u0937}\u093F}\u0915}\u0940"}
      </span>
      {!compact && (
        <span
          className="block mt-1.5 font-ui text-[10px] sm:text-[11px] tracking-[0.35em] uppercase"
          style={{ color: "var(--gold)" }}
        >
          Anvikshiki
        </span>
      )}
    </div>
  );
}
