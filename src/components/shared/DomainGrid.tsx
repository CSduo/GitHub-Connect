"use client";

import Link from "next/link";
import {
  BookOpen,
  Landmark,
  BrainCircuit,
  UsersRound,
  Atom,
  Globe,
  ScrollText,
  Archive,
} from "lucide-react";

const DEFAULT_DOMAINS = [
  { slug: "philosophy", name: "Philosophy", icon: "bookopen" },
  { slug: "history", name: "History", icon: "landmark" },
  { slug: "psychology", name: "Psychology", icon: "brain" },
  { slug: "sociology", name: "Sociology", icon: "users" },
  { slug: "science", name: "Science", icon: "atom" },
  { slug: "geopolitics", name: "Geopolitics", icon: "globe" },
  { slug: "papers", name: "Papers", icon: "scroll" },
  { slug: "archive", name: "Archive", icon: "archive" },
];

const iconMap: Record<string, React.ComponentType<any>> = {
  bookopen: BookOpen,
  landmark: Landmark,
  brain: BrainCircuit,
  users: UsersRound,
  atom: Atom,
  globe: Globe,
  scroll: ScrollText,
  archive: Archive,
};

interface DomainGridProps {
  categories?: any[];
}

export function DomainGrid({ categories = [] }: DomainGridProps) {
  const domains = DEFAULT_DOMAINS.map((d) => {
    const cat = categories.find((c) => c.slug === d.slug);
    return { ...d, ...cat };
  });

  return (
    <div
      className="grid grid-cols-4 rounded-[22px] overflow-hidden"
      style={{
        background: "color-mix(in srgb, var(--surface) 96%, transparent)",
        border: "1px solid var(--border)",
      }}
    >
      {domains.map((domain, i) => {
        const Icon = iconMap[domain.icon] || Archive;
        const isSpecial = domain.slug === "papers" || domain.slug === "archive";
        const href = isSpecial
          ? domain.slug === "papers"
            ? "/papers"
            : "/archive"
          : `/categories/${domain.slug}`;

        return (
          <Link
            key={domain.slug}
            href={href}
            className="flex flex-col items-center justify-center gap-2 py-5 px-2 transition-all duration-200 hover:bg-[var(--surface-soft)]"
            style={{
              borderRight: (i + 1) % 4 !== 0 ? "1px solid var(--border)" : undefined,
              borderBottom: i < 4 ? "1px solid var(--border)" : undefined,
            }}
          >
            <Icon size={24} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
            <span className="font-ui text-[11px] font-medium text-center" style={{ color: "var(--ink)" }}>
              {domain.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
