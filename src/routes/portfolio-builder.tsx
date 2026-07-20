import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import {
  generatePortfolioContent,
  deployPortfolioToVercel,
} from "@/lib/server-fns";
import {
  LayoutDashboard, FolderOpen, LayoutTemplate, Bot, BarChart2,
  Globe, Settings, Diamond, ChevronRight, ChevronLeft, Check,
  Upload, Bell, HelpCircle, Lock, Sparkles, FileText, ExternalLink,
  AlertCircle, CheckCircle2, Cpu, Loader2, CloudUpload, Copy, Rocket,
} from "lucide-react";

/* ─── AI Content Types ───────────────────────────────────── */
export type PortfolioProject = {
  title: string;
  description: string;
  tech: string[];
  highlight?: string;
};

export type PortfolioContent = {
  bio: string;
  headline: string;
  projects: PortfolioProject[];
  skills: string[];
};

/* ─── Template tone map ──────────────────────────────────── */
const TEMPLATE_TONES: Record<string, string> = {
  vogue:
    "Editorial, high-fashion, sophisticated, and aspirational — use elevated language befitting a luxury creative professional.",
  architect:
    "Clean, minimalist, structural, and precise — like a thoughtful architecture firm portfolio. Formal yet elegant.",
  biotech:
    "Scientific, data-driven, and research-focused. Methodical and credentialed, highlighting measurable outcomes.",
  lumina:
    "Story-driven and UX-focused. Empathetic, warm, and narrative — lead with human impact over technical detail.",
  sterling:
    "Terminal aesthetic, developer-centric, and technically precise. Terse, impactful sentences. Let the tech stack speak.",
};

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
            const className = `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "border border-violet-500/30 bg-violet-500/10 text-violet-300 shadow-inner shadow-violet-900/20"
                : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
            }`;
            const inner = (
              <>
                <Icon size={15} />
                {label}
              </>
            );
            
            if (href === "#") {
              return (
                <button key={id} className={`${className} w-full text-left opacity-60 cursor-not-allowed`} title="Coming soon">
                  {inner}
                </button>
              );
            }
            
            return (
              <Link key={id} to={href as "/"} className={className}>
                {inner}
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
const STAGES = [
  "Parsing your CV document…",
  "Analyzing experience and projects…",
  "Crafting portfolio narrative…",
  "Tailoring tone to selected template…",
];

function StepGenerate({
  onGenerate,
  loading,
  stage,
  error,
  hasFile,
}: {
  onGenerate: () => void;
  loading: boolean;
  stage: string;
  error: string | null;
  hasFile: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StepBadge n={3} />
          <div>
            <p className="text-sm font-bold text-white">Generate AI Portfolio</p>
            <p className="text-[11px] text-slate-500">
              AI reads your CV and crafts structured portfolio copy
            </p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading || !hasFile}
          title={!hasFile ? "Upload your CV in Step 1 first" : undefined}
          className="group/btn relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0" />
          <Sparkles size={16} className="relative z-10 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110" />
          <span className="relative z-10">
            {loading ? "Generating…" : "✨ Generate Portfolio"}
          </span>
        </button>
      </div>

      {/* Error banner */}
      {error && !loading && (
        <div className="relative z-10 mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-rose-400" />
          <p className="text-[12px] leading-relaxed text-rose-300">{error}</p>
        </div>
      )}

      {/* Live progress */}
      {loading && (
        <div className="relative z-10 mt-5 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
          <div className="mb-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-violet-400 animate-ping" />
              {stage || "Initializing…"}
            </span>
            <span className="font-bold text-violet-300 flex items-center gap-1">
              <Cpu size={11} className="animate-pulse" /> AI Running
            </span>
          </div>
          {/* Stage pipeline indicators */}
          <div className="flex gap-1.5 mb-3">
            {STAGES.map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all duration-700 ${
                  stage === s
                    ? "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                    : STAGES.indexOf(s) < STAGES.indexOf(stage)
                    ? "bg-violet-600/70"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-[length:200%_100%] shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-700"
              style={{
                width: `${Math.max(10, ((STAGES.indexOf(stage) + 1) / STAGES.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step 4: Publish (locks until AI generates content) ──── */
function StepPublish({
  content,
  onDeployAndSave,
  isDeploying,
  saving,
  saved,
  deployedUrl,
  deployError,
}: {
  content: PortfolioContent | null;
  onDeployAndSave: () => void;
  isDeploying: boolean;
  saving: boolean;
  saved: boolean;
  deployedUrl: string | null;
  deployError: string | null;
}) {
  const isUnlocked = content !== null;

  if (!isUnlocked) {
    return (
      <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 opacity-60 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:opacity-80 hover:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StepBadge n={4} locked />
            <div>
              <p className="text-sm font-bold text-slate-500">Publish &amp; Deploy</p>
              <p className="text-[11px] text-slate-600">Complete Step 3 to unlock deployment</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-1.5">
            <Lock size={12} className="text-yellow-600/60" />
            <span className="text-[11px] font-semibold text-yellow-600/60">Locked</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-[0_8px_32px_0_rgba(16,185,129,0.15)] backdrop-blur-xl relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-60" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <StepBadge n={4} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-white">Publish &amp; Deploy</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                <CheckCircle2 size={10} /> Content Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Deploy your portfolio live to Vercel with one click.</p>
          </div>
        </div>

        {/* CTA */}
        <button
          id="portfolio-deploy-btn"
          onClick={onDeployAndSave}
          disabled={isDeploying || saving || saved}
          className={`shrink-0 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed ${
            saved
              ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
              : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] hover:scale-[1.03] active:scale-95"
          }`}
        >
          {isDeploying || saving ? (
            <><Loader2 size={14} className="animate-spin" /> {isDeploying ? "Deploying…" : "Saving…"}</>
          ) : saved ? (
            <><CheckCircle2 size={14} /> Live!</>
          ) : (
            <><Rocket size={14} /> 🚀 Deploy Live to Vercel</>
          )}
        </button>
      </div>

      {/* Deploy error */}
      {deployError && !isDeploying && (
        <div className="relative z-10 mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-rose-400" />
          <p className="text-[12px] text-rose-300 leading-relaxed">{deployError}</p>
        </div>
      )}

      {/* Live URL banner */}
      {deployedUrl && (
        <div className="relative z-10 mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
          <span className="text-base">🎉</span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-emerald-400 font-semibold mb-0.5">Your portfolio is live!</p>
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-300 hover:text-white transition truncate flex items-center gap-1"
            >
              {deployedUrl} <ExternalLink size={11} />
            </a>
          </div>
          <button
            id="copy-deploy-url"
            onClick={() => navigator.clipboard.writeText(deployedUrl)}
            className="shrink-0 flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
          >
            <Copy size={12} /> Copy Link
          </button>
        </div>
      )}

      {/* Content preview */}
      <div className="relative z-10 mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Bio</p>
          <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">{content.bio}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Projects</p>
          <p className="text-2xl font-bold text-white">{content.projects.length}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {content.projects.slice(0, 3).map((p) => (
              <span key={p.title} className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-400">{p.title}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Skills</p>
          <p className="text-2xl font-bold text-white">{content.skills.length}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {content.skills.slice(0, 4).map((s) => (
              <span key={s} className="rounded bg-violet-500/15 border border-violet-500/25 px-1.5 py-0.5 text-[9px] text-violet-300">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ─── Page root ──────────────────────────────────────────── */
function PortfolioBuilderPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("vogue");
  const [generating, setGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState("");
  const [generatedContent, setGeneratedContent] = useState<PortfolioContent | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  // ── Auth guard ──────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  // ── Deploy to Vercel + save to Supabase ──────────────────────
  const handleDeployAndSave = async () => {
    if (!user || !generatedContent) return;
    setIsDeploying(true);
    setDeployError(null);

    try {
      // Secure server-side deploy — VERCEL_ACCESS_TOKEN never reaches the browser
      const { url } = await deployPortfolioToVercel({
        data: { content: generatedContent, templateId: selectedTemplate },
      });
      setDeployedUrl(url);
      setIsDeploying(false);

      // Persist to Supabase with the live URL
      setSaving(true);
      const { error } = await supabase.from("portfolios").insert({
        user_id: user.id,
        template_id: selectedTemplate,
        content_json: generatedContent,
        deployed_url: url,
      });
      setSaving(false);
      if (error) {
        setDeployError(`Saved to Vercel but DB insert failed: ${error.message}`);
      } else {
        setSaved(true);
      }
    } catch (err) {
      setDeployError(err instanceof Error ? err.message : "Deployment failed.");
      setIsDeploying(false);
    }
  };

  if (loading) return null;

  const handleGenerate = async () => {
    if (!file) {
      setGenerationError("Please upload your CV in Step 1 before generating.");
      return;
    }
    if (file.type !== "application/pdf") {
      setGenerationError("Only PDF files are supported for AI generation. Please re-upload as a PDF.");
      return;
    }

    setGenerating(true);
    setGenerationError(null);
    setGeneratedContent(null);

    try {
      // ── Stage 1: Extract PDF text (client-side, no secrets needed) ──────
      setGenerationStage(STAGES[0]);
      const { extractTextFromPDF } = await import("@/lib/pdf-extractor");
      const cvText = await extractTextFromPDF(file);
      if (cvText.trim().length < 80) {
        throw new Error("The extracted text is too short. Make sure the PDF contains selectable text, not just scanned images.");
      }

      // ── Stage 2: Prepare context ──────────────────────────────────────────
      setGenerationStage(STAGES[1]);
      const tone = TEMPLATE_TONES[selectedTemplate] ?? "Professional and polished.";

      // ── Stage 3: Call secure server function (GROQ_API_KEY stays server-side)
      setGenerationStage(STAGES[2]);
      const parsed = await generatePortfolioContent({
        data: { cvText: cvText.slice(0, 14000), templateTone: tone },
      });

      // ── Stage 4: Validate & store ─────────────────────────────────────────
      setGenerationStage(STAGES[3]);
      if (!parsed.bio || !Array.isArray(parsed.projects) || !Array.isArray(parsed.skills)) {
        throw new Error("Unexpected AI response format. Please try again.");
      }

      setGeneratedContent(parsed);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setGenerating(false);
      setGenerationStage("");
    }
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
            <StepGenerate
              onGenerate={handleGenerate}
              loading={generating}
              stage={generationStage}
              error={generationError}
              hasFile={file !== null}
            />
            <StepPublish
              content={generatedContent}
              onDeployAndSave={handleDeployAndSave}
              isDeploying={isDeploying}
              saving={saving}
              saved={saved}
              deployedUrl={deployedUrl}
              deployError={deployError}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

