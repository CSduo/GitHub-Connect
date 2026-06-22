import { useLocation } from "wouter";
import { Feather, BookOpen } from "lucide-react";
import { LotusDivider, LotusIcon } from "@/components/sacred/LotusIcon";

const TYPES = [
  { key: "essay",       label: "Essay / Paper",       icon: <Feather size={28} />,   color: "#1a0f3a", accent: "#7c5cbf", desc: "Original scholarly or reflective work" },
  { key: "review",      label: "Review / Commentary", icon: <BookOpen size={28} />,  color: "#1a0d12", accent: "#8b1a4a", desc: "Critical review or commentary on existing work" },
  { key: "translation", label: "Translation",         icon: <span style={{ fontSize: 26 }}>🖋️</span>, color: "#1a1208", accent: "#b8860b", desc: "Classical text translated into living language" },
  { key: "book-review", label: "Book Review",         icon: <span style={{ fontSize: 26 }}>📚</span>, color: "#0d1f15", accent: "#2d6b50", desc: "Review of a published book or manuscript" },
];

export default function SubmitLandingPage() {
  const [, navigate] = useLocation();

  const choose = (type: string) => {
    sessionStorage.setItem("anvikshiki_submit_type", type);
    navigate("/submit/details");
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
        <div className="absolute inset-0" aria-hidden="true">
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0f0518 0%, #120a20 50%, #0a0510 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(74,40,120,0.30) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 60%, rgba(139,26,74,0.22) 0%, transparent 45%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(180deg, transparent, var(--bg))" }} />
        </div>
        <div className="container-anv relative z-10 flex flex-col items-center text-center py-20">
          <LotusIcon size={32} className="mb-4 animate-float" style={{ color: "var(--gold)", opacity: 0.8 }} />
          <div className="section-label mb-3">Submission Portal</div>
          <h1 className="font-display mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "var(--gold-bright)", letterSpacing: "0.12em" }}>Submit</h1>
          <p className="font-body text-base max-w-md" style={{ color: "var(--ink-faint)" }}>
            Share your research, reflections, and translations with the Ānvīkṣikī community.
          </p>
        </div>
      </div>

      {/* Type cards */}
      <div className="container-anv py-10 pb-20">
        <LotusDivider className="mb-8" />
        <div className="text-center mb-8">
          <div className="section-label mb-2">Submission Type</div>
          <p className="font-body text-sm" style={{ color: "var(--ink-faint)" }}>Choose the type of work you are submitting</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
          {TYPES.map(t => (
            <button key={t.key} type="button" onClick={() => choose(t.key)} aria-label={`Submit ${t.label}`} style={{ all: "unset", cursor: "pointer", display: "block" }}>
              <div className="domain-card" style={{ aspectRatio: "3/4.5", background: `linear-gradient(180deg, ${t.color} 0%, #07040a 100%)` }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${t.accent}25 0%, transparent 60%)` }} aria-hidden="true" />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }} aria-hidden="true" />
                <div style={{ position: "absolute", top: 6, left: 6, width: 12, height: 12, borderTop: "1px solid rgba(201,152,58,0.4)", borderLeft: "1px solid rgba(201,152,58,0.4)" }} aria-hidden="true" />
                <div style={{ position: "absolute", top: 6, right: 6, width: 12, height: 12, borderTop: "1px solid rgba(201,152,58,0.4)", borderRight: "1px solid rgba(201,152,58,0.4)" }} aria-hidden="true" />
                <div style={{ position: "absolute", bottom: 6, left: 6, width: 12, height: 12, borderBottom: "1px solid rgba(201,152,58,0.4)", borderLeft: "1px solid rgba(201,152,58,0.4)" }} aria-hidden="true" />
                <div style={{ position: "absolute", bottom: 6, right: 6, width: 12, height: 12, borderBottom: "1px solid rgba(201,152,58,0.4)", borderRight: "1px solid rgba(201,152,58,0.4)" }} aria-hidden="true" />
                <div className="absolute inset-x-0 top-8 flex justify-center" style={{ color: t.accent, filter: `drop-shadow(0 0 8px ${t.accent}90)` }}>{t.icon}</div>
                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                  <LotusIcon size={10} className="mx-auto mb-1.5" style={{ color: "var(--gold)", opacity: 0.4 }} />
                  <div className="font-ui text-xs font-bold tracking-[0.12em] uppercase mb-1" style={{ color: "var(--gold-bright)" }}>{t.label}</div>
                  <div className="font-body text-[10px] leading-tight" style={{ color: "var(--ink-faint)" }}>{t.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="mt-12 card-sacred p-6 max-w-2xl mx-auto">
          <LotusDivider className="mb-4" />
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[{ n: "1", l: "Choose Type", d: "Select what you are submitting" }, { n: "2", l: "Add Details", d: "Fill in your manuscript details" }, { n: "3", l: "Upload & Review", d: "Upload files and submit" }].map(s => (
              <div key={s.n} className="flex flex-col items-center gap-2">
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border-gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>{s.n}</div>
                <div className="font-ui text-xs font-semibold" style={{ color: "var(--gold-bright)" }}>{s.l}</div>
                <div className="font-body text-xs" style={{ color: "var(--ink-faint)" }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
