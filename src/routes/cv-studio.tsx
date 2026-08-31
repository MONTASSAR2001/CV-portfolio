import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useReactToPrint } from "react-to-print";
import {
  ArrowLeft, Monitor, Smartphone, Download, Cloud,
  CheckCircle2, Loader2, ChevronLeft, ChevronRight,
  Rocket, Copy, ExternalLink,
} from "lucide-react";



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
  ATSExecutiveTemplate,
} from "@/components/cv-templates";
import { StanfordAtsTemplate } from "@/components/cv-templates/StanfordAtsTemplate";

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
    case "atsexecutive":    return <ATSExecutiveTemplate    {...p} />;
    case "stanfordats":     return <StanfordAtsTemplate     {...p} />;
  }
}

/* ═══════════════════════════════════════════════════════════════
   Template carousel — horizontal strip with overflow scroll
═══════════════════════════════════════════════════════════════ */
function TemplateSwitcher({
  active, onChange, tier, onUpgrade
}: {
  active: TemplateId;
  onChange: (id: TemplateId) => void;
  tier: string;
  onUpgrade: () => void;
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
              className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-black text-white shadow-md scale-[1.04]"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black"
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
  const { user, session, loading } = useAuth();

  /* ── Phase: "import" shows AIImportModal; "editor" shows the studio ── */
  const [phase, setPhase]           = useState<"import" | "editor">("import");
  const [cvData, setCvData]         = useState<CvState>(DEMO_CV_STATE);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("minimalist");
  const [device, setDevice]         = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving]         = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const [savedCvData, setSavedCvData] = useState<CvState | null>(null);
  const [showLoadPrompt, setShowLoadPrompt] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  /* ── Auth guard & Data Fetch ── */
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
    if (user) {
      const fetchData = async () => {
        try {
          const { data } = await supabase.from("profiles").select("subscription_tier").eq("id", user.id).maybeSingle();
          if (data) setSubscriptionTier(data.subscription_tier || "free");
        } catch (error) {
          console.error("Error fetching profile:", error);
        }

        try {
          const { data } = await supabase.from("cvs").select("cv_data_json").eq("user_id", user.id).maybeSingle();
          if (data && data.cv_data_json) {
            setSavedCvData(data.cv_data_json as unknown as CvState);
            setShowLoadPrompt(true);
          }
        } catch (error) {
          console.error("Error fetching CV:", error);
        }
      };

      fetchData();
    }
  }, [user, loading, navigate]);

  const handleUpgrade = () => {
    navigate({ to: "/pricing" });
  };

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

  // Publish feature removed

  /* ── Handler called by AIImportModal once user picks a start method ── */
  const handleStart = (data: CvState) => {
    setCvData(data);
    setAiModalOpen(false);
    setPhase("editor");
  };

  if (loading) return null;

  return (
    <>
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 -z-10 bg-white" />

      {/* ── AI Import modal (initial phase OR re-opened via button) ── */}
      <AnimatePresence>
        {(phase === "import" || aiModalOpen) && !showLoadPrompt && (
          <AIImportModal
            onStart={handleStart}
            onDismiss={phase === "editor" ? () => setAiModalOpen(false) : undefined}
            accessToken={session?.access_token ?? ""}
          />
        )}
      </AnimatePresence>

      {/* ── Load Prompt Modal ── */}
      <AnimatePresence>
        {showLoadPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl"
              style={{ border: "1px solid #e5e7eb" }}
            >
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-black">Welcome back!</h2>
              <p className="mb-8 text-sm leading-relaxed text-gray-500">
                We found a previously saved CV. Would you like to continue editing it, or start a new one?
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    setShowLoadPrompt(false);
                    // Remains in import phase with DEMO_CV_STATE
                  }}
                  className="rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gray-50 active:scale-95"
                >
                  Start Fresh
                </button>
                <button
                  onClick={() => {
                    if (savedCvData) {
                      setCvData(savedCvData);
                      setPhase("editor");
                    }
                    setShowLoadPrompt(false);
                  }}
                  className="rounded-xl border-2 border-black bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-900 active:scale-95"
                >
                  Continue Saved CV
                </button>
              </div>
            </motion.div>
          </div>
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
            className="flex h-screen flex-col overflow-hidden print:block print:h-auto print:overflow-visible"
            data-cv-studio-shell
          >
            {/* ════════════ Top bar ════════════ */}
            <header
              className="relative z-20 flex h-14 shrink-0 items-center justify-between px-5 backdrop-blur-xl"
              style={{ borderBottom: "1px solid #e5e7eb", background: "#ffffff" }}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-2.5 py-1.5 text-[11px] font-medium text-gray-500 transition hover:bg-gray-200 hover:text-black"
                >
                  <ArrowLeft size={12} /> Dashboard
                </Link>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="CareerOS Logo" className="h-7 w-auto object-contain" />
                  <span className="text-sm font-semibold text-black">CareerOS CV Studio</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: "#f3f4f6", color: "#111111", border: "1px solid #e5e7eb" }}
                  >
                    Beta
                  </span>
                </div>
              </div>

              {/* Centre — device toggle */}
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
                <button
                  id="cv-device-desktop"
                  onClick={() => setDevice("desktop")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${device === "desktop" ? "bg-black text-white shadow" : "text-gray-500 hover:text-black"}`}
                >
                  <Monitor size={13} /> Desktop
                </button>
                <button
                  id="cv-device-mobile"
                  onClick={() => setDevice("mobile")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${device === "mobile" ? "bg-black text-white shadow" : "text-gray-500 hover:text-black"}`}
                >
                  <Smartphone size={13} /> Mobile
                </button>
              </div>

              {/* Right — action buttons */}
              <div className="flex items-center gap-2">
                {/* AI Generate button — always visible, re-opens the import modal */}
                <button
                  id="cv-ai-generate-btn"
                  onClick={() => setAiModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all hover:scale-105 active:scale-[0.97]"
                  style={{
                    background: "#111111",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  ✨ AI Generate
                </button>
                <button
                  id="cv-save-cloud-btn"
                  onClick={handleSaveCloud}
                  disabled={saving}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                    saveStatus === "saved"
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-gray-200 bg-white text-black hover:border-black"
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
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-black transition-all hover:border-black active:scale-[0.97]"
                >
                  <Download size={13} /> Export PDF
                </button>
              </div>
            </header>

            {/* ════════════ Template strip ════════════ */}
            <div
              className="z-10 shrink-0 px-4 py-2.5"
              style={{ borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}
            >
              <TemplateSwitcher active={activeTemplate} onChange={setActiveTemplate} tier={subscriptionTier} onUpgrade={handleUpgrade} />
            </div>

            {/* ════════════ Body: form | preview ════════════ */}
            <div className="flex flex-1 overflow-hidden print:block print:overflow-visible">
              {/* ── Left: Form panel ── */}
              <motion.aside
                initial={{ x: -32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-[460px] shrink-0 overflow-hidden p-4 print:hidden"
                style={{ borderRight: "1px solid #e5e7eb", background: "#ffffff" }}
                data-cv-form-panel
              >
                <CVFormPanel cvData={cvData} setCvData={setCvData} />
              </motion.aside>

              {/* ── Right: CV preview canvas ── */}
              <div
                className="cv-studio-preview-col relative flex flex-1 items-start justify-center overflow-auto bg-white p-8 pt-10 print:h-auto print:block print:overflow-visible print:p-0"
              >
                {/* Subtle background container */}

                <motion.div
                  layout
                  className="cv-preview-motion-wrapper relative pb-12 print:h-auto print:m-0 print:pb-0 print:w-full print:transform-none"
                  animate={{ width: device === "mobile" ? 360 : 794 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "auto" }}
                >
                  {/* Glass frame — hidden at print time via .cv-preview-frame class */}
                  <div
                    className="cv-preview-frame absolute -inset-3 rounded-3xl print:hidden"
                    style={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                  />
                  {/* The actual CV template */}
                  <div
                    className="cv-preview-inner relative h-auto w-full overflow-hidden rounded-2xl print:overflow-visible print:rounded-none print:transform-none"
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
