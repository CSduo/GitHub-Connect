import { useState, useRef } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { LotusDivider, LotusIcon } from "@/components/sacred/LotusIcon";

const base = () => import.meta.env.BASE_URL.replace(/\/$/, "");

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function SubmitUploadPage() {
  const [, navigate] = useLocation();
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [declared, setDeclared] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const mainRef = useRef<HTMLInputElement>(null);

  const pickMain = (file: File) => {
    if (file.size > 50 * 1024 * 1024) { setUploadError("File must be under 50 MB"); return; }
    const ok = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"].includes(file.type);
    if (!ok) { setUploadError("Please upload PDF, DOC, DOCX, or TXT"); return; }
    setMainFile(file);
    setUploadError("");
  };

  const submit = async () => {
    if (!mainFile) { setUploadError("Please upload your manuscript file"); return; }
    if (!declared) { setUploadError("Please confirm the declaration"); return; }
    setUploadError("");
    setUploading(true);
    setUploadProgress(20);

    const detailsRaw = sessionStorage.getItem("anvikshiki_submit_details");
    const typeRaw = sessionStorage.getItem("anvikshiki_submit_type") || "essay";
    const details = detailsRaw ? JSON.parse(detailsRaw) : {};

    // Map submission type to enum value
    const typeMap: Record<string, string> = {
      essay: "ESSAY", paper: "PAPER", review: "REVIEW",
      commentary: "COMMENTARY", "book-review": "COMMENTARY",
    };
    const type = typeMap[typeRaw.toLowerCase()] || "ESSAY";

    // Build note about the file
    const fileNote = [
      `File: ${mainFile.name} (${formatSize(mainFile.size)})`,
      `Domain: ${details.domain || ""}`,
      `Type: ${typeRaw}`,
      details.keywords ? `Keywords: ${details.keywords}` : "",
      details.audience ? `Audience: ${details.audience}` : "",
      details.notes ? `Notes: ${details.notes}` : "",
    ].filter(Boolean).join("\n");

    const payload = {
      submitterName: details.fullName || details.name || "",
      submitterEmail: details.email || "",
      title: details.title || "",
      abstract: details.abstract || "See attached manuscript.",
      notes: fileNote,
      type,
      consent: true,
    };

    if (!payload.submitterName || !payload.submitterEmail || !payload.title) {
      setUploadError("Submission details are missing. Please go back and fill in Step 2.");
      setUploading(false);
      setUploadProgress(0);
      return;
    }

    try {
      const sim = setInterval(() => setUploadProgress(p => Math.min(p + 15, 85)), 350);
      const r = await fetch(`${base()}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      clearInterval(sim);
      setUploadProgress(100);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Submission failed");
      sessionStorage.setItem("anvikshiki_submit_id", data.submission?.id || "");
      sessionStorage.removeItem("anvikshiki_submit_details");
      sessionStorage.removeItem("anvikshiki_submit_type");
      navigate("/submit/success");
    } catch (err: any) {
      setUploadError(err.message || "Submission failed. Please try again.");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
        <div className="absolute inset-0" aria-hidden="true">
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0518 0%, #08050f 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(180deg, transparent, var(--bg))" }} />
        </div>
        <div className="container-anv relative z-10 flex flex-col items-center text-center py-12">
          <Link href="/submit/details" className="flex items-center gap-1.5 mb-5 font-ui text-xs hover:opacity-70 transition-opacity" style={{ color: "var(--ink-faint)" }}>
            <ArrowLeft size={12} /> Back to Details
          </Link>
          <div className="section-label mb-2">Step 3 of 3</div>
          <h1 className="font-display" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--gold-bright)", letterSpacing: "0.08em" }}>Upload &amp; Final Review</h1>
        </div>
      </div>

      <div className="container-anv py-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File upload UI */}
            <div className="card-sacred p-6">
              <div className="section-label mb-4">Attach Manuscript *</div>
              <div
                className={`dropzone ${dragging ? "active" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickMain(f); }}
                onClick={() => mainRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload manuscript file"
                onKeyDown={e => e.key === "Enter" && mainRef.current?.click()}
              >
                <input ref={mainRef} type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={e => e.target.files?.[0] && pickMain(e.target.files[0])} aria-label="Choose file" />
                {mainFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle size={32} style={{ color: "#4ade80" }} />
                    <div className="text-center">
                      <div className="font-ui text-sm font-semibold" style={{ color: "var(--gold-bright)" }}>{mainFile.name}</div>
                      <div className="font-ui text-xs" style={{ color: "var(--muted)" }}>{formatSize(mainFile.size)}</div>
                    </div>
                    <button type="button" onClick={e => { e.stopPropagation(); setMainFile(null); }} className="flex items-center gap-1 font-ui text-xs" style={{ color: "var(--lotus)" }}>
                      <X size={12} /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <LotusIcon size={40} style={{ color: "var(--gold)", opacity: 0.5 }} />
                    <div className="text-center">
                      <div className="font-ui text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>Drag &amp; Drop your manuscript here</div>
                      <div className="font-ui text-xs my-1" style={{ color: "var(--muted)" }}>— or —</div>
                    </div>
                    <span className="btn-sacred btn-ghost text-xs py-2 px-5">Choose File</span>
                    <div className="font-ui text-[10px]" style={{ color: "var(--ink-faint)" }}>PDF, DOC, DOCX · Max 50 MB</div>
                  </div>
                )}
              </div>

              {/* Note about file delivery */}
              <div className="flex items-start gap-2 mt-4 p-3 rounded-lg" style={{ background: "rgba(201,152,58,0.08)", border: "1px solid rgba(201,152,58,0.2)" }}>
                <Info size={14} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }} />
                <p className="font-ui text-[11px]" style={{ color: "var(--ink-faint)" }}>
                  Your manuscript details will be recorded in our system. Our editorial team will contact you at your registered email to receive the full file securely.
                </p>
              </div>
            </div>

            {/* Declaration */}
            <div className="card-sacred p-6">
              <div className="section-label mb-4">Declaration</div>
              <label className="flex gap-3 cursor-pointer" htmlFor="declare">
                <div
                  id="declare"
                  role="checkbox"
                  aria-checked={declared}
                  tabIndex={0}
                  onClick={() => setDeclared(v => !v)}
                  onKeyDown={e => e.key === " " && setDeclared(v => !v)}
                  style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 4, border: `1px solid ${declared ? "var(--gold)" : "var(--border-gold)"}`, background: declared ? "var(--gold)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", marginTop: 2 }}
                >
                  {declared && <CheckCircle size={12} style={{ color: "#07040a" }} />}
                </div>
                <span className="font-body text-sm" style={{ color: "var(--ink-soft)" }}>
                  I confirm that this work is my original creation, does not infringe on any copyright, and I grant Ānvīkṣikī the right to publish and archive it upon editorial approval.
                </span>
              </label>
            </div>

            {/* Upload progress */}
            {uploading && (
              <div className="card-sacred p-4">
                <div className="font-ui text-xs mb-2" style={{ color: "var(--gold-bright)" }}>Submitting… {uploadProgress}%</div>
                <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${uploadProgress}%`, background: "linear-gradient(90deg, var(--rose-bright), var(--gold))", borderRadius: 2, transition: "width 0.3s ease" }} aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100} role="progressbar" />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="flex items-start gap-2 p-4 rounded-lg" style={{ background: "rgba(139,26,74,0.12)", border: "1px solid var(--border-rose)" }} role="alert">
                <AlertCircle size={16} style={{ color: "var(--lotus)", flexShrink: 0, marginTop: 2 }} />
                <p className="font-ui text-sm" style={{ color: "var(--lotus)" }}>{uploadError}</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <Link href="/submit/details" className="btn-sacred btn-ghost text-xs inline-flex items-center gap-1"><ArrowLeft size={14} /> Back</Link>
              <button type="button" onClick={submit} disabled={uploading} className="btn-sacred btn-gold">
                {uploading ? `Submitting ${uploadProgress}%…` : "Submit for Review"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card-sacred p-5">
              <div className="section-label mb-3">Help</div>
              <ul className="space-y-3">
                {[
                  { t: "Accepted Formats", d: "PDF is preferred. DOC and DOCX are also accepted." },
                  { t: "File Size", d: "Main manuscript up to 50 MB." },
                  { t: "What Happens Next", d: "Your submission enters a review queue. Our editorial team will contact you to collect the manuscript and begin the review process." },
                ].map(h => (
                  <li key={h.t} className="text-xs">
                    <div className="font-ui font-semibold mb-0.5" style={{ color: "var(--gold-bright)" }}>{h.t}</div>
                    <div className="font-body" style={{ color: "var(--ink-faint)" }}>{h.d}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-sacred p-5">
              <div className="section-label mb-3">Privacy</div>
              <div className="flex justify-center py-4">
                <LotusIcon size={40} style={{ color: "var(--gold)", opacity: 0.3 }} className="animate-float" />
              </div>
              <p className="font-body text-xs text-center" style={{ color: "var(--ink-faint)" }}>Your submission is confidential and will not be published without your explicit consent and editorial approval.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
