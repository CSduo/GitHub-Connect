"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox, FileText, Calendar, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    fetch("/api/admin/submissions", { credentials: "include" })
      .then((r) => { if (r.status === 401) { router.push("/admin/login"); return null; } return r.json(); })
      .then((d) => { if (d) setSubmissions(d.submissions || []); })
      .finally(() => setLoading(false));
  }, [router]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ status, notes: statusNote }),
      });
      if (res.ok) {
        toast.success("Status updated");
        setSubmissions(submissions.map((s) => s.id === id ? { ...s, status } : s));
        setStatusNote("");
      }
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="min-h-[100dvh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-[100dvh]" style={{ background: "var(--bg)" }}>
      <div className="container-anv py-8">
        <h1 className="font-display text-2xl mb-6" style={{ color: "var(--ink)" }}>Submissions</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {submissions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="w-full card-anv p-4 text-left hover:translate-y-[-2px] transition-all"
                style={{ borderLeft: selected?.id === s.id ? "3px solid var(--gold)" : undefined }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-ui text-[10px] uppercase tracking-wider" style={{ color: "var(--gold)" }}>{s.type}</span>
                  <span className={`status-badge status-${s.status.toLowerCase().replace("_", "-")} text-[10px]`}>{s.status.replace("_", " ")}</span>
                </div>
                <h4 className="font-display text-sm mt-1" style={{ color: "var(--ink)" }}>{s.title}</h4>
                <p className="font-ui text-[10px] mt-1" style={{ color: "var(--muted)" }}>{s.submitterName} · {new Date(s.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
            {submissions.length === 0 && <p className="text-center py-8 font-body" style={{ color: "var(--muted)" }}>No submissions yet.</p>}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="card-anv p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl" style={{ color: "var(--ink)" }}>{selected.title}</h2>
                  <span className={`status-badge status-${selected.status.toLowerCase().replace("_", "-")}`}>{selected.status.replace("_", " ")}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div><span style={{ color: "var(--muted)" }}>Submitter:</span> <span style={{ color: "var(--ink)" }}>{selected.submitterName}</span></div>
                  <div><span style={{ color: "var(--muted)" }}>Email:</span> <span style={{ color: "var(--ink)" }}>{selected.submitterEmail}</span></div>
                  <div><span style={{ color: "var(--muted)" }}>Type:</span> <span style={{ color: "var(--ink)" }}>{selected.type}</span></div>
                  <div><span style={{ color: "var(--muted)" }}>Date:</span> <span style={{ color: "var(--ink)" }}>{new Date(selected.createdAt).toLocaleDateString()}</span></div>
                </div>

                <div className="mb-4 p-4 rounded-xl" style={{ background: "var(--surface-soft)" }}>
                  <h3 className="font-ui text-xs font-semibold uppercase mb-2" style={{ color: "var(--gold)" }}>Abstract</h3>
                  <p className="font-body text-sm" style={{ color: "var(--ink)" }}>{selected.abstract}</p>
                </div>

                {selected.notes && (
                  <div className="mb-4 p-4 rounded-xl" style={{ background: "var(--surface-soft)" }}>
                    <h3 className="font-ui text-xs font-semibold uppercase mb-2" style={{ color: "var(--gold)" }}>Notes to Editors</h3>
                    <p className="font-body text-sm" style={{ color: "var(--ink)" }}>{selected.notes}</p>
                  </div>
                )}

                {/* Files */}
                {selected.files && selected.files.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-ui text-xs font-semibold uppercase mb-2" style={{ color: "var(--gold)" }}>Files</h3>
                    <div className="space-y-2">
                      {selected.files.map((f: any) => (
                        <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--surface-soft)] transition-colors">
                          <FileText size={16} style={{ color: "var(--gold)" }} />
                          <span className="font-ui text-sm" style={{ color: "var(--ink)" }}>{f.originalName}</span>
                          <span className="font-ui text-xs" style={{ color: "var(--muted)" }}>({(f.sizeBytes / 1024 / 1024).toFixed(1)} MB)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <h3 className="font-ui text-xs font-semibold uppercase mb-3" style={{ color: "var(--gold)" }}>Update Status</h3>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note (optional)"
                    className="input-anv resize-none text-sm mb-3"
                    rows={2}
                  />
                  <div className="flex flex-wrap gap-2">
                    {["RECEIVED", "UNDER_REVIEW", "REVISION_REQUESTED", "ACCEPTED", "REJECTED", "PUBLISHED"].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selected.id, status)}
                        className="px-3 py-1.5 rounded-lg font-ui text-xs font-medium transition-all"
                        style={{
                          background: selected.status === status ? "var(--gold)" : "var(--surface-soft)",
                          color: selected.status === status ? "#1a1108" : "var(--muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {status.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-anv p-8 text-center">
                <Inbox size={48} className="mx-auto mb-4 opacity-30" style={{ color: "var(--muted)" }} />
                <p className="font-body" style={{ color: "var(--muted)" }}>Select a submission to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
