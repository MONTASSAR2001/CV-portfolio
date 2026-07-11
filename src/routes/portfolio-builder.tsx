import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, FolderOpen, LayoutTemplate, Bot, BarChart2,
  Globe, Settings, Diamond, ChevronRight, ChevronLeft, Check,
  Upload, Bell, HelpCircle, Lock, Sparkles, FileText, ExternalLink
} from "lucide-react";

export const Route = createFileRoute("/portfolio-builder")({
  component: PortfolioBuilderPage,
});

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "portfolios", label: "Portfolios", icon: FolderOpen, href: "#" },
  { id: "templates", label: "Templates", icon: LayoutTemplate, href: "#" },
  { id: "ai", label: "AI Assistant", icon: Bot, href: "#" },
  { id: "analytics", label: "Analytics", icon: BarChart2, href: "#" },
  { id: "domains", label: "Domains", icon: Globe, href: "#" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

const TEMPLATES = [
  {
    id: "vogue",
    label: "Vogue Fashion",
    tag: "Editorial, Chic",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "architect",
    label: "Architecture Firm",
    tag: "Minimalist, structural",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "biotech",
    label: "Biotech & Research",
    tag: "Data-driven, scientific",
    img: "https://images.unsplash.com/photo-1532187863486-abf9db5c2b1e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "lumina",
    label: "Lumina UX Study",
    tag: "Story-driven, stats",
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sterling",
    label: "Sterling Developer",
    tag: "Terminal aesthetic",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
  },
];

/* ─── Sidebar ─────────────────────────────────────────────── */
function Sidebar({ active }: { active: string }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-white/5 bg-black/40 py-5 backdrop-blur-2xl">
      <div>
        <div className="mb-6 flex items-center gap-2 px-4">
          <span className="text-base font-bold text-white">✨ AI Portfolio</span>
          <span className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow shadow-violet-900/50">
            Pro
          </span>
        </div>
        <nav className="space-y-0.5 px-2">
          {NAV.map(({ id, label, icon: Icon, href }) => {
            const isActive = id === active;
            return (
              <Link
                key={id}
                to={href as "/"}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border border-violet-500/30 bg-violet-500/10 text-violet-300 shadow-inner shadow-violet-900/20"
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade card */}
      <div className="mx-3 rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-900/30 to-fuchsia-950/40 p-4 shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:-translate-y-1">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow shadow-violet-900/50">
          <Diamond size={15} className="text-white" />
        </div>
        <p className="text-xs font-bold text-white mb-1">Upgrade to Pro</p>
        <p className="text-[10px] leading-relaxed text-slate-400 mb-3">
          Deploy to Vercel, custom domains, analytics &amp; unlimited portfolios.
        </p>
        <button className="flex w-full items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-[1.02]">
          Upgrade Now <ChevronRight size={12} />
        </button>
      </div>
    </aside>
  );
}

/* ─── Header ─────────────────────────────────────────────── */
function TopHeader() {
  return (
    <header className="flex items-center justify-end gap-3 border-b border-white/5 bg-black/20 px-6 py-3 backdrop-blur-xl">
      <button className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 transition-all duration-200 hover:bg-violet-500/20 hover:border-violet-400/50">
        <Diamond size={12} /> Upgrade to Pro
      </button>
      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-slate-300">
        <HelpCircle size={16} />
      </button>
      <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-slate-300">
        <Bell size={16} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
      </button>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-bold text-white shadow shadow-violet-900/50">
        AB
      </div>
    </header>
  );
}

/* ─── Step badge ─────────────────────────────────────────── */
function StepBadge({ n, locked = false }: { n: number; locked?: boolean }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
      locked
        ? "bg-white/5 text-slate-500 border border-white/10"
        : "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]"
    }`}>
      {locked ? <Lock size={12} /> : n}
    </span>
  );
}

/* ─── Step 1: Upload ─────────────────────────────────────── */
function StepUpload({ file, onFile }: { file: File | null; onFile: (f: File) => void }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative z-10 mb-4 flex items-center gap-3">
        <StepBadge n={1} />
        <div>
          <p className="text-sm font-bold text-white">Upload Your CV</p>
          <p className="text-[11px] text-slate-500">We'll extract your info automatically</p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-5">
        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-all duration-300 hover:-translate-y-1 ${
            dragging
              ? "border-violet-400 bg-violet-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              : "border-violet-500/50 bg-white/[0.03] hover:border-violet-400 hover:bg-violet-500/5 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          }`}
        >
          {file ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                <FileText size={24} />
              </div>
              <p className="text-xs font-semibold text-violet-300">{file.name}</p>
              <p className="text-[10px] text-slate-500">File ready ✓</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400 animate-pulse">
                <Upload size={22} />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-300">Drag &amp; drop your CV here</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Supports PDF, DOCX</p>
              </div>
            </>
          )}
          <label className="cursor-pointer rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-105">
            Choose File
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); }}
            />
          </label>
        </div>

        {/* Tips */}
        <div className="flex flex-col justify-center gap-4">
          <div>
            <p className="mb-2 text-xs font-bold text-slate-300">Tips for best results</p>
            <ul className="space-y-2">
              {[
                "Use a structured, single-column CV",
                "Ensure all dates & roles are clearly listed",
                "Include a summary or objective section",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Check size={10} />
                  </span>
                  <span className="text-[11px] text-slate-400">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3">
            {["PDF", "DOCX"].map((ext) => (
              <div
                key={ext}
                className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/5 shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:-translate-y-0.5"
              >
                <FileText size={20} className="text-violet-400" />
                <span className="mt-1 text-[9px] font-bold text-violet-300">{ext}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Templates ──────────────────────────────────── */
function StepTemplates({ selected, setSelected }: { selected: string; setSelected: (s: string) => void }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StepBadge n={2} />
          <div>
            <p className="text-sm font-bold text-white">Choose a Template</p>
            <p className="text-[11px] text-slate-500">Select the style that fits your industry</p>
          </div>
        </div>
        <button className="flex items-center gap-0.5 text-[11px] font-medium text-violet-400 transition hover:text-violet-300">
          View all templates <ChevronRight size={13} />
        </button>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <button className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 backdrop-blur transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-white">
          <ChevronLeft size={14} />
        </button>

        <div className="flex flex-1 gap-3 overflow-hidden">
          {TEMPLATES.map((t) => {
            const isSel = t.id === selected;
            return (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`relative flex-1 overflow-hidden rounded-xl border p-0 transition-all duration-500 cursor-pointer ${
                  isSel
                    ? "border-violet-500 ring-2 ring-violet-500 ring-offset-2 ring-offset-black shadow-[0_20px_40px_-15px_rgba(139,92,246,0.7)] -translate-y-2 scale-[1.03]"
                    : "border-white/10 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)]"
                }`}
              >
                {/* Embedded Link for Previewing the actual template route */}
                <Link
                  to={`/templates/${t.id}`}
                  target="_blank"
                  className="absolute inset-0 z-30"
                  title={`Preview ${t.label}`}
                  onClick={(e) => {
                    // Prevent setting selection if they click the external link icon specifically
                    // Let the link navigation happen natively
                  }}
                />
                
                {isSel && (
                  <span className="absolute right-1.5 top-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_15px_rgba(168,85,247,0.9)] text-white">
                    <Check size={11} />
                  </span>
                )}

                <div className="absolute right-1.5 bottom-8 z-40">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-violet-500/80">
                    <ExternalLink size={12} />
                  </span>
                </div>

                <div className="relative h-28 w-full overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.label}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {isSel && (
                    <div className="absolute inset-0 bg-violet-500/20 mix-blend-overlay" />
                  )}
                  <span className="absolute bottom-2 left-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] text-slate-200 backdrop-blur-md">
                    {t.tag}
                  </span>
                </div>

                <div className={`px-2 py-1.5 transition-colors duration-300 relative z-10 ${isSel ? "bg-gradient-to-r from-violet-900/60 to-fuchsia-900/60" : "bg-black/60 backdrop-blur-sm"}`}>
                  <p className={`text-left text-[10px] font-bold transition-colors ${isSel ? "text-white" : "text-slate-300"}`}>
                    {t.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 backdrop-blur transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-white">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Generate ───────────────────────────────────── */
function StepGenerate({ onGenerate, loading }: { onGenerate: () => void; loading: boolean }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StepBadge n={3} />
          <div>
            <p className="text-sm font-bold text-white">Generate AI Portfolio</p>
            <p className="text-[11px] text-slate-500">
              Our AI will craft a stunning portfolio from your CV in seconds
            </p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="group/btn relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0" />
          <Sparkles size={16} className="relative z-10 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110" />
          <span className="relative z-10">{loading ? "Generating…" : "✨ Generate Portfolio"}</span>
        </button>
      </div>

      {loading && (
        <div className="relative z-10 mt-5 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
          <div className="mb-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-violet-400 animate-ping" />
              AI is crafting your portfolio…
            </span>
            <span className="font-bold text-violet-300">Running</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 animate-pulse bg-[length:200%_100%] shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              style={{ width: "65%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step 4: Publish (locked) ───────────────────────────── */
function StepPublish() {
  return (
    <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 opacity-70 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:opacity-100 hover:border-white/10 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StepBadge n={4} locked />
          <div>
            <p className="text-sm font-bold text-slate-400 transition-colors group-hover:text-white">Publish &amp; Deploy</p>
            <p className="text-[11px] text-slate-500">Deploy your portfolio live with one click</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-slate-600 transition-colors group-hover:text-slate-400" />
          <div className="flex items-center gap-1.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-1.5 backdrop-blur transition-all group-hover:border-yellow-500/40 group-hover:bg-yellow-500/10">
            <Diamond size={12} className="text-yellow-500/80 group-hover:text-yellow-400" />
            <span className="text-[11px] font-semibold text-yellow-600/80 group-hover:text-yellow-400">
              💎 Pro feature: Pay to deploy to Vercel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page root ──────────────────────────────────────────── */
function PortfolioBuilderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("vogue");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3500);
  };

  return (
    <div className="relative flex h-screen overflow-hidden font-sans bg-black">
      {/* ── Rich radial background ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050508] to-black" />

      {/* ── Ambient glow orbs ── */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-30 blur-[150px] mix-blend-screen"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 60%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[150px] mix-blend-screen"
        style={{ background: "radial-gradient(circle, #4f46e5, transparent 60%)" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-[120px] mix-blend-screen"
        style={{ background: "radial-gradient(circle, #c026d3, transparent 60%)" }}
      />

      {/* ── Layout ── */}
      <Sidebar active="dashboard" />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <TopHeader />

        <main className="flex-1 overflow-y-auto px-8 py-6 relative z-10">
          {/* Page title row */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">✨ Portfolio Builder</h1>
              <p className="mt-1.5 max-w-lg text-sm text-slate-400">
                Upload your CV, choose a template, and let AI craft a stunning portfolio for you.
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <FolderOpen size={16} className="text-violet-400" /> My Portfolios
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <StepUpload file={file} onFile={setFile} />
            <StepTemplates selected={selectedTemplate} setSelected={setSelectedTemplate} />
            <StepGenerate onGenerate={handleGenerate} loading={generating} />
            <StepPublish />
          </div>
        </main>
      </div>
    </div>
  );
}

