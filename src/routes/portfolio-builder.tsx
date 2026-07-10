import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, FolderOpen, LayoutTemplate, Bot, BarChart2,
  Globe, Settings, Diamond, ChevronRight, ChevronLeft, Check,
  Upload, Bell, HelpCircle, Lock, Sparkles, FileText,
} from "lucide-react";

export const Route = createFileRoute("/portfolio-builder")({
  component: PortfolioBuilderPage,
});

/* ── Nav items ── */
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "portfolios", label: "Portfolios", icon: FolderOpen, href: "#" },
  { id: "templates", label: "Templates", icon: LayoutTemplate, href: "#" },
  { id: "ai", label: "AI Assistant", icon: Bot, href: "#" },
  { id: "analytics", label: "Analytics", icon: BarChart2, href: "#" },
  { id: "domains", label: "Domains", icon: Globe, href: "#" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

/* ── Templates ── */
const TEMPLATES = [
  { id: "modern", label: "Modern Minimal", hue: "300" },
  { id: "dark", label: "Dark Mode", hue: "240" },
  { id: "creative", label: "Creative Studio", hue: "340" },
  { id: "terminal", label: "Developer Terminal", hue: "150" },
  { id: "classic", label: "Professional Classic", hue: "210" },
];

/* ────────────────────────────────────────────────────────── */
/*  LEFT SIDEBAR                                              */
/* ────────────────────────────────────────────────────────── */
function Sidebar({ active }: { active: string }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-slate-800/60 bg-[#0B0D14] py-5">
      {/* Logo */}
      <div>
        <div className="mb-6 flex items-center gap-2 px-4">
          <span className="text-base font-bold text-white">✨ AI Portfolio</span>
          <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Pro
          </span>
        </div>

        {/* Nav */}
        <nav className="space-y-0.5 px-2">
          {NAV.map(({ id, label, icon: Icon, href }) => {
            const isActive = id === active;
            return (
              <Link
                key={id}
                to={href as "/"}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "border border-violet-700/40 bg-violet-900/25 text-violet-300"
                    : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
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
      <div className="mx-3 rounded-xl border border-violet-700/40 bg-gradient-to-b from-violet-900/40 to-purple-950/60 p-4 shadow-lg shadow-violet-900/30">
        <Diamond size={18} className="text-violet-400 mb-2" />
        <p className="text-xs font-bold text-white mb-1">Upgrade to Pro</p>
        <p className="text-[10px] leading-relaxed text-slate-400 mb-3">
          Deploy to Vercel, custom domains, analytics &amp; unlimited portfolios.
        </p>
        <button className="flex w-full items-center justify-center gap-1 rounded-lg bg-violet-600 py-2 text-xs font-semibold text-white shadow shadow-violet-900/60 transition hover:bg-violet-500">
          Upgrade Now <ChevronRight size={12} />
        </button>
      </div>
    </aside>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  TOP HEADER                                               */
/* ────────────────────────────────────────────────────────── */
function TopHeader() {
  return (
    <header className="flex items-center justify-end gap-3 border-b border-slate-800/60 bg-[#0e1018] px-6 py-3">
      <button className="flex items-center gap-1.5 rounded-lg border border-violet-700/50 bg-violet-900/20 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-900/40">
        <Diamond size={12} /> Upgrade to Pro
      </button>
      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-300">
        <HelpCircle size={16} />
      </button>
      <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-300">
        <Bell size={16} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-500" />
      </button>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-xs font-bold text-white">
        AB
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  STEP HEADER                                              */
/* ────────────────────────────────────────────────────────── */
function StepBadge({ n, locked = false }: { n: number; locked?: boolean }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
      locked
        ? "bg-slate-800 text-slate-500"
        : "bg-violet-600 text-white shadow shadow-violet-900/50"
    }`}>
      {locked ? <Lock size={12} /> : n}
    </span>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  STEP 1 — Upload CV                                       */
/* ────────────────────────────────────────────────────────── */
function StepUpload({ file, onFile }: { file: File | null; onFile: (f: File) => void }) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#131520] p-5">
      <div className="mb-4 flex items-center gap-3">
        <StepBadge n={1} />
        <div>
          <p className="text-sm font-bold text-slate-100">Upload Your CV</p>
          <p className="text-[11px] text-slate-500">We'll extract your info automatically</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/40 py-10 transition hover:border-violet-600/60 hover:bg-violet-950/10"
        >
          {file ? (
            <>
              <FileText size={32} className="text-violet-400" />
              <p className="text-xs font-semibold text-violet-300">{file.name}</p>
              <p className="text-[10px] text-slate-500">File ready</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                <Upload size={22} />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-300">Drag &amp; drop your CV here</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Supports PDF, DOCX</p>
              </div>
            </>
          )}
          <label className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow shadow-violet-900/50 transition hover:bg-violet-500">
            Choose File
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); }}
            />
          </label>
        </div>

        {/* Tips + icons */}
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
                  <Check size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                  <span className="text-[11px] text-slate-400">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Glowing file type icons */}
          <div className="flex items-center gap-3">
            {["PDF", "DOCX"].map((ext) => (
              <div
                key={ext}
                className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-violet-700/30 bg-violet-950/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
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

/* ────────────────────────────────────────────────────────── */
/*  STEP 2 — Choose Template                                 */
/* ────────────────────────────────────────────────────────── */
function StepTemplates({ selected, setSelected }: { selected: string; setSelected: (s: string) => void }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#131520] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StepBadge n={2} />
          <div>
            <p className="text-sm font-bold text-slate-100">Choose a Template</p>
            <p className="text-[11px] text-slate-500">Select the style that fits your industry</p>
          </div>
        </div>
        <button className="text-[11px] font-medium text-violet-400 hover:text-violet-300 transition flex items-center gap-0.5">
          View all templates <ChevronRight size={13} />
        </button>
      </div>

      <div className="relative flex items-center gap-2">
        {/* Left arrow */}
        <button className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 transition hover:border-violet-600/50 hover:text-white">
          <ChevronLeft size={14} />
        </button>

        {/* Cards */}
        <div className="flex flex-1 gap-3 overflow-hidden">
          {TEMPLATES.map((t) => {
            const isSel = t.id === selected;
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`relative flex-1 rounded-xl border p-0 transition-all duration-200 overflow-hidden ${
                  isSel
                    ? "border-purple-500 shadow-[0_0_18px_rgba(168,85,247,0.35)]"
                    : "border-slate-700/60 hover:border-slate-600"
                }`}
              >
                {/* Selected badge */}
                {isSel && (
                  <span className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
                    <Check size={11} />
                  </span>
                )}

                {/* Mock preview block */}
                <div
                  className="h-28 w-full"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.18 0.04 ${t.hue}) 0%, oklch(0.12 0.06 ${t.hue}) 100%)`,
                  }}
                >
                  <div className="flex h-full flex-col items-start justify-end gap-1 p-2.5">
                    <div className="h-1.5 w-3/4 rounded-full opacity-60"
                      style={{ background: `oklch(0.72 0.22 ${t.hue})` }} />
                    <div className="h-1 w-1/2 rounded-full opacity-30 bg-white" />
                    <div className="h-1 w-2/3 rounded-full opacity-20 bg-white" />
                  </div>
                </div>
                <div className="bg-slate-900 px-2 py-1.5">
                  <p className="text-[10px] font-semibold text-slate-300 text-left">{t.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 transition hover:border-violet-600/50 hover:text-white">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  STEP 3 — Generate                                        */
/* ────────────────────────────────────────────────────────── */
function StepGenerate({ onGenerate, loading }: { onGenerate: () => void; loading: boolean }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#131520] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StepBadge n={3} />
          <div>
            <p className="text-sm font-bold text-slate-100">Generate AI Portfolio</p>
            <p className="text-[11px] text-slate-500">
              Our AI will craft a stunning portfolio from your CV in seconds
            </p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] transition hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.65)] active:scale-95 disabled:opacity-60"
        >
          <Sparkles size={15} />
          {loading ? "Generating…" : "✨ Generate Portfolio"}
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[11px] text-slate-400">
            <span>AI is crafting your portfolio…</span>
            <span className="text-violet-400">Running</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-400 animate-pulse"
              style={{ width: "65%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  STEP 4 — Publish (Locked)                               */
/* ────────────────────────────────────────────────────────── */
function StepPublish() {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#131520] p-5 opacity-70">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StepBadge n={4} locked />
          <div>
            <p className="text-sm font-bold text-slate-400">Publish &amp; Deploy</p>
            <p className="text-[11px] text-slate-600">Deploy your portfolio live with one click</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-slate-500" />
          <div className="flex items-center gap-1.5 rounded-lg border border-yellow-700/30 bg-yellow-950/20 px-3 py-1.5">
            <Diamond size={12} className="text-yellow-500" />
            <span className="text-[11px] font-semibold text-yellow-600/90">
              Pro feature: Pay to deploy to Vercel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  PAGE ROOT                                               */
/* ────────────────────────────────────────────────────────── */
function PortfolioBuilderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0e1018] font-sans">
      <Sidebar active="dashboard" />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          {/* Page title row */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100">✨ Portfolio Builder</h1>
              <p className="mt-1 max-w-lg text-sm text-slate-500">
                Upload your CV, choose a template, and let AI craft a stunning portfolio for you.
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white">
              <FolderOpen size={15} /> My Portfolios
            </button>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-4">
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
