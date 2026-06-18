export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, ScrollText, Archive, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { Emblem } from "@/components/brand/Emblem";
import { NewsletterBlock } from "@/components/shared/NewsletterBlock";
import { DomainGrid } from "@/components/shared/DomainGrid";

async function getHomeData() {
  const [featuredArticle, latestPapers, categories] = await Promise.all([
    prisma.article.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      include: { category: true },
    }),
    prisma.paper.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: true },
    }),
    prisma.category.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return { featuredArticle, latestPapers, categories };
}

export default async function HomePage() {
  const { featuredArticle, latestPapers, categories } = await getHomeData();

  return (
    <div className="min-h-[100dvh]" style={{ background: "var(--bg)" }}>
      {/* Hero Section */}
      <section className="container-anv pt-4 pb-6">
        {featuredArticle ? (
          <FeaturedHero article={featuredArticle} />
        ) : (
          <EmptyHero />
        )}
      </section>

      {/* Browse by Domain */}
      <section className="container-anv py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-ui text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--gold)" }}>
            Browse by Domain
          </h2>
          <Link href="/search" className="font-ui text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: "var(--gold)" }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <DomainGrid categories={categories} />
      </section>

      {/* Papers Archive Preview */}
      <section className="container-anv py-6">
        <div className="card-anv p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="font-ui text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--gold)" }}>
                Papers Archive
              </span>
              <h3 className="font-display text-2xl md:text-3xl mt-2" style={{ color: "var(--ink)" }}>
                {latestPapers.length > 0 ? "Explore peer-reviewed research" : "Explore peer-reviewed research"}
              </h3>
              <p className="font-body mt-2" style={{ color: "var(--muted)" }}>
                {latestPapers.length > 0
                  ? "Curated papers across disciplines and time."
                  : "No published papers yet. New research will be added to the archive soon."}
              </p>
            </div>
            <Link href="/papers" className="btn-primary whitespace-nowrap">
              Explore Archive <ArrowRight size={16} />
            </Link>
          </div>

          {latestPapers.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {latestPapers.map((paper: any) => (
                <Link
                  key={paper.id}
                  href={`/papers/${paper.slug}`}
                  className="group p-4 rounded-xl transition-all duration-300 hover:translate-y-[-2px]"
                  style={{ background: "var(--surface-soft)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {paper.peerReviewed && (
                      <span className="status-badge status-published text-[10px]">Peer-Reviewed</span>
                    )}
                    <span className="font-ui text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      {paper.category?.name}
                    </span>
                  </div>
                  <h4 className="font-display text-lg leading-tight group-hover:text-[var(--gold)] transition-colors" style={{ color: "var(--ink)" }}>
                    {paper.title}
                  </h4>
                  {paper.year && (
                    <span className="font-ui text-xs mt-2 block" style={{ color: "var(--muted)" }}>
                      {paper.year}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-anv py-6 pb-24">
        <NewsletterBlock />
      </section>
    </div>
  );
}

function FeaturedHero({ article }: { article: any }) {
  return (
    <div className="card-anv overflow-hidden">
      <div className="relative min-h-[420px] md:min-h-[520px] flex flex-col justify-end p-6 md:p-10">
        {/* Background image or gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: article.heroImageUrl
              ? `url(${article.heroImageUrl})`
              : "none",
            backgroundColor: article.heroImageUrl ? undefined : "var(--surface-soft)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: article.heroImageUrl
              ? "linear-gradient(to top, rgba(7, 17, 21, 0.92) 0%, rgba(7, 17, 21, 0.4) 50%, rgba(7, 17, 21, 0.1) 100%)"
              : "linear-gradient(to top, var(--surface) 0%, transparent 100%)",
          }}
        />

        <div className="relative z-10">
          <span
            className="font-ui text-xs font-semibold tracking-[0.2em] uppercase mb-3 block"
            style={{ color: "var(--gold)" }}
          >
            Featured Essay
          </span>
          <h1
            className="font-display text-3xl md:text-5xl lg:text-6xl leading-[0.95] max-w-3xl"
            style={{ color: article.heroImageUrl ? "#f8ead2" : "var(--ink)" }}
          >
            {article.title}
          </h1>
          {article.subtitle && (
            <p
              className="font-body mt-3 text-base md:text-lg max-w-xl"
              style={{ color: article.heroImageUrl ? "rgba(248, 234, 210, 0.8)" : "var(--muted)" }}
            >
              {article.subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Link href={`/articles/${article.slug}`} className="btn-primary">
              Read Essay <ArrowRight size={16} />
            </Link>
            <Link href="/search" className="btn-secondary">
              <Search size={16} /> Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyHero() {
  return (
    <div className="card-anv overflow-hidden">
      <div
        className="relative min-h-[420px] md:min-h-[520px] flex flex-col items-center justify-center p-8 text-center"
        style={{
          background: "linear-gradient(135deg, var(--surface-soft) 0%, var(--surface) 100%)",
        }}
      >
        <Emblem size={64} className="mb-4 opacity-60" />
        <span
          className="font-ui text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ color: "var(--gold)" }}
        >
          Featured Essay
        </span>
        <h1
          className="font-display text-3xl md:text-5xl leading-[0.95] mb-3"
          style={{ color: "var(--ink)" }}
        >
          Your latest essay appears here
        </h1>
        <p className="font-body text-base italic mb-6" style={{ color: "var(--muted)" }}>
          Awaiting publication
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/submit" className="btn-primary">
            Submit Your Work <ArrowRight size={16} />
          </Link>
          <Link href="/search" className="btn-secondary">
            Explore Archive
          </Link>
        </div>
      </div>
    </div>
  );
}
