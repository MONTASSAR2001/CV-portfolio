import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { generatePortfolioContent, deployPortfolioToVercel } from "@/lib/server-fns";
import { Upload, Layers, Sparkles, Rocket, CheckCircle2, ArrowLeft } from "lucide-react";

import { TEMPLATE_TONES, STAGES } from "@/components/portfolio-builder/types";
import type { PortfolioContent } from "@/components/portfolio-builder/types";
import { StepUpload } from "@/components/portfolio-builder/StepUpload";
import { StepTemplate } from "@/components/portfolio-builder/StepTemplate";
import { StepGenerate } from "@/components/portfolio-builder/StepGenerate";
import { StepDeploy } from "@/components/portfolio-builder/StepDeploy";

export const Route = createFileRoute("/portfolio-builder")({
  beforeLoad: async () => {
    // Client-side guard: SSR skips (no localStorage), client redirects immediately
    if (typeof window !== "undefined") {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw redirect({ to: "/login" });
    }
  },
  component: PortfolioBuilderPage,
});

/* ─── Re-export types for consumers ─────────────────────────────────────── */
export type { PortfolioContent };

/* ─── Step indicator ─────────────────────────────────────────────────────── */
const STEP_META = [
  { n: 1, label: "Upload",   icon: Upload },
  { n: 2, label: "Template", icon: Layers },
  { n: 3, label: "Generate", icon: Sparkles },
  { n: 4, label: "Deploy",   icon: Rocket },
];

function StepDots({ active, done }: { active: number; done: Set<number> }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEP_META.map((s, i) => {
        const isActive = active === s.n;
        const isDone = done.has(s.n);
        const Icon = s.icon;
        return (
          <div key={s.n} className="flex items-center">
            <motion.div animate={{ scale: isActive ? 1.15 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all duration-500"
                style={
                  isDone ? { background: "oklch(0.75 0.2 150 / 0.2)", borderColor: "oklch(0.75 0.2 150 / 0.5)", color: "oklch(0.8 0.2 150)" }
                  : isActive ? { background: "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))", borderColor: "transparent", color: "#fff", boxShadow: "0 0 20px oklch(0.72 0.24 300 / 0.6)" }
                  : { background: "oklch(1 0 0 / 0.04)", borderColor: "oklch(1 0 0 / 0.1)", color: "oklch(1 0 0 / 0.3)" }
                }>
                {isDone ? <CheckCircle2 size={14} /> : <Icon size={14} />}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest"
                style={{ color: isActive ? "#fff" : isDone ? "oklch(0.8 0.2 150)" : "oklch(1 0 0 / 0.3)" }}>
                {s.label}
              </span>
            </motion.div>
            {i < STEP_META.length - 1 && (
              <div className="mx-3 mb-4 h-px w-10 transition-all duration-700"
                style={{ background: done.has(s.n) ? "oklch(0.75 0.2 150 / 0.5)" : "oklch(1 0 0 / 0.08)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
function PortfolioBuilderPage() {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  // ── Wizard state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const complete = (n: number) => setCompleted((prev) => new Set([...prev, n]));

  // ── Form state ────────────────────────────────────────────────────────────
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState("architect");

  // ── Generation state ──────────────────────────────────────────────────────
  const [generating, setGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState("");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<PortfolioContent | null>(null);

  // ── Deploy state ──────────────────────────────────────────────────────────
  const [isDeploying, setIsDeploying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  // ── Generate handler ──────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!file && !prompt) {
      setGenerationError("Please upload a PDF file or enter a prompt in Step 1.");
      return;
    }
    setGenerating(true);
    setGenerationError(null);
    setGeneratedContent(null);

    try {
      let cvText = "";
      if (file) {
        setGenerationStage(STAGES[0]);
        const { extractTextFromPDF } = await import("@/lib/pdf-extractor");
        cvText = await extractTextFromPDF(file);
        if (cvText.trim().length < 80) throw new Error("Extracted text too short — ensure PDF has selectable text.");
      } else {
        setGenerationStage("Analyzing your prompt...");
      }

      setGenerationStage(STAGES[1]);
      const tone = TEMPLATE_TONES[selectedTemplate] ?? "Professional and polished.";

      setGenerationStage(STAGES[2]);
      const parsed = await generatePortfolioContent({
        data: {
          cvText: file ? cvText.slice(0, 14000) : undefined,
          prompt: prompt || undefined,
          templateTone: tone,
          accessToken: session?.access_token ?? "",
        },
      });

      setGenerationStage(STAGES[3]);
      if (!parsed.bio || !Array.isArray(parsed.projects) || !Array.isArray(parsed.skills)) {
        throw new Error("Unexpected AI response. Please try again.");
      }

      setGeneratedContent(parsed);
      complete(3);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setGenerating(false);
      setGenerationStage("");
    }
  };

  // ── Deploy handler ────────────────────────────────────────────────────────
  const handleDeploy = async () => {
    if (!user || !generatedContent) return;
    setIsDeploying(true);
    setDeployError(null);

    try {
      const { url } = await deployPortfolioToVercel({
        data: {
          content: generatedContent,
          templateId: selectedTemplate,
          accessToken: session?.access_token ?? "",
        },
      });
      setDeployedUrl(url);
      setIsDeploying(false);

      setSaving(true);
      const { error } = await supabase.from("portfolios").insert({
        user_id: user.id, template_id: selectedTemplate,
        content_json: generatedContent, deployed_url: url,
      });
      setSaving(false);
      if (error) setDeployError(`Deployed but DB save failed: ${error.message}`);
      else { setSaved(true); complete(4); }
    } catch (err) {
      setDeployError(err instanceof Error ? err.message : "Deployment failed.");
      setIsDeploying(false);
    }
  };

  if (loading || !user) return null;

  const initials = user.email?.slice(0, 2).toUpperCase() ?? "NA";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">

      {/* ── Ambient background ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.24 300 / 0.18), transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.85 0.18 210 / 0.15), transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.22 275 / 0.08), transparent 65%)", filter: "blur(60px)" }} />
      </div>

      {/* ── Floating nav ── */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-4xl items-center justify-between px-4">
        <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/50 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <img src="/logo.png" alt="CareerOS Logo" className="h-6 w-auto object-contain" />
            <span className="font-display text-sm font-semibold text-white">CareerOS <span className="text-white/30">/ Portfolio Builder</span></span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))" }}>
            {initials}
          </div>
        </div>
      </motion.nav>

      {/* ── Page content ── */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 pb-24 pt-36">

        {/* Hero heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.72 0.24 300)", boxShadow: "0 0 8px oklch(0.72 0.24 300)" }} />
            AI-powered · Edge deployed · One click
          </div>
          <h1 className="font-display text-5xl font-light tracking-tight text-white sm:text-7xl">
            Build your{" "}
            <span style={{ background: "linear-gradient(135deg, oklch(0.85 0.18 300), oklch(0.85 0.18 210))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              portfolio.
            </span>
          </h1>
          <p className="mt-4 text-base text-white/35 sm:text-lg">
            Upload CV → choose a style → AI generates → deploy live in seconds.
          </p>
        </motion.div>

        {/* Step indicator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12 w-full max-w-md">
          <StepDots active={step} done={completed} />
        </motion.div>

        {/* Active step */}
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepUpload key="step1" file={file} onFile={(f) => { setFile(f); setPrompt(""); complete(1); }}
                prompt={prompt} onPrompt={(p) => { setPrompt(p); setFile(null); complete(1); }}
                onNext={() => { complete(1); setStep(2); }} />
            )}
            {step === 2 && (
              <StepTemplate key="step2" selected={selectedTemplate} setSelected={setSelectedTemplate}
                onNext={() => { complete(2); setStep(3); }} />
            )}
            {step === 3 && (
              <StepGenerate key="step3" hasData={!!file || !!prompt} loading={generating} stage={generationStage}
                error={generationError} done={!!generatedContent}
                onGenerate={handleGenerate} onNext={() => { complete(3); setStep(4); }} />
            )}
            {step === 4 && (
              <StepDeploy key="step4" content={generatedContent} isDeploying={isDeploying}
                saving={saving} saved={saved} deployedUrl={deployedUrl}
                deployError={deployError} onDeploy={handleDeploy} />
            )}
          </AnimatePresence>
        </div>

        {/* Step nav pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex items-center gap-3">
          {step > 1 && (
            <button onClick={() => setStep((s) => s - 1)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-white/50 backdrop-blur transition hover:bg-white/10 hover:text-white">
              ← Back
            </button>
          )}
          {step < 4 && step !== 1 && (
            <button onClick={() => setStep((s) => s + 1)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-white/50 backdrop-blur transition hover:bg-white/10 hover:text-white">
              Skip →
            </button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
