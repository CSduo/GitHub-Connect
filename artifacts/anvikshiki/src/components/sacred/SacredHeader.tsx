import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, Menu, Moon, Globe } from "lucide-react";
import { Emblem } from "@/components/brand/Emblem";
import { LotusIcon } from "./LotusIcon";

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Browse",    href: "/browse" },
  { label: "Archive",   href: "/archive" },
  { label: "Submit",    href: "/submit" },
  { label: "Community", href: "/community" },
];

export function SacredHeader() {
  const [loc] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <>
      <header
        className="relative z-50"
        style={{
          background: "linear-gradient(180deg, rgba(7,4,10,0.97) 0%, rgba(7,4,10,0.92) 100%)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Gold line top */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} aria-hidden="true" />

        <div className="container-anv">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Ānvīkṣikī Home">
              <Emblem size={44} />
              <div>
                <div className="font-display text-xl leading-none tracking-[0.12em]" style={{ color: "var(--gold-bright)" }}>ĀNVĪKṢIKĪ</div>
                <div className="font-ui text-[8px] tracking-[0.3em] uppercase" style={{ color: "var(--muted)" }}>Journal & Research Platform</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 rounded-lg font-ui text-sm transition-all"
                  style={{
                    color: loc === l.href ? "var(--gold-bright)" : "var(--ink-faint)",
                    background: loc === l.href ? "rgba(201,152,58,0.1)" : "transparent",
                    letterSpacing: "0.06em",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <Link
                href="/search"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-[rgba(201,152,58,0.1)]"
                aria-label="Search"
              >
                <Search size={16} style={{ color: "var(--ink-faint)" }} />
              </Link>

              {/* Google login placeholder */}
              <button
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-ui text-xs transition-all hover:bg-[rgba(201,152,58,0.08)]"
                style={{ color: "var(--muted)", border: "1px solid var(--border)", letterSpacing: "0.06em" }}
                title="Google login coming soon"
                onClick={() => alert("Google login will be available soon.")}
                type="button"
              >
                <Globe size={13} />
                Sign in
              </button>

              {/* Language placeholder */}
              <button
                className="hidden lg:flex w-9 h-9 rounded-lg items-center justify-center transition-all hover:bg-[rgba(201,152,58,0.08)]"
                style={{ color: "var(--ink-faint)" }}
                title="Language toggle coming soon"
                type="button"
              >
                <span className="font-ui text-[9px] font-bold">EN</span>
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ color: "var(--ink-faint)" }}
                onClick={() => setMenuOpen(v => !v)}
                aria-expanded={menuOpen}
                aria-label="Toggle menu"
                type="button"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Gold line bottom */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)" }} aria-hidden="true" />
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(4,2,6,0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="absolute top-0 left-0 bottom-0 w-72 flex flex-col"
            style={{ background: "var(--surface)", borderRight: "1px solid var(--border-gold)", padding: "5rem 1.5rem 2rem" }}
            onClick={e => e.stopPropagation()}
          >
            <LotusIcon size={32} className="mb-6 text-gold" style={{ color: "var(--gold)" }} />
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="py-3 font-display text-xl border-b"
                style={{ color: loc === l.href ? "var(--gold-bright)" : "var(--ink-soft)", borderColor: "var(--border)" }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <button
              className="mt-6 py-2 rounded-lg font-ui text-sm"
              style={{ background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--border)" }}
              onClick={() => { alert("Google login will be available soon."); setMenuOpen(false); }}
              type="button"
            >
              Sign in (coming soon)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
