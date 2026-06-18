"use client";

import { Home, Search, FileText, Feather, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/papers", label: "Papers", icon: FileText },
  { href: "/submit", label: "Submit", icon: Feather },
  { href: "/about", label: "About", icon: Info },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-4 right-4 bottom-4 z-50 h-[66px] rounded-[22px] show-mobile"
      style={{
        background: "color-mix(in srgb, var(--surface) 92%, transparent)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div className="grid grid-cols-5 h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 transition-all duration-200"
              style={{
                color: isActive ? "var(--gold)" : "var(--muted)",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-ui font-medium">{item.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-2 w-1 h-1 rounded-full"
                  style={{ background: "var(--gold)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
