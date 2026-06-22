import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Feather, Users, Archive } from "lucide-react";
import { Emblem } from "@/components/brand/Emblem";
import { LotusIcon, LotusDivider, MandalaRing } from "@/components/sacred/LotusIcon";
import { EmptyState } from "@/components/sacred/EmptyState";

const base = () => import.meta.env.BASE_URL.replace(/\/$/, "");

const DOMAINS = [
  { slug: "philosophy",            label: "Philosophy",          color: "#2d1852", accent: "#7c5cbf", icon: "🕉️" },
  { slug: "history",               label: "History",             color: "#1a0d2e", accent: "#8b4513", icon: "📜" },
  { slug: "psychology",            label: "Psychology",          color: "#0f1e2e", accent: "#4682b4", icon: "🌙" },
  { slug: "sociology",             label: "Sociology",           color: "#0d1f15", accent: "#2d6b50", icon: "🪔" },
  { slug: "science",               label: "Science",             color: "#1a1a0f", accent: "#8b7355", icon: "✨" },
  { slug: "geopolitics",           label: "Geopolitics",         color: "#1f0d0d", accent: "#8b1a1a", icon: "🌏" },
  { slug: "civilizational-thought",label: "Civilizational",     color: "#1a0f1a", accent: "#8b1a74", icon: "🏛️" },
  { slug: "aesthetics",            label: "Aesthetics",          color: "#1a1018", accent: "#9a4080", icon: "🪷" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const b = base();
    Promise.all([
      fetch(`${b}/api/articles?limit=1`).then(r => r.json()).catch(() => ({})),
      fetch(`${b}/api/articles?limit=4`).then(r => r.json()).catch(() => ({})),
    ]).then(([feat, latest]) => {
      setFeatured(feat.articles?.[0] || null);
      setRecent(latest.articles || []);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "85vh" }}>
        {/* Cosmic background layers */}
        <div className="absolute inset-0" aria-hidden="true">
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d0510 0%, #120818 35%, #0d0a18 60%, #0a0610 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", background: "radial-gradient(ellipse at 20% 30%, rgba(139,26,74,0.35) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "80%", background: "radial-gradient(ellipse at 80% 20%, rgba(74,40,120,0.25) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg, transparent 0%, rgba(7,4,10,0.98) 100%)" }} />
          {/* Decorative dots pattern */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} aria-hidden="true" style={{
              position: "absolute",
              left: `${5 + (i * 37) % 90}%`,
              top: `${10 + (i * 53) % 80}%`,
              width: i % 5 === 0 ? 3 : 2,
              height: i % 5 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: "var(--gold)",
              opacity: 0.08 + (i % 5) * 0.04,
            }} />
          ))}
        </div>

        <div className="container-anv relative z-10 flex flex-col items-center justify-center text-center pt-20 pb-16" style={{ minHeight: "85vh" }}>
          {/* Floating mandala */}
          <div className="animate-spin-slow mb-4" aria-hidden="true">
            <MandalaRing size={80} className="text-gold" style={{ color: "var(--gold)", opacity: 0.3 }} />
          </div>

          {/* Logo & title */}
          <Emblem size={72} className="mb-4 animate-float" />

          <div className="mb-2" aria-hidden="true">
            <div style={{ height: 1, width: 120, background: "linear-gradient(90deg, transparent, var(--gold), transparent)", margin: "0 auto" }} />
          </div>

          <h1 className="font-display mb-2" style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", color: "var(--gold-bright)", letterSpacing: "0.15em", lineHeight: 1 }}>
            ĀNVĪKṢIKĪ
          </h1>
          <p className="font-ui text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--muted)" }}>
            A Journal of Inquiry &amp; Civilizational Wisdom
          </p>

          <LotusDivider className="w-48 mb-8" />

          {featured ? (
            <div className="mb-8 max-w-xl">
              <div className="section-label mb-2">Featured Essay</div>
              <h2 className="font-display text-2xl md:text-3xl mb-2" style={{ color: "var(--parchment)" }}>{featured.title}</h2>
              {featured.excerpt && <p className="font-body text-sm mb-4" style={{ color: "var(--ink-faint)" }}>{featured.excerpt}</p>}
              <Link href={`/articles/${featured.slug}`} className="btn-sacred btn-gold">
                Read Essay <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="mb-8">
              <p className="font-body text-sm italic mb-6" style={{ color: "var(--ink-faint)" }}>
                The archive awakens — no essays published yet
              </p>
              <Link href="/submit" className="btn-sacred btn-gold">
                Submit Your Work <ArrowRight size={14} />
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link href="/browse" className="btn-sacred btn-ghost">Explore Journal</Link>
            <Link href="/community" className="btn-sacred btn-ghost">Join Community</Link>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" aria-hidden="true">
            <div style={{ width: 1, height: 32, background: "linear-gradient(180deg, var(--gold), transparent)" }} />
          </div>
        </div>
      </section>

      {/* ── Browse Domains ── */}
      <section className="container-anv py-16">
        <div className="text-center mb-10">
          <LotusDivider className="mb-4" />
          <div className="section-label mb-2">Explore Themes</div>
          <h2 className="font-display text-3xl md:text-4xl" style={{ color: "var(--gold-bright)" }}>Browse by Domain</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {DOMAINS.slice(0, 8).map(d => (
            <Link key={d.slug} href={`/domains/${d.slug}`} aria-label={`Browse ${d.label}`}>
              <div
                className="domain-card"
                style={{ aspectRatio: "3/4", background: `linear-gradient(180deg, ${d.color} 0%, #07040a 100%)` }}
              >
                {/* Inner glow */}
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%, ${d.accent}22 0%, transparent 60%)` }} aria-hidden="true" />
                {/* Gold top border accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${d.accent}, transparent)` }} aria-hidden="true" />
                {/* Icon */}
                <div className="absolute inset-x-0 top-8 flex justify-center">
                  <div style={{ fontSize: "2rem", filter: "drop-shadow(0 0 8px rgba(201,152,58,0.4))" }}>{d.icon}</div>
                </div>
                {/* Lotus at bottom */}
                <div className="absolute bottom-0 inset-x-0 p-3 text-center">
                  <LotusIcon size={12} className="mx-auto mb-1.5" style={{ color: "var(--gold)", opacity: 0.5 }} />
                  <div className="font-ui text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--gold-bright)" }}>{d.label}</div>
                </div>
                {/* Corner ornaments */}
                <div style={{ position: "absolute", top: 6, left: 6, width: 12, height: 12, borderTop: "1px solid var(--border-gold)", borderLeft: "1px solid var(--border-gold)" }} aria-hidden="true" />
                <div style={{ position: "absolute", top: 6, right: 6, width: 12, height: 12, borderTop: "1px solid var(--border-gold)", borderRight: "1px solid var(--border-gold)" }} aria-hidden="true" />
                <div style={{ position: "absolute", bottom: 6, left: 6, width: 12, height: 12, borderBottom: "1px solid var(--border-gold)", borderLeft: "1px solid var(--border-gold)" }} aria-hidden="true" />
                <div style={{ position: "absolute", bottom: 6, right: 6, width: 12, height: 12, borderBottom: "1px solid var(--border-gold)", borderRight: "1px solid var(--border-gold)" }} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/browse" className="btn-sacred btn-ghost">View All Domains <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* ── Recent Essays ── */}
      <section className="py-16" style={{ background: "var(--surface)" }}>
        <div className="container-anv">
          <div className="text-center mb-10">
            <LotusDivider className="mb-4" />
            <div className="section-label mb-2">Browse Journal</div>
            <h2 className="font-display text-3xl" style={{ color: "var(--gold-bright)" }}>Latest Publications</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div style={{ width: 40, height: 40, border: "2px solid var(--border-gold)", borderTop: "2px solid var(--gold)", borderRadius: "50%", animation: "rotateSlow 0.8s linear infinite" }} role="status" aria-label="Loading" />
            </div>
          ) : recent.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.slice(0, 3).map(a => (
                <Link key={a.id} href={`/articles/${a.slug}`}>
                  <article className="card-sacred p-5 h-full flex flex-col cursor-pointer">
                    <div className="flex-1">
                      {a.categoryId && <div className="section-label mb-2">{a.categoryId}</div>}
                      <h3 className="font-display text-xl mb-2 leading-tight" style={{ color: "var(--parchment)" }}>{a.title}</h3>
                      {a.excerpt && <p className="font-body text-sm leading-relaxed" style={{ color: "var(--ink-faint)" }}>{a.excerpt}</p>}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="font-ui text-xs" style={{ color: "var(--muted)" }}>{a.authorName || "Editorial"}</span>
                      <ArrowRight size={14} style={{ color: "var(--gold)" }} />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No essays published yet"
              description="The archive is being prepared. Return soon to discover new works."
              action={<Link href="/submit" className="btn-sacred btn-gold">Submit Your Work <ArrowRight size={14} /></Link>}
            />
          )}
        </div>
      </section>

      {/* ── Feature panels ── */}
      <section className="container-anv py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: <Archive size={24} />, title: "Archive", desc: "Peer-reviewed research across disciplines and time.", href: "/archive", label: "Explore Archive" },
            { icon: <Feather size={24} />, title: "Submit Work", desc: "Share your research, essays, and translations with the world.", href: "/submit", label: "Submit Now" },
            { icon: <Users size={24} />, title: "Community", desc: "Join seekers and thinkers in meaningful discourse.", href: "/community", label: "Join Conversation" },
          ].map(p => (
            <div key={p.href} className="card-sacred p-6 flex flex-col gap-4">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(201,152,58,0.1)", border: "1px solid var(--border-gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                {p.icon}
              </div>
              <div>
                <h3 className="font-display text-xl mb-1" style={{ color: "var(--parchment)" }}>{p.title}</h3>
                <p className="font-body text-sm" style={{ color: "var(--ink-faint)" }}>{p.desc}</p>
              </div>
              <Link href={p.href} className="btn-sacred btn-ghost self-start mt-auto text-xs">
                {p.label} <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, var(--surface) 0%, #120818 100%)" }}>
        <div className="container-anv max-w-xl text-center">
          <LotusDivider className="mb-6" />
          <div className="section-label mb-3">Stay Connected</div>
          <h2 className="font-display text-3xl mb-3" style={{ color: "var(--gold-bright)" }}>Receive the Archive</h2>
          <p className="font-body text-sm mb-6" style={{ color: "var(--ink-faint)" }}>Reflections, resources, and community updates delivered to your door.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const r = await fetch(`${base()}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(r.ok ? "ok" : "err");
    } catch { setStatus("err"); }
  };

  if (status === "ok") return (
    <div className="flex items-center justify-center gap-2 py-4" style={{ color: "var(--gold-bright)" }}>
      <LotusIcon size={18} style={{ color: "var(--gold)" }} />
      <span className="font-ui text-sm">You have joined the archive. Welcome.</span>
    </div>
  );

  return (
    <form onSubmit={submit} className="flex gap-3 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        className="input-sacred flex-1"
        required
        aria-label="Email address"
      />
      <button type="submit" className="btn-sacred btn-gold shrink-0" disabled={status === "loading"}>
        {status === "loading" ? "…" : "Join"}
      </button>
    </form>
  );
}

function useState2<T>(init: T) { return useState<T>(init); }
