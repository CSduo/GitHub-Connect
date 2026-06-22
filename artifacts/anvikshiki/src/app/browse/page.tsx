import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { LotusDivider, LotusIcon } from "@/components/sacred/LotusIcon";
import { EmptyState } from "@/components/sacred/EmptyState";

const DOMAINS = [
  { slug: "philosophy",             label: "Philosophy",             icon: "🕉️",  desc: "Logic, metaphysics, ethics, and the nature of reality",          color: "#2d1852", accent: "#7c5cbf" },
  { slug: "history",                label: "History",                icon: "📜",  desc: "Ancient and modern civilizations, events, and patterns",          color: "#1a0d2e", accent: "#8b4513" },
  { slug: "psychology",             label: "Psychology",             icon: "🌙",  desc: "Mind, consciousness, behavior, and inner life",                   color: "#0f1e2e", accent: "#4682b4" },
  { slug: "sociology",              label: "Sociology",              icon: "🪔",  desc: "Society, culture, community, and collective identity",            color: "#0d1f15", accent: "#2d6b50" },
  { slug: "science",                label: "Science",                icon: "✨",  desc: "Cosmos, nature, discovery, and empirical inquiry",               color: "#1a1a0f", accent: "#8b7355" },
  { slug: "geopolitics",            label: "Geopolitics",            icon: "🌏",  desc: "Power, territory, nations, and civilizational orders",           color: "#1f0d0d", accent: "#8b1a1a" },
  { slug: "civilizational-thought", label: "Civilizational Thought", icon: "🏛️",  desc: "Long-arc thinking about culture, tradition, and society",         color: "#1a0f1a", accent: "#8b1a74" },
  { slug: "aesthetics",             label: "Aesthetics",             icon: "🪷",  desc: "Art, beauty, literature, music, and creative expression",         color: "#1a1018", accent: "#9a4080" },
  { slug: "sanskrit-studies",       label: "Sanskrit Studies",       icon: "ॐ",  desc: "Sacred texts, grammar, language, and classical learning",        color: "#1a1208", accent: "#b8860b" },
  { slug: "political-theory",       label: "Political Theory",       icon: "⚖️",  desc: "Governance, justice, sovereignty, and statecraft",               color: "#0a1a1a", accent: "#2e8b57" },
  { slug: "papers",                 label: "Research Papers",        icon: "📖",  desc: "Peer-reviewed academic research across all disciplines",          color: "#120a16", accent: "#6a0dad" },
  { slug: "translations",           label: "Translations",           icon: "🖋️",  desc: "Classical texts brought into living language",                   color: "#0f0f0f", accent: "#696969" },
];

export default function BrowsePage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero banner */}
      <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
        <div className="absolute inset-0" aria-hidden="true">
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d0510 0%, #120818 40%, #0d0a18 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(139,26,74,0.30) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: "60%", height: "100%", background: "radial-gradient(ellipse at 85% 30%, rgba(74,40,120,0.22) 0%, transparent 50%)" }} />
          {/* Dot field */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${5 + (i * 41) % 90}%`, top: `${10 + (i * 67) % 80}%`, width: 2, height: 2, borderRadius: "50%", background: "var(--gold)", opacity: 0.1 }} aria-hidden="true" />
          ))}
        </div>

        <div className="container-anv relative z-10 flex flex-col items-center justify-center text-center py-16">
          <div className="section-label mb-3">Explore the Journal</div>
          <h1 className="font-display mb-3" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "var(--gold-bright)", letterSpacing: "0.12em" }}>Browse</h1>
          <LotusIcon size={20} className="mb-4 animate-float" style={{ color: "var(--gold)", opacity: 0.7 }} />
          <p className="font-body text-base max-w-md" style={{ color: "var(--ink-faint)" }}>
            Discover ideas across philosophy, history, science, and the dharmic traditions of civilizational thought.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(180deg, transparent, var(--bg))" }} aria-hidden="true" />
      </div>

      {/* Domains grid */}
      <div className="container-anv py-12">
        <div className="text-center mb-10">
          <LotusDivider className="mb-4" />
          <div className="section-label mb-2">Domains</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {DOMAINS.map(d => (
            <Link key={d.slug} href={`/domains/${d.slug}`} aria-label={`Browse ${d.label}`}>
              <div
                className="domain-card"
                style={{
                  aspectRatio: "3/4",
                  background: `linear-gradient(180deg, ${d.color} 0%, #07040a 100%)`,
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 25%, ${d.accent}25 0%, transparent 60%)` }} aria-hidden="true" />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${d.accent}, transparent)` }} aria-hidden="true" />
                {/* Corner ornaments */}
                {[["top-2 left-2","borderTop borderLeft"],["top-2 right-2","borderTop borderRight"],["bottom-2 left-2","borderBottom borderLeft"],["bottom-2 right-2","borderBottom borderRight"]].map(([cls]) => (
                  <div key={cls} className={`absolute ${cls}`} style={{ width: 14, height: 14, borderColor: "rgba(201,152,58,0.4)", borderStyle: "solid", borderWidth: 0 }} aria-hidden="true" />
                ))}
                <div style={{ position: "absolute", top: 6, left: 6, width: 14, height: 14, borderTop: "1px solid rgba(201,152,58,0.4)", borderLeft: "1px solid rgba(201,152,58,0.4)" }} aria-hidden="true" />
                <div style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, borderTop: "1px solid rgba(201,152,58,0.4)", borderRight: "1px solid rgba(201,152,58,0.4)" }} aria-hidden="true" />
                <div style={{ position: "absolute", bottom: 6, left: 6, width: 14, height: 14, borderBottom: "1px solid rgba(201,152,58,0.4)", borderLeft: "1px solid rgba(201,152,58,0.4)" }} aria-hidden="true" />
                <div style={{ position: "absolute", bottom: 6, right: 6, width: 14, height: 14, borderBottom: "1px solid rgba(201,152,58,0.4)", borderRight: "1px solid rgba(201,152,58,0.4)" }} aria-hidden="true" />

                <div className="absolute inset-x-0 top-10 flex flex-col items-center gap-2">
                  <div style={{ fontSize: "2.25rem", filter: `drop-shadow(0 0 10px ${d.accent}80)` }}>{d.icon}</div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                  <LotusIcon size={10} className="mx-auto mb-1.5" style={{ color: "var(--gold)", opacity: 0.4 }} />
                  <div className="font-ui text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: "var(--gold-bright)" }}>{d.label}</div>
                  <div className="font-body text-[10px] leading-tight line-clamp-2" style={{ color: "var(--ink-faint)" }}>{d.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Archive + Collections strip */}
      <div className="py-12" style={{ background: "var(--surface)" }}>
        <div className="container-anv">
          <LotusDivider className="mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Archive", href: "/archive", icon: "📚", desc: "All published essays and papers, chronologically arranged." },
              { label: "Papers", href: "/papers", icon: "🗄️", desc: "Peer-reviewed research and academic manuscripts." },
            ].map(p => (
              <Link key={p.href} href={p.href}>
                <div className="card-sacred p-6 flex items-center gap-5 cursor-pointer">
                  <div style={{ fontSize: "2rem", flexShrink: 0 }}>{p.icon}</div>
                  <div className="flex-1">
                    <div className="section-label mb-1">{p.label}</div>
                    <p className="font-body text-sm" style={{ color: "var(--ink-faint)" }}>{p.desc}</p>
                  </div>
                  <ArrowRight size={18} style={{ color: "var(--gold)", flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
