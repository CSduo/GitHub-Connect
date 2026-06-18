"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import { Emblem } from "@/components/brand/Emblem";
import { Wordmark } from "@/components/brand/Wordmark";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function BrandHeader() {
  const { user } = useAuth();

  return (
    <header className="relative z-20">
      {/* Mobile header */}
      <div className="show-mobile flex items-center justify-between px-4 py-3">
        <Link href="/search" className="w-10 h-10 flex items-center justify-center" aria-label="Search">
          <Search size={20} style={{ color: "var(--muted)" }} />
        </Link>
        <Link href="/" className="flex flex-col items-center">
          <Emblem size={42} />
          <Wordmark compact />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Desktop header */}
      <div className="hide-mobile container-anv">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3">
            <Emblem size={44} />
            <Wordmark />
          </Link>

          <nav className="flex items-center gap-8 font-ui text-sm">
            <Link href="/" className="transition-colors hover:text-[var(--gold)]" style={{ color: "var(--ink)" }}>Home</Link>
            <Link href="/papers" className="transition-colors hover:text-[var(--gold)]" style={{ color: "var(--ink)" }}>Papers</Link>
            <Link href="/archive" className="transition-colors hover:text-[var(--gold)]" style={{ color: "var(--ink)" }}>Archive</Link>
            <Link href="/about" className="transition-colors hover:text-[var(--gold)]" style={{ color: "var(--ink)" }}>About</Link>
            <Link href="/submit" className="transition-colors hover:text-[var(--gold)]" style={{ color: "var(--ink)" }}>Submit</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid var(--border)" }}
              aria-label="Search"
            >
              <Search size={18} style={{ color: "var(--muted)" }} />
            </Link>
            <ThemeToggle />
            <Link
              href={user ? "/account" : "/login"}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid var(--border)" }}
              aria-label={user ? "Account" : "Sign in"}
            >
              <User size={18} style={{ color: "var(--muted)" }} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
