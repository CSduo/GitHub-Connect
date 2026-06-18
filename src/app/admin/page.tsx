"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Scroll,
  Inbox,
  Mail,
  Plus,
  TrendingUp,
  LogOut,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin auth
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.admin) {
          setAdmin(data.admin);
          // Fetch stats
          fetch("/api/admin/stats", { credentials: "include" })
            .then((r) => r.json())
            .then((s) => setStats(s));
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    toast.success("Signed out");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  const statCards = [
    { label: "Articles", value: stats?.articles?.total || 0, published: stats?.articles?.published || 0, icon: FileText, href: "/admin/articles", color: "var(--gold)" },
    { label: "Papers", value: stats?.papers?.total || 0, published: stats?.papers?.published || 0, icon: Scroll, href: "/admin/papers", color: "var(--peacock)" },
    { label: "Submissions", value: stats?.submissions?.new || 0, published: stats?.submissions?.total || 0, icon: Inbox, href: "/admin/submissions", color: "var(--rose)" },
    { label: "Subscribers", value: stats?.newsletter?.subscribers || 0, published: 0, icon: Mail, href: "/admin/newsletter", color: "var(--sage)" },
  ];

  return (
    <div className="min-h-[100dvh] flex" style={{ background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 hidden md:flex flex-col"
        style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
      >
        <div className="p-6">
          <span className="font-display text-xl" style={{ color: "var(--ink)" }}>Anvikshiki</span>
          <p className="font-ui text-xs mt-1" style={{ color: "var(--muted)" }}>Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-ui text-sm font-medium" style={{ background: "var(--gold)", color: "#1a1108" }}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/articles" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-ui text-sm transition-colors" style={{ color: "var(--ink)" }}>
            <FileText size={18} /> Articles
          </Link>
          <Link href="/admin/papers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-ui text-sm transition-colors" style={{ color: "var(--ink)" }}>
            <Scroll size={18} /> Papers
          </Link>
          <Link href="/admin/submissions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-ui text-sm transition-colors" style={{ color: "var(--ink)" }}>
            <Inbox size={18} /> Submissions
          </Link>
          <Link href="/admin/newsletter" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-ui text-sm transition-colors" style={{ color: "var(--ink)" }}>
            <Mail size={18} /> Newsletter
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-ui text-sm transition-colors" style={{ color: "var(--ink)" }}>
            <Settings size={18} /> Settings
          </Link>
        </nav>

        <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <span className="font-ui text-xs" style={{ color: "var(--muted)" }}>{admin.email}</span>
            <button onClick={handleLogout} style={{ color: "var(--muted)" }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <h1 className="font-display text-2xl" style={{ color: "var(--ink)" }}>Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {statCards.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="card-anv p-5 hover:translate-y-[-2px] transition-all block"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={20} style={{ color: stat.color }} />
                {stat.published > 0 && (
                  <span className="font-ui text-[10px]" style={{ color: "var(--sage)" }}>
                    {stat.published} published
                  </span>
                )}
              </div>
              <p className="font-display text-3xl" style={{ color: "var(--ink)" }}>{stat.value}</p>
              <p className="font-ui text-xs mt-1" style={{ color: "var(--muted)" }}>{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="font-ui text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "var(--gold)" }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/admin/articles/new" className="card-anv p-4 text-center hover:translate-y-[-2px] transition-all block">
              <Plus size={20} className="mx-auto mb-2" style={{ color: "var(--gold)" }} />
              <span className="font-ui text-xs font-medium" style={{ color: "var(--ink)" }}>New Article</span>
            </Link>
            <Link href="/admin/papers/new" className="card-anv p-4 text-center hover:translate-y-[-2px] transition-all block">
              <Plus size={20} className="mx-auto mb-2" style={{ color: "var(--peacock)" }} />
              <span className="font-ui text-xs font-medium" style={{ color: "var(--ink)" }}>New Paper</span>
            </Link>
            <Link href="/admin/submissions" className="card-anv p-4 text-center hover:translate-y-[-2px] transition-all block">
              <Inbox size={20} className="mx-auto mb-2" style={{ color: "var(--rose)" }} />
              <span className="font-ui text-xs font-medium" style={{ color: "var(--ink)" }}>Review</span>
            </Link>
            <Link href="/admin/newsletter" className="card-anv p-4 text-center hover:translate-y-[-2px] transition-all block">
              <Mail size={20} className="mx-auto mb-2" style={{ color: "var(--sage)" }} />
              <span className="font-ui text-xs font-medium" style={{ color: "var(--ink)" }}>Send</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
