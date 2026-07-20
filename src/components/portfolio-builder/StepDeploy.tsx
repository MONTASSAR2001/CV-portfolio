import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Loader2, CheckCircle2, AlertCircle, ExternalLink, Copy, Lock } from "lucide-react";
import type { PortfolioContent } from "./types";

export function StepDeploy({
  content, isDeploying, saving, saved, deployedUrl, deployError, onDeploy,
}: {
  content: PortfolioContent | null; isDeploying: boolean; saving: boolean;
  saved: boolean; deployedUrl: string | null; deployError: string | null;
  onDeploy: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const locked = !content;

  const copyUrl = () => {
    if (!deployedUrl) return;
    navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-light tracking-tight text-white">Launch</h2>
        <p className="text-sm text-white/40">One click to push your portfolio live on the global edge</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl" style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
        {/* Glow */}
        <motion.div animate={{ opacity: isDeploying ? [0.3, 0.8, 0.3] : 0.25 }} transition={{ duration: 2, repeat: isDeploying ? Infinity : 0 }}
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.85 0.18 210 / 0.25), transparent 70%)" }} />

        <div className="relative z-10 flex flex-col items-center gap-7">
          {/* Success URL card */}
          <AnimatePresence>
            {deployedUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px oklch(0.75 0.2 150)" }} />
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Live · Global Edge</span>
                </div>
                <div className="flex items-center gap-2">
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 truncate rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-xs text-white/80 transition hover:text-white">
                    {deployedUrl}
                  </a>
                  <button onClick={copyUrl} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white">
                    {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white">
                    <ExternalLink size={14} />
                  </a>
                </div>
                {saved && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400/70">
                    <CheckCircle2 size={12} /> Saved to your dashboard
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {deployError && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex w-full items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-rose-400" />
                <p className="text-sm text-rose-300">{deployError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status line */}
          {saving && !saved && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-white/40">
              <Loader2 size={12} className="animate-spin" /> Saving to your dashboard…
            </motion.div>
          )}

          {/* CTA */}
          <motion.button
            id="deploy-btn"
            whileHover={!locked && !isDeploying && !deployedUrl ? { scale: 1.04 } : {}}
            whileTap={!locked && !isDeploying && !deployedUrl ? { scale: 0.97 } : {}}
            onClick={onDeploy}
            disabled={locked || isDeploying || !!deployedUrl}
            className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-display text-base font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: deployedUrl
                ? "oklch(1 0 0 / 0.06)"
                : "linear-gradient(135deg, oklch(0.72 0.24 210), oklch(0.85 0.18 270))",
              boxShadow: isDeploying ? "0 0 60px oklch(0.72 0.24 210 / 0.55)" : deployedUrl ? "none" : "0 0 40px oklch(0.72 0.24 210 / 0.35)",
              border: deployedUrl ? "1px solid oklch(1 0 0 / 0.1)" : "none",
            }}
          >
            {locked ? (
              <><Lock size={16} />Generate first</>
            ) : isDeploying ? (
              <><Loader2 size={16} className="animate-spin" />Deploying to edge…</>
            ) : deployedUrl ? (
              <><CheckCircle2 size={16} />Deployed successfully</>
            ) : (
              <><Rocket size={16} />Deploy live now</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
