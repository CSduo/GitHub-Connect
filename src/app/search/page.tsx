"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, FileText, BookOpen, Tag, X } from "lucide-react";

const FILTERS = ["All", "Essays", "Papers", "Domains"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults({ articles: [], papers: [], categories: [], query: q });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const filteredArticles = activeFilter === "All" || activeFilter === "Essays" ? results?.articles || [] : [];
  const filteredPapers = activeFilter === "All" || activeFilter === "Papers" ? results?.papers || [] : [];
  const filteredCategories = activeFilter === "All" || activeFilter === "Domains" ? results?.categories || [] : [];

  return (
    <div className="min-h-[100dvh] pb-24" style={{ background: "var(--bg)" }}>
      <div className="container-anv pt-6">
        <h1 className="font-display text-4xl md:text-6xl" style={{ color: "var(--ink)" }}>
          Search
        </h1>
        <p className="font-body italic mt-2" style={{ color: "var(--muted)" }}>
          Discover ideas across time and disciplines.
        </p>

        {/* Search Input */}
        <div className="mt-6 relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search essays, papers, domains, authors..."
            className="input-anv pl-12 pr-12 py-4 text-base w-full"
            style={{ fontSize: "16px" }}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults(null); }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X size={18} style={{ color: "var(--muted)" }} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-2 rounded-full font-ui text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: activeFilter === f ? "var(--gold)" : "var(--surface-soft)",
                color: activeFilter === f ? "#1a1108" : "var(--ink)",
                border: "1px solid var(--border)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading && (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {!loading && !results && (
          <div className="py-12">
            <h3 className="font-ui text-sm font-semibold tracking-wider uppercase mb-4" style={{ color: "var(--gold)" }}>
              Popular Discoveries
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Ethics", "Consciousness", "Statecraft", "Civilisation", "Memory", "Science", "Geopolitics", "Philosophy"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-4 py-2 rounded-full font-ui text-sm transition-all hover:bg-[var(--gold)] hover:text-[#1a1108]"
                  style={{ background: "var(--surface-soft)", color: "var(--ink)", border: "1px solid var(--border)" }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && results && (
          <div className="py-6 space-y-6">
            {filteredArticles.length === 0 && filteredPapers.length === 0 && filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="font-body" style={{ color: "var(--muted)" }}>
                  No results found for &ldquo;{results.query}&rdquo;
                </p>
              </div>
            )}

            {filteredArticles.length > 0 && (
              <div>
                <h3 className="font-ui text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "var(--gold)" }}>
                  Essays
                </h3>
                <div className="space-y-3">
                  {filteredArticles.map((a: any) => (
                    <Link
                      key={a.id}
                      href={`/articles/${a.slug}`}
                      className="card-anv p-4 flex gap-4 items-start hover:translate-y-[-2px] transition-all block"
                    >
                      <BookOpen size={20} className="mt-1 shrink-0" style={{ color: "var(--gold)" }} />
                      <div>
                        <h4 className="font-display text-lg" style={{ color: "var(--ink)" }}>{a.title}</h4>
                        {a.excerpt && (
                          <p className="font-body text-sm mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>{a.excerpt}</p>
                        )}
                        {a.category && (
                          <span className="font-ui text-xs mt-2 block" style={{ color: "var(--gold)" }}>{a.category.name}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredPapers.length > 0 && (
              <div>
                <h3 className="font-ui text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "var(--gold)" }}>
                  Papers
                </h3>
                <div className="space-y-3">
                  {filteredPapers.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/papers/${p.slug}`}
                      className="card-anv p-4 flex gap-4 items-start hover:translate-y-[-2px] transition-all block"
                    >
                      <FileText size={20} className="mt-1 shrink-0" style={{ color: "var(--peacock)" }} />
                      <div>
                        <h4 className="font-display text-lg" style={{ color: "var(--ink)" }}>{p.title}</h4>
                        {p.abstract && (
                          <p className="font-body text-sm mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>{p.abstract}</p>
                        )}
                        {p.peerReviewed && (
                          <span className="status-badge status-published text-[10px] mt-2 inline-block">Peer-Reviewed</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredCategories.length > 0 && (
              <div>
                <h3 className="font-ui text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "var(--gold)" }}>
                  Domains
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {filteredCategories.map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/categories/${c.slug}`}
                      className="card-anv p-4 text-center hover:translate-y-[-2px] transition-all block"
                    >
                      <Tag size={18} className="mx-auto mb-2" style={{ color: "var(--gold)" }} />
                      <span className="font-ui text-sm font-medium" style={{ color: "var(--ink)" }}>{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
