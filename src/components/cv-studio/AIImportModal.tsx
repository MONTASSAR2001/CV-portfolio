import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, FileText, Upload, Loader2, CheckCircle2, Wand2, ArrowRight, FileUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { extractTextFromPDF } from "@/lib/pdf-extractor";
import { parseResumeWithAI } from "@/lib/server-fns";
import type { CvState } from "./types";
import { EMPTY_CV_STATE } from "./types";

interface AIImportModalProps {
  onStart: (data: CvState) => void;
  accessToken: string;
  /** Optional: if provided, a close button is shown to dismiss the modal without changing state */
  onDismiss?: () => void;
}

const AI_STAGES = [
  "Reading your PDF…",
  "Extracting text content…",
  "Analysing career history…",
  "Structuring experience & skills…",
  "Generating your CV draft…",
];

export function AIImportModal({ onStart, accessToken, onDismiss }: AIImportModalProps) {
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error("Authentication failed: " + sessionError.message);
      
      const realToken = session?.access_token || accessToken;
      if (!realToken) throw new Error("Unauthorized: No valid session token found.");

      let reqData: any = { accessToken: realToken };
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
          github:   parsed.personalInfo?.socials?.github || "",
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
    } catch (err: any) {
      clearInterval(timer);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`AI process failed: ${errorMessage}`);
      setPhase("select"); 
      setStageIdx(0);
    }
  }

  if (phase === "loading" || phase === "done") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white w-full min-h-screen">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative flex flex-col items-center gap-8 text-center">
          {phase !== "done" ? (
            <div className="relative">
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -inset-4 rounded-full bg-black" />
              <div className="relative h-24 w-24 rounded-full bg-black grid place-items-center">
                <Wand2 size={32} className="text-white" />
              </div>
            </div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-black bg-white shadow-xl">
              <CheckCircle2 size={44} className="text-black" />
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={phase === "done" ? "done" : stageIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2">
              <p className="font-display text-xl font-bold text-black">{phase === "done" ? "Import complete!" : AI_STAGES[stageIdx]}</p>
              {phase !== "done" && <p className="text-sm text-gray-600 font-medium">CareerOS AI is reading your career history…</p>}
            </motion.div>
          </AnimatePresence>
          {phase !== "done" && (
            <div className="flex gap-2">
              {AI_STAGES.map((_, i) => (
                <motion.div key={i} className="h-1.5 rounded-full" animate={{ width: i === stageIdx ? 24 : 6, background: i <= stageIdx ? "#000000" : "#e5e7eb" }} transition={{ duration: 0.3 }} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white w-full min-h-screen">
      {/* Dismiss button — only shown when modal is re-opened from editor */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Close AI modal"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition hover:border-black hover:bg-black hover:text-white"
        >
          ✕
        </button>
      )}
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-2xl px-4">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-bold text-black">
            <Sparkles size={12} className="text-black" />CareerOS CV Studio
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-black">How do you want to build your CV?</h1>
          <p className="mt-3 text-gray-600 font-medium">Start from scratch or let AI extract your information instantly.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.button id="cv-start-scratch" onClick={() => onStart(EMPTY_CV_STATE)} className="group relative flex flex-col items-start gap-4 rounded-3xl border-2 border-black bg-white p-8 text-left transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
              <FileText size={22} className="text-white" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-black">Start from scratch</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 font-medium">Fill in your details step by step. Full control with a live A4 preview.</p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-sm font-bold text-black transition-all group-hover:gap-2.5">Begin <ArrowRight size={14} /></div>
          </motion.button>
          <motion.div className="group relative flex flex-col rounded-3xl bg-black transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1">
            <div className="flex h-full flex-col items-start gap-4 rounded-3xl p-8">
              <div className="flex w-full items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  <Wand2 size={22} className="text-black" />
                </div>
                <div className="flex bg-gray-800 p-1 rounded-lg">
                  <button onClick={(e) => { e.stopPropagation(); setAiTab("upload"); }} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${aiTab === "upload" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>Upload PDF</button>
                  <button onClick={(e) => { e.stopPropagation(); setAiTab("prompt"); }} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${aiTab === "prompt" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>Use Prompt</button>
                </div>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-white">Build with AI</p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-300 font-medium">
                  {aiTab === "upload" ? "Upload your existing CV. Our AI extracts and auto-fills every field instantly." : "Describe your role and background. AI will instantly generate your profile."}
                </p>
              </div>
              
              {aiTab === "upload" ? (
                <div id="cv-ai-dropzone" onDragOver={e => { e.preventDefault(); setDragover(true); }} onDragLeave={() => setDragover(false)} onDrop={e => { e.preventDefault(); setDragover(false); const f = e.dataTransfer.files[0]; if (f) processAI({ file: f }); }} onClick={() => fileRef.current?.click()} className={`mt-auto w-full cursor-pointer rounded-2xl border-2 border-dashed px-4 py-5 text-center transition-all duration-200 ${dragover ? "border-gray-400 bg-gray-800" : "border-gray-600 bg-gray-900 hover:border-gray-400"}`}>
                  <FileUp size={20} className="mx-auto mb-2 text-white" />
                  <p className="text-xs font-bold text-white">Drop your CV PDF here</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">or click to browse</p>
                </div>
              ) : (
                <div className="mt-auto w-full flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                  <textarea 
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="e.g. I'm a software engineer with 5 years experience..."
                    className="w-full h-24 rounded-xl border border-gray-700 bg-gray-900 p-3 text-sm font-medium text-white placeholder-gray-500 focus:border-white focus:outline-none resize-none transition-all"
                  />
                  <button 
                    onClick={() => processAI({ prompt: promptText })}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black transition-all hover:bg-gray-200"
                  >
                    <Sparkles size={14} /> Generate Profile
                  </button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processAI({ file: f }); }} />
            </div>
          </motion.div>
        </div>
        <p className="mt-6 text-center text-xs text-gray-500 font-medium">You can always switch templates, edit all fields, and export as PDF after choosing.</p>
      </motion.div>
    </div>
  );
}
