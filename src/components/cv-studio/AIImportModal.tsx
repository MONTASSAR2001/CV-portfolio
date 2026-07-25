import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, FileText, Upload, Loader2, CheckCircle2, Wand2, ArrowRight, FileUp } from "lucide-react";
import { extractTextFromPDF } from "@/lib/pdf-extractor";
import { parseResumeWithAI } from "@/lib/server-fns";
import type { CvState } from "./types";
import { EMPTY_CV_STATE } from "./types";

interface AIImportModalProps {
  onStart: (data: CvState) => void;
  accessToken: string;
}

const AI_STAGES = [
  "Reading your PDF…",
  "Extracting text content…",
  "Analysing career history…",
  "Structuring experience & skills…",
  "Generating your CV draft…",
];

export function AIImportModal({ onStart, accessToken }: AIImportModalProps) {
  const [phase, setPhase] = useState<"select" | "loading" | "done">("select");
  const [aiTab, setAiTab] = useState<"upload" | "prompt">("upload");
  const [promptText, setPromptText] = useState("");
  const [stageIdx, setStageIdx] = useState(0);
  const [dragover, setDragover] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function processAI(input: { file?: File; prompt?: string }) {
    if (input.file && input.file.type !== "application/pdf") { toast.error("Please upload a PDF file."); return; }
    // BUG FIX: previously checked `if (input.prompt && !input.prompt.trim())` which is correct,
    // but the REAL bug was calling processAI with an empty promptText (no guard at call-site).
    // Now we guard both here AND enforce non-empty prompt at call-site.
    if (!input.file && (!input.prompt || !input.prompt.trim())) {
      toast.error("Please enter a prompt or upload a PDF.");
      return;
    }
    
    setPhase("loading");
    const timer = setInterval(() => setStageIdx(i => Math.min(i + 1, AI_STAGES.length - 1)), 900);
    try {
      let reqData: any = { accessToken };
      if (input.file) {
        const text = await extractTextFromPDF(input.file);
        if (!text || text.trim().length < 80) throw new Error("Could not extract enough text. Use a text-based (non-scanned) PDF.");
        reqData.cvText = text.slice(0, 12000);
      } else {
        reqData.prompt = input.prompt!.trim();
      }
      
      const parsed = await parseResumeWithAI({ data: reqData });
      
      // Null-safety: guarantee arrays exist before mapping (AI may omit empty sections)
      const safeExperience = Array.isArray(parsed.experience) ? parsed.experience : [];
      const safeEducation  = Array.isArray(parsed.education)  ? parsed.education  : [];
      const safeSkills     = Array.isArray(parsed.skills)     ? parsed.skills     : [];
      const safeProjects   = Array.isArray(parsed.projects)   ? parsed.projects   : [];

      // Map PortfolioData to CvState
      const mappedCvData: CvState = {
        personalInfo: {
          fullName: parsed.personalInfo?.name  || "",
          jobTitle: parsed.personalInfo?.role  || "",
          email:    parsed.personalInfo?.email || "",
          phone: "",
          location: "",
          linkedin: parsed.personalInfo?.socials?.linkedin || "",
          summary:  parsed.personalInfo?.bio   || "",
          name:    parsed.personalInfo?.name,
          role:    parsed.personalInfo?.role,
          bio:     parsed.personalInfo?.bio,
          socials: parsed.personalInfo?.socials,
        },
        experience: safeExperience.map((e: any, i: number) => ({
          id: i.toString(),
          role:     e.role     || "",
          company:  e.company  || "",
          period:   e.duration || "",
          bullets:  e.description || "",
          duration:    e.duration,
          description: e.description,
        })),
        education: safeEducation.map((e: any, i: number) => ({
          id:          i.toString(),
          degree:      e.degree      || "",
          school:      e.institution || "",
          year:        e.year        || "",
          institution: e.institution,
        })),
        skills:   safeSkills,
        projects: safeProjects,
      };

      clearInterval(timer);
      setStageIdx(AI_STAGES.length - 1);
      setPhase("done");
      await new Promise(r => setTimeout(r, 900));
      toast.success(input.file ? "CV imported! Review and tweak any details below." : "CV generated! Review and tweak any details below.");
      onStart(mappedCvData);
    } catch (err) {
      clearInterval(timer);
      toast.error(`AI process failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      setPhase("select"); setStageIdx(0);
    }
  }

  if (phase === "loading" || phase === "done") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.72 0.24 280 / 0.25) 0%, transparent 70%)" }} />
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative flex flex-col items-center gap-8 text-center">
          {phase !== "done" ? (
            <div className="relative">
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="h-24 w-24 rounded-full" style={{ background: "conic-gradient(from 0deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210), oklch(0.72 0.24 300))", boxShadow: "0 0 80px oklch(0.72 0.24 300 / 0.6)" }} />
              <div className="absolute inset-[3px] rounded-full bg-[#050508] grid place-items-center"><Wand2 size={32} className="text-violet-400" /></div>
            </div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="flex h-24 w-24 items-center justify-center rounded-full" style={{ background: "oklch(0.75 0.2 150 / 0.15)", border: "2px solid oklch(0.75 0.2 150 / 0.5)", boxShadow: "0 0 60px oklch(0.75 0.2 150 / 0.4)" }}>
              <CheckCircle2 size={44} style={{ color: "oklch(0.8 0.2 150)" }} />
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={phase === "done" ? "done" : stageIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2">
              <p className="font-display text-xl font-semibold text-foreground">{phase === "done" ? "Import complete!" : AI_STAGES[stageIdx]}</p>
              {phase !== "done" && <p className="text-sm text-muted-foreground">CareerOS AI is reading your career history…</p>}
            </motion.div>
          </AnimatePresence>
          {phase !== "done" && (
            <div className="flex gap-2">
              {AI_STAGES.map((_, i) => (
                <motion.div key={i} className="h-1.5 rounded-full" animate={{ width: i === stageIdx ? 24 : 6, background: i <= stageIdx ? "oklch(0.72 0.24 300)" : "oklch(1 0 0 / 0.15)" }} transition={{ duration: 0.3 }} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-15%] h-[600px] w-[600px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.72 0.24 300 / 0.2) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.85 0.18 210 / 0.2) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-2xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
            <Sparkles size={12} className="text-violet-400" />CareerOS CV Studio
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">How do you want to build your CV?</h1>
          <p className="mt-3 text-muted-foreground">Start from scratch or let AI extract your information instantly.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.button id="cv-start-scratch" whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => onStart(EMPTY_CV_STATE)} className="group relative flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-left backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "oklch(0.75 0.22 275 / 0.15)", border: "1px solid oklch(0.75 0.22 275 / 0.3)" }}>
              <FileText size={22} style={{ color: "oklch(0.85 0.2 275)" }} />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-foreground">Start from scratch</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Fill in your details step by step. Full control with live A4 preview.</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5" style={{ color: "oklch(0.85 0.2 275)" }}>Begin <ArrowRight size={14} /></div>
          </motion.button>
          <motion.div whileHover={{ y: -4 }} className="group relative flex flex-col rounded-3xl p-[1px] backdrop-blur transition-all duration-300" style={{ background: "linear-gradient(135deg, oklch(0.72 0.24 300 / 0.4), oklch(0.85 0.18 210 / 0.3))", boxShadow: "0 0 40px oklch(0.72 0.24 300 / 0.1)" }}>
            <div className="flex h-full flex-col items-start gap-4 rounded-3xl bg-[#0a0a12] p-8">
              <div className="flex w-full items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "oklch(0.72 0.24 300 / 0.15)", border: "1px solid oklch(0.72 0.24 300 / 0.4)", boxShadow: "0 0 20px oklch(0.72 0.24 300 / 0.3)" }}>
                  <Wand2 size={22} style={{ color: "oklch(0.85 0.2 300)" }} />
                </div>
                <div className="flex bg-black/40 p-1 rounded-lg">
                  <button onClick={(e) => { e.stopPropagation(); setAiTab("upload"); }} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${aiTab === "upload" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}>Upload PDF</button>
                  <button onClick={(e) => { e.stopPropagation(); setAiTab("prompt"); }} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${aiTab === "prompt" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}>Use Prompt</button>
                </div>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground">Build with AI</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {aiTab === "upload" ? "Upload your existing CV as a PDF. Our AI extracts and auto-fills every field in seconds." : "Describe your role and the type of portfolio you want. AI will generate it."}
                </p>
              </div>
              
              {aiTab === "upload" ? (
                <div id="cv-ai-dropzone" onDragOver={e => { e.preventDefault(); setDragover(true); }} onDragLeave={() => setDragover(false)} onDrop={e => { e.preventDefault(); setDragover(false); const f = e.dataTransfer.files[0]; if (f) processAI({ file: f }); }} onClick={() => fileRef.current?.click()} className={`mt-auto w-full cursor-pointer rounded-2xl border-2 border-dashed px-4 py-5 text-center transition-all duration-200 ${dragover ? "border-violet-400/70 bg-violet-400/10" : "border-violet-500/30 bg-violet-500/5 hover:border-violet-400/50"}`}>
                  <FileUp size={20} className="mx-auto mb-2 text-violet-400" />
                  <p className="text-xs font-semibold text-violet-300">Drop your CV PDF here</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">or click to browse</p>
                </div>
              ) : (
                <div className="mt-auto w-full flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                  <textarea 
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="e.g. I'm an embedded systems engineer with 5 years experience at Bosch..."
                    className="w-full h-24 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none transition-all"
                  />
                  <button 
                    onClick={() => processAI({ prompt: promptText })}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500"
                  >
                    <Sparkles size={14} /> Generate Profile
                  </button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processAI({ file: f }); }} />
            </div>
          </motion.div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground/60">You can always switch templates, edit all fields, and export as PDF after choosing.</p>
      </motion.div>
    </div>
  );
}
