import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TEMPLATES } from "./types";
import { TiltCard } from "./StepUpload";

export function StepTemplate({
  selected,
  setSelected,
  onNext,
}: {
  selected: string;
  setSelected: (id: string) => void;
  onNext: () => void;
}) {
  const active = TEMPLATES.find((t) => t.id === selected) ?? TEMPLATES[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-light tracking-tight text-white">
          Choose your aesthetic
        </h2>
        <p className="text-sm text-white/40">
          Each template shapes the AI's voice and visual identity
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-3">
        {TEMPLATES.map((t, i) => {
          const isSel = t.id === selected;
          return (
            <TiltCard key={t.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                onClick={() => setSelected(t.id)}
                className="relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500"
                style={{
                  boxShadow: isSel
                    ? `0 20px 60px oklch(0.75 0.22 ${t.hue} / 0.45)`
                    : "0 8px 24px rgba(0,0,0,0.4)",
                  border: isSel
                    ? `1px solid oklch(0.75 0.22 ${t.hue} / 0.7)`
                    : "1px solid oklch(1 0 0 / 0.08)",
                }}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.label}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, oklch(0.08 0.02 ${t.hue}), oklch(0.08 0.02 ${t.hue} / 0.3) 50%, transparent)`,
                    }}
                  />
                  {isSel && (
                    <motion.div
                      layoutId="tpl-overlay"
                      className="absolute inset-0"
                      style={{
                        background: `oklch(0.75 0.22 ${t.hue} / 0.25)`,
                      }}
                    />
                  )}
                  {/* Check badge */}
                  {isSel && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: `oklch(0.75 0.22 ${t.hue})` }}
                    >
                      <CheckCircle2 size={11} className="text-white" />
                    </motion.div>
                  )}
                  {/* External preview link */}
                  <Link
                    to={`/templates/${t.id}` as "/templates/vogue"}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/60 backdrop-blur transition hover:text-white"
                  >
                    <ExternalLink size={10} />
                  </Link>
                </div>

                <div className="bg-black/60 p-3 backdrop-blur-sm">
                  <p className="text-xs font-bold text-white">{t.label}</p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-wider text-white/40">
                    {t.tag}
                  </p>
                </div>
              </motion.div>
            </TiltCard>
          );
        })}
      </div>

      {/* Selected info bar */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur"
        style={{ borderColor: `oklch(0.75 0.22 ${active.hue} / 0.3)` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: `oklch(0.75 0.22 ${active.hue})`,
              boxShadow: `0 0 10px oklch(0.75 0.22 ${active.hue})`,
            }}
          />
          <p className="text-sm text-white/70">
            <span className="font-semibold text-white">{active.label}</span> ·{" "}
            <span className="italic text-white/50">{active.tag}</span>
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <div className="flex justify-center">
        <motion.button
          id="template-generate-btn"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="flex items-center gap-3 rounded-2xl px-10 py-4 font-display text-base font-semibold text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))",
            boxShadow: "0 0 50px oklch(0.72 0.24 300 / 0.4)",
          }}
        >
          <Sparkles size={17} />
          Generate with {active.label}
        </motion.button>
      </div>
    </motion.div>
  );
}
