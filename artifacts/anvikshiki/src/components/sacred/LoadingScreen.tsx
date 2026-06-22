import { useEffect, useState } from "react";
import { Emblem } from "@/components/brand/Emblem";

export function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const [pct, setPct] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const steps = [20, 45, 70, 88, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setPct(steps[i]);
        i++;
        setTimeout(tick, i === steps.length ? 200 : 300 + Math.random() * 200);
      } else {
        setFade(true);
        setTimeout(() => onDone?.(), 500);
      }
    };
    const t = setTimeout(tick, 200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="loading-screen"
      style={{ transition: "opacity 0.5s ease", opacity: fade ? 0 : 1, pointerEvents: fade ? "none" : "auto" }}
      role="status"
      aria-live="polite"
      aria-label="Loading Ānvīkṣikī"
    >
      {/* Cosmic radials */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,26,74,0.18) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "10%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,40,120,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "40%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,152,58,0.08) 0%, transparent 70%)" }} />
      </div>

      {/* Spinning ring */}
      <div className="relative mb-8" aria-hidden="true">
        <svg width="120" height="120" viewBox="0 0 120 120" className="animate-spin-slow absolute inset-0">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
            <circle
              key={i}
              cx={60 + 54 * Math.cos((a * Math.PI) / 180)}
              cy={60 + 54 * Math.sin((a * Math.PI) / 180)}
              r="2.5"
              fill="var(--gold)"
              opacity={0.2 + (i % 4) * 0.15}
            />
          ))}
          <circle cx="60" cy="60" r="52" stroke="var(--gold)" strokeWidth="0.5" fill="none" opacity="0.2" strokeDasharray="4 8"/>
        </svg>
        <div className="relative w-[120px] h-[120px] flex items-center justify-center">
          <Emblem size={70} />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="font-display text-3xl tracking-[0.25em] mb-1"
          style={{ color: "var(--gold-bright)", letterSpacing: "0.3em" }}
        >
          ĀNVĪKṢIKĪ
        </h1>
        <p className="font-ui text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--ink-faint)" }}>
          A Journal of Inquiry & Civilizational Wisdom
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div
          style={{
            height: 1,
            background: "var(--border-gold)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--rose-bright), var(--gold), var(--gold-bright))",
              width: `${pct}%`,
              transition: "width 0.4s ease",
              boxShadow: "0 0 8px rgba(201,152,58,0.6)",
            }}
          />
        </div>
        <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-center mt-2" style={{ color: "var(--ink-faint)" }}>
          {pct < 100 ? "Opening the archive…" : "Welcome"}
        </p>
      </div>

      {/* Floating lotus petals */}
      {[
        { left: "10%", top: "20%", delay: "0s", dur: "5s" },
        { left: "85%", top: "30%", delay: "1s", dur: "6s" },
        { left: "20%", top: "75%", delay: "2s", dur: "4.5s" },
        { left: "75%", top: "70%", delay: "0.5s", dur: "5.5s" },
      ].map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: p.left, top: p.top,
            animation: `float ${p.dur} ${p.delay} ease-in-out infinite`,
            opacity: 0.3,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50% 0 50% 0", background: "var(--lotus)", transform: "rotate(45deg)" }} />
        </div>
      ))}
    </div>
  );
}
