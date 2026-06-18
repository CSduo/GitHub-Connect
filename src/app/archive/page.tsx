export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FileText, BookOpen, Calendar } from "lucide-react";

export default async function ArchivePage() {
  const [articles, papers] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.paper.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
  ]);

  const allItems = [
    ...articles.map((a: any) => ({ ...a, itemType: "article" as const })),
    ...papers.map((p: any) => ({ ...p, itemType: "paper" as const })),
  ].sort((a: any, b: any) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

  return (
    <div className="min-h-[100dvh] pb-24" style={{ background: "var(--bg)" }}>
      <div className="container-anv pt-8 pb-12">
        <span className="font-ui text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>
          Library
        </span>
        <h1 className="font-display text-4xl md:text-6xl mt-2" style={{ color: "var(--ink)" }}>
          Archive
        </h1>
        <p className="font-body mt-3" style={{ color: "var(--muted)" }}>
          A chronological collection of all publications.
        </p>

        {allItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body italic" style={{ color: "var(--muted)" }}>
              The archive is being prepared. Publications will appear here soon.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {allItems.map((item) => (
              <Link
                key={`${item.itemType}-${item.id}`}
                href={`/${item.itemType}s/${item.slug}`}
                className="card-anv p-4 flex items-center gap-4 hover:translate-y-[-2px] transition-all block"
              >
                {item.itemType === "article" ? (
                  <BookOpen size={20} style={{ color: "var(--gold)" }} className="shrink-0" />
                ) : (
                  <FileText size={20} style={{ color: "var(--peacock)" }} className="shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-base truncate" style={{ color: "var(--ink)" }}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-ui text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      {item.category?.name}
                    </span>
                    <span className="font-ui text-[10px] flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <Calendar size={10} />
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                        : "Draft"}
                    </span>
                  </div>
                </div>
                <span
                  className="font-ui text-[10px] px-2 py-1 rounded-full shrink-0"
                  style={{
                    background: item.itemType === "article" ? "rgba(213,170,97,0.1)" : "rgba(21,116,109,0.1)",
                    color: item.itemType === "article" ? "var(--gold)" : "var(--peacock)",
                  }}
                >
                  {item.itemType}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
