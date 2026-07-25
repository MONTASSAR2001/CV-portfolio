import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FileText, CheckCircle2, ChevronRight, Wand2, FileUp } from "lucide-react";

/* ── 3D Tilt wrapper (shared) ─────────────────────────────────────────── */
export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 400,
    damping: 30,
  });

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my]
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Step 1: Futuristic Dropzone ────────────────────────────────────────── */
export function StepUpload({
  file,
  onFile,
  prompt,
  onPrompt,
  onNext,
}: {
  file: File | null;
  onFile: (f: File) => void;
  prompt?: string;
  onPrompt?: (p: string) => void;
  onNext: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [aiTab, setAiTab] = useState<"upload" | "prompt">("upload");
  const [promptText, setPromptText] = useState(prompt || "");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") onFile(f);
  };

  const hasData = file || (prompt && prompt.trim().length > 0);

  return (
    <TiltCard className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_40px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-1"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="flex w-full items-center justify-between p-4 pb-0 mb-4">
          <div className="flex bg-black/40 p-1 rounded-lg">
            <button 
              onClick={() => setAiTab("upload")} 
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${aiTab === "upload" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
            >
              Upload PDF
            </button>
            <button 
              onClick={() => setAiTab("prompt")} 
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${aiTab === "prompt" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
            >
              Use Prompt
            </button>
          </div>
        </div>

        {aiTab === "upload" ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            className="relative flex flex-col items-center gap-7 overflow-hidden rounded-[26px] px-8 py-12 transition-all duration-500"
            style={{
              background: dragging
                ? "radial-gradient(ellipse at center, oklch(0.72 0.24 300 / 0.2), transparent 70%)"
                : "radial-gradient(ellipse at center, oklch(0.72 0.24 300 / 0.07), transparent 70%)",
            }}
          >
            {/* Animated rotating dashed ring */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute inset-8 rounded-2xl" style={{ border: "1px dashed oklch(0.72 0.24 300 / 0.4)" }} />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute inset-16 rounded-xl" style={{ border: "1px dashed oklch(0.85 0.18 210 / 0.25)" }} />

            {/* Pulse glow */}
            <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3.5, repeat: Infinity }} className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.72 0.24 300 / 0.2), transparent 60%)", filter: "blur(20px)" }} />

            {/* Icon */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl" style={file ? { background: "oklch(0.75 0.2 150 / 0.15)", border: "1px solid oklch(0.75 0.2 150 / 0.45)", boxShadow: "0 0 40px oklch(0.75 0.2 150 / 0.3)" } : { background: "oklch(0.72 0.24 300 / 0.12)", border: "1px solid oklch(0.72 0.24 300 / 0.35)", boxShadow: "0 0 40px oklch(0.72 0.24 300 / 0.25)" }}>
              {file ? <CheckCircle2 size={40} style={{ color: "oklch(0.8 0.2 150)" }} /> : <FileText size={40} style={{ color: "oklch(0.85 0.2 300)" }} />}
            </motion.div>

            {/* Text */}
            <div className="relative z-10 text-center space-y-2">
              <h3 className="font-display text-2xl font-light tracking-tight text-white">{file ? file.name : "Drop your CV here"}</h3>
              <p className="text-sm text-white/40">{file ? `${(file.size / 1024).toFixed(0)} KB · PDF ready to process` : "PDF · Drag & drop or click to browse"}</p>
            </div>

            {/* Browse button */}
            <label className="relative z-10 cursor-pointer rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))", boxShadow: "0 0 30px oklch(0.72 0.24 300 / 0.45)" }}>
              {file ? "Replace file" : "Browse files"}
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
            </label>
          </div>
        ) : (
          <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[26px] px-8 py-12 transition-all duration-500">
            <div className="relative z-10 w-full text-center space-y-2 mb-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "oklch(0.72 0.24 300 / 0.15)", border: "1px solid oklch(0.72 0.24 300 / 0.4)", boxShadow: "0 0 20px oklch(0.72 0.24 300 / 0.3)" }}>
                <Wand2 size={28} style={{ color: "oklch(0.85 0.2 300)" }} />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-white mt-4">Write a Prompt</h3>
              <p className="text-sm text-white/50">Describe your role and the type of portfolio you want. AI will generate it from scratch.</p>
            </div>
            
            <div className="relative z-10 w-full">
              <textarea 
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  if (onPrompt) onPrompt(e.target.value);
                }}
                placeholder="e.g. I'm an embedded systems engineer with 5 years experience at Bosch. I build microcontrollers and IoT devices..."
                className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="px-8 pb-8 flex justify-center">
          {hasData && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onNext}
              id="upload-continue-btn"
              className="relative z-10 flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10 hover:text-white"
            >
              Continue to templates <ChevronRight size={16} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </TiltCard>
  );
}
