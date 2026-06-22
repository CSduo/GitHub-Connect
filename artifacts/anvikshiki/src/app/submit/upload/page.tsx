import { useState, useRef } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft, Upload, X, File, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
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
  const [images, setImages] = useState<File[]>([]);
  const [declared, setDeclared] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const mainRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const pickMain = (file: File) => {
    if (file.size > 50 * 1024 * 1024) { setUploadError("File must be under 50 MB"); return; }
    const ok = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain"].includes(file.type);
    if (!ok) { setUploadError("Please upload PDF, DOC, DOCX, or TXT"); return; }
    setMainFile(file);
    setUploadError("");
  };

  const addImages = (files: FileList) => {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/") && f.size < 10 * 1024 * 1024);
    setImages(prev => [...prev, ...valid].slice(0, 4));
  };

  const submit = async () => {
    if (!mainFile) { setUploadError("Please upload your manuscript file"); return; }
    if (!declared) { setUploadError("Please confirm the declaration"); return; }
    setUploadError("");
    setUploading(true);
    setUploadProgress(10);

    const detailsRaw = sessionStorage.getItem("anvikshiki_submit_details");
    const type = sessionStorage.getItem("anvikshiki_submit_type") || "essay";
    const details = detailsRaw ? JSON.parse(detailsRaw) : {};

    const fd = new FormData();
    fd.append("manuscript", mainFile);
    images.forEach((img, i) => fd.append(`image_${i}`, img));
    fd.append("submitterName", details.fullName || "");
    fd.append("submitterEmail", details.email || "");
    fd.append("title", details.title || "");
    fd.append("abstract", details.abstract || "");
    fd.append("notes", [details.notes, `Domain: ${details.domain}`, `Type: ${type}`, `Keywords: ${details.keywords}`, `Audience: ${details.audience}`].filter(Boolean).join("\n"));
    fd.append("type", type.toUpperCase().replace("-","_") === "ESSAY" ? "ESSAY" : type.toUpperCase().replace("-","_") === "REVIEW" ? "REVIEW" : type === "book-review" ? "COMMENTARY" : "PAPER");
    fd.append("consent", "true");

    try {
      const sim = setInterval(() => setUploadProgress(p => Math.min(p + 12, 85)), 400);
      const r = await fetch(`${base()}/api/submissions/upload`, { method: "POST", body: fd });
      clearInterval(sim);
      setUploadProgress(100);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Submission failed");
      sessionStorage.setItem("anvikshiki_submit_id", data.submission?.id || "");
      sessionStorage.removeItem("anvikshiki_submit_details");
      sessionStorage.removeItem("anvikshiki_submit_type");
      navigate("/submit/success");
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Please try again.");
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
          {/* Main upload */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manuscript upload */}
            <div className="card-sacred p-6">
              <div className="section-label mb-4">Upload Manuscript *</div>
              <div
                className={`dropzone ${dragging ? "active" : ""} ${mainFile ? "border-green-500" : ""}`}
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
                    <div>
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
                    <div>
                      <div className="font-ui text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>Drag &amp; Drop files here</div>
                      <div className="font-ui text-xs my-1" style={{ color: "var(--muted)" }}>— or —</div>
                    </div>
                    <span className="btn-sacred btn-ghost text-xs py-2 px-5">Choose Files</span>
                    <div className="font-ui text-[10px]" style={{ color: "var(--ink-faint)" }}>PDF, DOC, DOCX · Max 50 MB</div>
                  </div>
                )}
              </div>
            </div>

            {/* Supporting images */}
            <div className="card-sacred p-6">
              <div className="section-label mb-4">Supporting Images <span style={{ color: "var(--muted)", fontWeight: 400 }}>(Optional)</span></div>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    {images[i] ? (
                      <div className="relative" style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-gold)" }}>
                        <img src={URL.createObjectURL(images[i])} alt={`Supporting image ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} aria-label={`Remove image ${i + 1}`}>
                          <X size={10} style={{ color: "var(--lotus)" }} />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => imgRef.current?.click()} className="w-full flex items-center justify-center" style={{ aspectRatio: "1", borderRadius: 8, border: "1px dashed var(--border-gold)", background: "var(--surface-2)", cursor: "pointer" }} aria-label={`Add image ${i + 1}`}>
                        <span style={{ color: "var(--gold)", opacity: 0.5 }}>+</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <input ref={imgRef} type="file" accept="image/*" multiple className="sr-only" onChange={e => e.target.files && addImages(e.target.files)} aria-label="Choose images" />
              <p className="font-ui text-[10px] mt-2" style={{ color: "var(--ink-faint)" }}>Max 4 images · JPG, PNG, WEBP · 10 MB each</p>
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
                <div className="font-ui text-xs mb-2" style={{ color: "var(--gold-bright)" }}>Uploading… {uploadProgress}%</div>
                <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${uploadProgress}%`, background: "linear-gradient(90deg, var(--rose-bright), var(--gold))", borderRadius: 2, transition: "width 0.3s ease" }} />
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
              <Link href="/submit/details" className="btn-sacred btn-ghost text-xs"><ArrowLeft size={14} /> Back</Link>
              <button type="button" onClick={submit} disabled={uploading} className="btn-sacred btn-gold">
                {uploading ? `Uploading ${uploadProgress}%…` : "Submit for Review 🌸"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card-sacred p-5">
              <div className="section-label mb-3">Help</div>
              <ul className="space-y-3">
                {[{ t: "Accepted Formats", d: "PDF is preferred. DOC and DOCX are also accepted." }, { t: "File Size", d: "Main manuscript up to 50 MB. Images up to 10 MB each." }, { t: "What Happens Next", d: "Your submission enters a pending review queue. You'll receive an email from our editorial team." }].map(h => (
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
