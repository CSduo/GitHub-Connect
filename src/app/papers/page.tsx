"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, BookOpen, Calendar, Bookmark, Filter } from "lucide-react";

const PAPER_TYPES = ["All Types", "Research Paper", "Working Paper", "Review Essay", "Monograph"];
const STATUS_FILTERS = ["All Status", "Peer-Reviewed", "Working Paper", "Awaiting Publication"];

export default function PapersPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All Types");

  useEffect(() => {
    fetch("/api/papers")
      .then((r) => r.json())
      .then((data) => setPapers(data.papers || []))
      .catch(() => setPapers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[100dvh] pb-24" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, var(--bg) 0%, rgba(7,17,21,0.7) 100%)" }}
        />
        <div className="container-anv relative py-12 md:py-16">
          <span className="font-ui text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>
            Research Archive
          </span>
          <h1 className="font-display text-4xl md:text-6xl mt-2" style={{ color: "var(--ink)" }}>
            Papers
          </h1>
          <p className="font-body mt-3 max-w-lg" style={{ color: "var(--muted)" }}>
            Curated, peer-reviewed research across disciplines. Explore knowledge preserved for time, and conversations that shape tomorrow.
          </p>
        </div>
      </div>

      <div className="container-anv py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Filter size={16} style={{ color: "var(--muted)" }} />
          {PAPER_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1.5 rounded-full font-ui text-xs font-medium transition-all"
              style={{
                background: typeFilter === t ? "var(--gold)" : "var(--surface-soft)",
                color: typeFilter === t ? "#1a1108" : "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {!loading && papers.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card-anv p-5 flex gap-4 items-start opacity-50"
              >
                <div
                  className="w-24 h-16 rounded-lg shrink-0"
                  style={{ background: "var(--surface-soft)" }}
                />
                <div className="flex-1">
                  <span
                    className="status-badge text-[10px] mb-2 inline-block"
                    style={{
                      background: i === 1 ? "rgba(213,170,97,0.15)" : i === 2 ? "rgba(138,160,113,0.15)" : "rgba(150,150,150,0.15)",
                      color: i === 1 ? "var(--gold)" : i === 2 ? "var(--sage)" : "var(--muted)",
                    }}
                  >
                    {i === 1 ? "WORKING PAPER" : i === 2 ? "PEER-REVIEWED" : "AWAITING PUBLICATION"}
                  </span>
                  <h4 className="font-display text-lg" style={{ color: "var(--ink)" }}>
                    {i === 1 ? "Working paper will appear here." : i === 2 ? "Working paper will appear here." : "Awaiting first publication."}
                  </h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-ui text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <BookOpen size={12} /> Archive
                    </span>
                    <span className="font-ui text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <FileText size={12} /> PDF
                    </span>
                    <span className="font-ui text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                      <Calendar size={12} /> Year
                    </span>
                  </div>
                </div>
                <Bookmark size={18} style={{ color: "var(--border)" }} />
              </div>
            ))}
            <div className="text-center py-8">
              <p className="font-body" style={{ color: "var(--muted)" }}>
                No published papers yet. New research will be added to the archive soon.
              </p>
            </div>
          </div>
        )}

        {!loading && papers.length > 0 && (
          <div className="space-y-4">
            {papers.map((paper: any) => (
              <Link
                key={paper.id}
                href={`/papers/${paper.slug}`}
                className="card-anv p-5 flex gap-4 items-start hover:translate-y-[-2px] transition-all block"
              >
                <div
                  className="w-24 h-16 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background: "var(--surface-soft)" }}
                >
                  <FileText size={24} style={{ color: "var(--gold)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {paper.peerReviewed && (
                      <span className="status-badge status-published text-[10px]">Peer-Reviewed</span>
                    )}
                    <span className="font-ui text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      {paper.category?.name}
                    </span>
                  </div>
                  <h4 className="font-display text-lg truncate" style={{ color: "var(--ink)" }}>
                    {paper.title}
                  </h4>
                  {paper.abstract && (
                    <p className="font-body text-sm mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>
                      {paper.abstract}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    {paper.year && (
                      <span className="font-ui text-xs" style={{ color: "var(--muted)" }}>{paper.year}</span>
                    )}
                    {paper.paperType && (
                      <span className="font-ui text-xs capitalize" style={{ color: "var(--gold)" }}>
                        {paper.paperType.toLowerCase().replace("_", " ")}
                      </span>
                    )}
                  </div>
                </div>
                <Bookmark size={18} className="shrink-0" style={{ color: "var(--border)" }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
