import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, Menu, User, LogOut, BookMarked } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Browse",    href: "/browse" },
  { label: "Archive",   href: "/archive" },
  { label: "Submit",    href: "/submit" },
  { label: "Community", href: "/community" },
];

function LeafEmblem() {
  return (
    <div style={{
      width: 42, height: 42,
      border: "1.5px solid #2a1a0e",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 5 C16 5, 9 10, 9 18 C9 23, 12 26, 16 27 C20 26, 23 23, 23 18 C23 10, 16 5, 16 5 Z"
          stroke="#2a1a0e" strokeWidth="1.3" fill="none"/>
        <line x1="16" y1="27" x2="16" y2="29" stroke="#2a1a0e" strokeWidth="1.2"/>
        <path d="M16 14 C16 14, 12 18, 11 21" stroke="#2a1a0e" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
        <path d="M16 14 C16 14, 20 18, 21 21" stroke="#2a1a0e" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
      </svg>
    </div>
  );
}

export function SacredHeader() {
  const [loc, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    setMenuOpen(false);
    toast.success("You have been signed out");
    navigate("/");
  };

  return (
    <>
      <header
        className="relative z-50"
        style={{
          background: "#f5f0e8",
          borderBottom: "1px solid #2a1a0e",
        }}
      >
        {/* Double bottom border */}
        <div style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 1, background: "#2a1a0e", opacity: 0.25 }} aria-hidden="true" />

        <div className="container-anv">
          <div className="flex items-center justify-between" style={{ paddingTop: "0.55rem", paddingBottom: "0.55rem" }}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Ānvīkṣikī Home">
              <LeafEmblem />
              <div>
                <div className="font-display leading-none tracking-[0.14em]"
                  style={{ fontSize: "1.1rem", color: "#2a1a0e", fontWeight: 400 }}>
                  ĀNVĪKṢIKĪ
                </div>
                <div className="font-ui tracking-[0.25em] uppercase"
                  style={{ fontSize: "0.48rem", color: "#6b4e2a", marginTop: 2, letterSpacing: "0.22em" }}>
                  Journal &amp; Research Platform
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href} href={l.href}
                  className="px-3.5 py-1.5 rounded font-ui text-xs transition-all"
                  style={{
                    color: loc === l.href ? "#b97455" : "#2a1a0e",
                    background: loc === l.href ? "rgba(185,116,85,0.08)" : "transparent",
                    letterSpacing: "0.07em",
                    fontWeight: loc === l.href ? 500 : 400,
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 relative">
              <Link
                href="/search"
                className="w-9 h-9 rounded flex items-center justify-center transition-all"
                style={{ color: "#2a1a0e", opacity: 0.75 }}
                aria-label="Search"
              >
                <Search size={17} />
              </Link>

              {/* Auth (desktop) */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    type="button"
                    onClick={() => setAccountOpen(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded font-ui text-xs transition-all"
                    style={{ color: "#2a1a0e", border: "1px solid rgba(42,26,14,0.3)", letterSpacing: "0.06em" }}
                  >
                    <User size={13} />
                    {user.name?.split(" ")[0] || "Account"}
                  </button>
                  {accountOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 w-44 rounded-lg py-1 z-50"
                      style={{ background: "#faf7f0", border: "1px solid rgba(42,26,14,0.2)", boxShadow: "0 8px 24px rgba(42,26,14,0.12)" }}
                    >
                      <Link href="/account" className="flex items-center gap-2 px-3 py-2 font-ui text-xs transition-colors"
                        style={{ color: "#2a1a0e" }} onClick={() => setAccountOpen(false)}>
                        <User size={12} /> My Account
                      </Link>
                      <Link href="/saved" className="flex items-center gap-2 px-3 py-2 font-ui text-xs transition-colors"
                        style={{ color: "#2a1a0e" }} onClick={() => setAccountOpen(false)}>
                        <BookMarked size={12} /> Saved Items
                      </Link>
                      <div style={{ height: 1, background: "rgba(42,26,14,0.1)", margin: "0.25rem 0" }} />
                      <button type="button" onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 w-full font-ui text-xs text-left"
                        style={{ color: "#a93b5a" }}>
                        <LogOut size={12} /> Sign Out
                      </button>
                    </div>
                  )}
                  {accountOpen && <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded font-ui text-xs transition-all"
                  style={{ color: "#2a1a0e", border: "1px solid rgba(42,26,14,0.25)", letterSpacing: "0.06em" }}
                >
                  Sign in
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-9 h-9 rounded flex items-center justify-center"
                style={{ color: "#2a1a0e" }}
                onClick={() => setMenuOpen(v => !v)}
                aria-expanded={menuOpen}
                aria-label="Toggle menu"
                type="button"
              >
                {menuOpen ? <X size={18} /> : <Menu size={19} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(42,26,14,0.5)" }}
          onClick={() => setMenuOpen(false)}
          role="dialog" aria-modal="true" aria-label="Mobile navigation"
        >
          <div
            className="absolute top-0 right-0 bottom-0 w-72 flex flex-col"
            style={{ background: "#f5f0e8", borderLeft: "1px solid rgba(42,26,14,0.2)", padding: "4rem 1.75rem 2rem" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <LeafEmblem />
              <span className="font-display text-base tracking-[0.14em]" style={{ color: "#2a1a0e" }}>ĀNVĪKṢIKĪ</span>
            </div>

            <div className="space-y-1 flex-1">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href} href={l.href}
                  className="flex items-center py-3 px-2 rounded font-ui text-sm transition-all"
                  style={{
                    color: loc === l.href ? "#b97455" : "#2a1a0e",
                    background: loc === l.href ? "rgba(185,116,85,0.08)" : "transparent",
                    borderBottom: "1px solid rgba(42,26,14,0.08)",
                    letterSpacing: "0.06em",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <Link href="/search" className="flex items-center gap-2 w-full py-2.5 px-3 rounded font-ui text-xs"
                style={{ background: "rgba(42,26,14,0.06)", color: "#2a1a0e", border: "1px solid rgba(42,26,14,0.18)" }}
                onClick={() => setMenuOpen(false)}>
                <Search size={14} /> Search
              </Link>

              {user ? (
                <>
                  <Link href="/account" className="flex items-center gap-2 w-full py-2.5 px-3 rounded font-ui text-xs"
                    style={{ background: "rgba(42,26,14,0.06)", color: "#2a1a0e", border: "1px solid rgba(42,26,14,0.18)" }}
                    onClick={() => setMenuOpen(false)}>
                    <User size={14} /> {user.name?.split(" ")[0] || "My Account"}
                  </Link>
                  <button type="button" onClick={handleLogout} className="flex items-center gap-2 w-full py-2.5 px-3 rounded font-ui text-xs text-left"
                    style={{ background: "rgba(169,59,90,0.06)", color: "#a93b5a", border: "1px solid rgba(169,59,90,0.2)" }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex w-full items-center justify-center py-2.5 rounded font-ui text-xs"
                  style={{ background: "transparent", color: "#2a1a0e", border: "1px solid rgba(42,26,14,0.22)" }}
                  onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
