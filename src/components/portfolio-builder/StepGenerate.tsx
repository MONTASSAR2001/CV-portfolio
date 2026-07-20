import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, AlertCircle, CheckCircle2, Cpu } from "lucide-react";

export function StepGenerate({
  hasFile, loading, stage, error, done, onGenerate, onNext,
}: {
  hasFile: boolean; loading: boolean; stage: string; error: string | null;
  done: boolean; onGenerate: () => void; onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-light tracking-tight text-white">AI Generation</h2>
        <p className="text-sm text-white/40">Our agent crafts your portfolio narrative from your CV</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl" style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
        <motion.div animate={{ opacity: loading ? [0.3, 0.7, 0.3] : 0.3 }} transition={{ duration: 2.5, repeat: loading ? Infinity : 0 }}
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.72 0.24 300 / 0.2), transparent 70%)" }} />

        <div className="relative z-10 flex flex-col items-center gap-7">
          <div className="relative">
            <motion.div
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 3, repeat: loading ? Infinity : 0, ease: "linear" }}
              className="flex h-24 w-24 items-center justify-center rounded-3xl"
              style={done
                ? { background: "oklch(0.75 0.2 150 / 0.15)", border: "1px solid oklch(0.75 0.2 150 / 0.4)", boxShadow: "0 0 40px oklch(0.75 0.2 150 / 0.3)" }
                : { background: "oklch(0.72 0.24 300 / 0.12)", border: "1px solid oklch(0.72 0.24 300 / 0.35)", boxShadow: loading ? "0 0 60px oklch(0.72 0.24 300 / 0.45)" : "0 0 30px oklch(0.72 0.24 300 / 0.2)" }}
            >
              {done ? <CheckCircle2 size={40} style={{ color: "oklch(0.8 0.2 150)" }} />
                : loading ? <Cpu size={36} style={{ color: "oklch(0.85 0.2 300)" }} />
                : <Sparkles size={36} style={{ color: "oklch(0.85 0.2 300)" }} />}
            </motion.div>
            {loading && (
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute -inset-3 rounded-[28px]"
                style={{ border: "1px dashed oklch(0.72 0.24 300 / 0.35)" }} />
            )}
          </div>

          <div className="text-center min-h-[48px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {loading && stage && (
                <motion.div key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-white/40" />
                  <span className="text-sm text-white/60">{stage}</span>
                </motion.div>
              )}
              {done && <motion.p key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-white/70">Portfolio content generated ✓</motion.p>}
              {!loading && !done && !error && <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/40">Ready to generate</motion.p>}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex w-full items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-rose-400" />
                <p className="text-sm text-rose-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex w-full flex-col gap-3">
            {!done ? (
              <motion.button id="generate-btn" whileHover={!loading && hasFile ? { scale: 1.03 } : {}} whileTap={!loading && hasFile ? { scale: 0.97 } : {}}
                onClick={onGenerate} disabled={loading || !hasFile}
                className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-display text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))", boxShadow: loading ? "0 0 60px oklch(0.72 0.24 300 / 0.55)" : "0 0 40px oklch(0.72 0.24 300 / 0.35)" }}>
                {loading ? <><Loader2 size={16} className="animate-spin" />Generating…</> : <><Sparkles size={16} />{error ? "Retry" : "Generate portfolio"}</>}
              </motion.button>
            ) : (
              <motion.button id="generate-next-btn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onNext}
                className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-display text-base font-semibold text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.75 0.2 150), oklch(0.72 0.24 210))", boxShadow: "0 0 40px oklch(0.75 0.2 150 / 0.35)" }}>
                <CheckCircle2 size={16} />Preview & Deploy
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
