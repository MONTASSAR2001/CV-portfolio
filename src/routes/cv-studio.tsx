import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useReactToPrint } from "react-to-print";
import {
  ArrowLeft, Monitor, Smartphone, Download, Cloud,
  CheckCircle2, Loader2, ChevronLeft, ChevronRight, Sparkles,
  Rocket, Copy, ExternalLink,
} from "lucide-react";

import { publishPremiumPortfolio } from "@/lib/server-fns";

/* ─── New modular components ─── */
import { AIImportModal } from "@/components/cv-studio/AIImportModal";
import { CVFormPanel } from "@/components/cv-studio/CVFormPanel";
import { TEMPLATE_LIST, DEMO_CV_STATE } from "@/components/cv-studio/types";
import type { CvState, TemplateId } from "@/components/cv-studio/types";

/* ─── Template components ─── */
import {
  MinimalistTemplate, CorporateTemplate, TechTemplate, CreativeTemplate,
  ExecutiveTemplate, StartupTemplate, AcademicTemplate, EditorialTemplate,
  DarkBoldTemplate, VisualTemplate,
  ATSClassicTemplate, ATSModernTemplate, HarvardStandardTemplate,
} from "@/components/cv-templates";

/* ═══════════════════════════════════════════════════════════════
   Route definition
═══════════════════════════════════════════════════════════════ */
export const Route = createFileRoute("/cv-studio")({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw redirect({ to: "/login" });
    }
  },
  component: CvStudioPage,
});

/* ═══════════════════════════════════════════════════════════════
   Template renderer — maps TemplateId → JSX element
═══════════════════════════════════════════════════════════════ */
function renderTemplate(id: TemplateId, data: CvState, ref: React.Ref<HTMLDivElement>) {
  const p = { data, ref };
  switch (id) {
    case "minimalist":      return <MinimalistTemplate      {...p} />;
    case "corporate":       return <CorporateTemplate       {...p} />;
    case "tech":            return <TechTemplate            {...p} />;
    case "creative":        return <CreativeTemplate        {...p} />;
    case "executive":       return <ExecutiveTemplate       {...p} />;
    case "startup":         return <StartupTemplate         {...p} />;
    case "academic":        return <AcademicTemplate        {...p} />;
    case "editorial":       return <EditorialTemplate       {...p} />;
    case "darkbold":        return <DarkBoldTemplate        {...p} />;
    case "visual":          return <VisualTemplate          {...p} />;
    case "atsclassic":      return <ATSClassicTemplate      {...p} />;
    case "atsmodern":       return <ATSModernTemplate       {...p} />;
    case "harvardstandard": return <HarvardStandardTemplate {...p} />;
  }
}

/* ═══════════════════════════════════════════════════════════════
   Template carousel — horizontal strip with overflow scroll
═══════════════════════════════════════════════════════════════ */
function TemplateSwitcher({
  active, onChange,
}: {
  active: TemplateId;
  onChange: (id: TemplateId) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!stripRef.current) return;
    stripRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={() => scroll("left")}
        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        <ChevronLeft size={14} />
      </button>

      <div
        ref={stripRef}
        className="flex gap-1.5 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TEMPLATE_LIST.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              id={`cv-template-${t.id}`}
              onClick={() => onChange(t.id as TemplateId)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-900/50 scale-[1.04]"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-[10px] opacity-70">{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main page component
═══════════════════════════════════════════════════════════════ */
function CvStudioPage() {
  const navigate  = useNavigate();
  const { user, loading } = useAuth();

  /* ── Phase: "import" shows AIImportModal; "editor" shows the studio ── */
  const [phase, setPhase]           = useState<"import" | "editor">("import");
  const [cvData, setCvData]         = useState<CvState>(DEMO_CV_STATE);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("minimalist");
  const [device, setDevice]         = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving]         = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "published" | "error">("idle");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  /* ── PDF export ── */
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${cvData.personalInfo.fullName || "Professional"}_CV`,
  });

  /* ── Cloud save ── */
  const handleSaveCloud = async () => {
    if (!user) return;
    setSaving(true);
    setSaveStatus("idle");
    const toastId = toast.loading("Saving CV to cloud…");
    const { error } = await supabase.from("cvs").upsert(
      { user_id: user.id, cv_data_json: cvData, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    setSaving(false);
    if (error) {
      setSaveStatus("error");
      toast.error(`Save failed: ${error.message}`, { id: toastId });
    } else {
      setSaveStatus("saved");
      toast.success("CV saved successfully!", { id: toastId });
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  /* ── Publish to Vercel (Premium Templates) ── */
  const handlePublish = async () => {
    if (!user) return;
    setPublishing(true);
    setPublishStatus("idle");
    const toastId = toast.loading("Compiling Assets...");
    
    try {
      setTimeout(() => toast.loading("Deploying to Vercel...", { id: toastId }), 1200);
      
      const { url, slug } = await publishPremiumPortfolio({
        data: {
          data: cvData,
          templateId: activeTemplate,
          accessToken: user.id
        }
      });
      
      const updatedCvData = {
        ...cvData,
        publishMeta: {
          slug,
          url,
          templateId: activeTemplate,
          publishedAt: new Date().toISOString()
        }
      };
      
      // Update DB to mark as published
      await supabase.from("cvs").upsert(
        { 
          user_id: user.id, 
          cv_data_json: updatedCvData, 
          updated_at: new Date().toISOString() 
        },
        { onConflict: "user_id" }
      );
      
      setPublishStatus("published");
      setPublishedUrl(url);
      setPublishing(false);
      
      toast.success(
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-emerald-400">Live! Portfolio published.</span>
          <div className="flex gap-2 mt-1">
            <button onClick={() => { navigator.clipboard.writeText(window.location.origin + url); toast.success("Copied!"); }} className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[11px] hover:bg-white/20">
              <Copy size={11} /> Copy Link
            </button>
            <Link to={url} target="_blank" className="flex items-center gap-1 rounded bg-violet-500/20 px-2 py-1 text-[11px] text-violet-300 hover:bg-violet-500/30">
              <ExternalLink size={11} /> Visit
            </Link>
          </div>
        </div>,
        { id: toastId, duration: 10000 }
      );
    } catch (err) {
      setPublishing(false);
      setPublishStatus("error");
      toast.error(`Publish failed: ${err instanceof Error ? err.message : "Unknown error"}`, { id: toastId });
    }
  };

  /* ── Handler called by AIImportModal once user picks a start method ── */
  const handleStart = (data: CvState) => {
    setCvData(data);
    setPhase("editor");
  };

  if (loading) return null;

  return (
    <>
      {/* ── Ambient background (matches Portfolio Builder) ── */}
      <div className="fixed inset-0 -z-10 bg-[#050508]">
        <div
          className="absolute -left-64 -top-64 h-[700px] w-[700px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.24 300) 0%, transparent 65%)", filter: "blur(120px)" }}
        />
        <div
          className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.85 0.18 210) 0%, transparent 65%)", filter: "blur(120px)" }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #a78bfa 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>

      {/* ── AI Import modal (phase === "import") ── */}
      <AnimatePresence>
        {phase === "import" && (
          <AIImportModal
            onStart={handleStart}
            accessToken={user?.id ?? ""}
          />
        )}
      </AnimatePresence>

      {/* ── Studio UI (phase === "editor") ── */}
      <AnimatePresence>
        {phase === "editor" && (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex h-screen flex-col overflow-hidden"
          >
            {/* ════════════ Top bar ════════════ */}
            <header
              className="relative z-20 flex h-14 shrink-0 items-center justify-between px-5 backdrop-blur-xl"
              style={{ borderBottom: "1px solid oklch(1 0 0 / 0.06)", background: "oklch(0.07 0.01 280 / 0.8)" }}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  id="cv-studio-back-dashboard"
                  className="flex items-center gap-1.5 rounded-xl bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
                >
                  <ArrowLeft size={12} /> Dashboard
                </Link>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))", boxShadow: "0 0 16px oklch(0.72 0.24 300 / 0.4)" }}
                  >
                    <Sparkles size={13} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">CareerOS CV Studio</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: "oklch(0.72 0.24 300 / 0.15)", color: "oklch(0.85 0.2 300)", border: "1px solid oklch(0.72 0.24 300 / 0.3)" }}
                  >
                    Beta
                  </span>
                </div>
              </div>

              {/* Centre — device toggle */}
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
                <button
                  id="cv-device-desktop"
                  onClick={() => setDevice("desktop")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${device === "desktop" ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  <Monitor size={13} /> Desktop
                </button>
                <button
                  id="cv-device-mobile"
                  onClick={() => setDevice("mobile")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${device === "mobile" ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  <Smartphone size={13} /> Mobile
                </button>
              </div>

              {/* Right — action buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="cv-save-cloud-btn"
                  onClick={handleSaveCloud}
                  disabled={saving}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                    saveStatus === "saved"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-violet-500/30 hover:text-white"
                  }`}
                >
                  {saving
                    ? <Loader2 size={13} className="animate-spin" />
                    : saveStatus === "saved"
                    ? <CheckCircle2 size={13} />
                    : <Cloud size={13} />}
                  {saving ? "Saving…" : saveStatus === "saved" ? "Saved!" : "Save"}
                </button>

                <button
                  id="cv-export-pdf-btn"
                  onClick={() => handlePrint()}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10 active:scale-[0.97]"
                >
                  <Download size={13} /> Export PDF
                </button>

                <button
                  id="cv-publish-btn"
                  onClick={handlePublish}
                  disabled={publishing}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-all active:scale-[0.97] ${publishing ? "opacity-70" : "hover:scale-105"}`}
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.65 0.25 280))", boxShadow: "0 0 20px oklch(0.72 0.24 300 / 0.4)" }}
                >
                  {publishing ? <Loader2 size={13} className="animate-spin" /> : <Rocket size={13} />}
                  {publishing ? "Publishing…" : publishStatus === "published" ? "Republish" : "Publish"}
                </button>
              </div>
            </header>

            {/* ════════════ Template strip ════════════ */}
            <div
              className="z-10 shrink-0 px-4 py-2.5"
              style={{ borderBottom: "1px solid oklch(1 0 0 / 0.05)", background: "oklch(0.07 0.01 280 / 0.6)", backdropFilter: "blur(12px)" }}
            >
              <TemplateSwitcher active={activeTemplate} onChange={setActiveTemplate} />
            </div>

            {/* ════════════ Body: form | preview ════════════ */}
            <div className="flex flex-1 overflow-hidden">
              {/* ── Left: Form panel ── */}
              <motion.aside
                initial={{ x: -32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-[360px] shrink-0 overflow-hidden p-4"
                style={{ borderRight: "1px solid oklch(1 0 0 / 0.05)" }}
              >
                <CVFormPanel cvData={cvData} setCvData={setCvData} />
              </motion.aside>

              {/* ── Right: CV preview canvas ── */}
              <div className="relative flex flex-1 items-start justify-center overflow-auto p-8 pt-10">
                {/* Subtle radial glow behind the page */}
                <div
                  className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-20"
                  style={{ background: "radial-gradient(ellipse, oklch(0.72 0.24 300) 0%, transparent 70%)", filter: "blur(80px)" }}
                />

                <motion.div
                  layout
                  className="relative"
                  animate={{ width: device === "mobile" ? 360 : 794 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: device === "mobile" ? 520 : 1123 }}
                >
                  {/* Glass frame */}
                  <div
                    className="absolute -inset-3 rounded-3xl"
                    style={{
                      background: "oklch(1 0 0 / 0.025)",
                      border: "1px solid oklch(1 0 0 / 0.08)",
                      backdropFilter: "blur(4px)",
                      boxShadow: "0 32px 80px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(1 0 0 / 0.04)",
                    }}
                  />
                  {/* The actual CV template */}
                  <div
                    className="relative h-full w-full overflow-hidden rounded-2xl"
                    style={{
                      transform: device === "mobile" ? "scale(0.85)" : "scale(1)",
                      transformOrigin: "top center",
                    }}
                  >
                    {renderTemplate(activeTemplate, cvData, printRef)}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
