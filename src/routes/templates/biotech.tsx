import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/templates/biotech")({
  component: BiotechTemplate,
});

const doctors = [
  { id: "aris-vahan",   name: "Aris Vahan",    title: "MD, PhD — Genomic Oncology",        bio: "Pioneering CRISPR-guided immunotherapies that re-teach the body to recognize its own malfunctioning cells.", focus: ["Precision oncology","CRISPR-Cas12","Adoptive T-cell"], stat: "142 peer-reviewed", inst: "Karolinska · Stanford" },
  { id: "livia-chen",   name: "Livia Chen",    title: "MD — Regenerative Cardiology",       bio: "Rebuilding cardiac tissue from induced pluripotent stem cells. First-in-human ventricular patch trials underway.", focus: ["iPSC therapy","Bio-scaffolds","Post-MI repair"],    stat: "3 phase-II trials", inst: "Johns Hopkins" },
  { id: "noor-alavi",   name: "Noor Alavi",    title: "MD, MSc — Computational Neurology",  bio: "Translating high-dimensional neural signals into early diagnostic signatures for neurodegenerative disease.", focus: ["fMRI foundation models","Prodromal PD","BCIs"],       stat: "27 patents",        inst: "ETH Zürich · UCSF" },
  { id: "kai-obermann", name: "Kai Obermann",  title: "MD, PhD — Synthetic Immunology",     bio: "Designing programmable antibodies that adapt in vivo to evolving pathogens and tumor escape mechanisms.", focus: ["Programmable Ab","mRNA scaffolds","Adaptive vaccines"], stat: "$48M funded",       inst: "Max Planck · MIT" },
  { id: "sana-idris",   name: "Sana Idris",    title: "MD — Longevity & Cellular Aging",    bio: "Targeting senescent cell reservoirs to extend healthspan without accelerating cancer risk.", focus: ["Senolytics","Epigenetic clocks","Mitochondrial rescue"], stat: "Cohort n=1,240",   inst: "Buck Institute" },
];

const CYAN = "#22d3ee";

/* ── Animated DNA orb (replaces Three.js DNAScene) ── */
function DNAOrb({ size = 320 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 320 320" className="opacity-80">
      <defs>
        <radialGradient id="dna-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CYAN} stopOpacity="0.3" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={160} cy={160} r={155} fill="url(#dna-glow)" />
      <circle cx={160} cy={160} r={155} fill="none" stroke={CYAN} strokeOpacity="0.15" strokeWidth="1" />
      <circle cx={160} cy={160} r={120} fill="none" stroke={CYAN} strokeOpacity="0.1" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x1 = 160 + Math.cos(angle) * 90;
        const y1 = 160 + Math.sin(angle) * 90;
        const x2 = 160 + Math.cos(angle + Math.PI) * 90;
        const y2 = 160 + Math.sin(angle + Math.PI) * 90;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={CYAN} strokeOpacity="0.1" strokeWidth="0.5" />
            <circle cx={x1} cy={y1} r={3} fill={CYAN} fillOpacity="0.4" />
          </g>
        );
      })}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={160 + Math.cos((i / 6) * Math.PI * 2) * 50} cy={160 + Math.sin((i / 6) * Math.PI * 2) * 50}
          r={5} fill={CYAN} fillOpacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function BiotechTemplate() {
  const [active, setActive] = useState<number | null>(0);
  const doc = active !== null ? doctors[active] : null;

  return (
    <div className="relative min-h-screen text-white" style={{ background: "#03080f", fontFamily: "'Inter', sans-serif", selection: "background: rgba(34,211,238,0.3)" }}>
      {/* Grid bg */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Back link */}
      <Link to="/portfolio-builder" className="fixed left-4 top-4 z-50 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 backdrop-blur transition hover:text-white">← Builder</Link>

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="relative inline-block h-6 w-6">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: `${CYAN}30` }} />
              <span className="absolute inset-1 rounded-full border" style={{ borderColor: `${CYAN}70` }} />
              <span className="absolute inset-[9px] rounded-full" style={{ background: CYAN }} />
            </span>
            <span style={{ color: CYAN }}>Helix</span> Collective
          </a>
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-white/50">
            {[["Practice","#practice"],["Collective","#collective"],["Innovations","#innovations"]].map(([l,h]) => (
              <a key={l} href={h} className="hover:text-white transition-colors">{l}</a>
            ))}
          </nav>
          <a href="#consult" className="text-xs uppercase tracking-widest px-4 py-2.5 rounded-full border text-white hover:bg-white/10 transition-colors" style={{ borderColor: `${CYAN}40` }}>
            Request Consultation
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex items-center overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30">
          <DNAOrb size={600} />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[#03080f]" />

        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest mb-8" style={{ color: `${CYAN}cc` }}>
            <span className="h-px w-10" style={{ background: CYAN }} />
            Est. 2019 · A Physician-Scientist Collective
          </div>
          <h1 className="text-[clamp(3rem,9vw,9.5rem)] leading-[0.9] tracking-tight font-bold max-w-5xl">
            The Future of{" "}
            <span className="italic" style={{ color: CYAN }}>Medicine</span>, Personalized.
          </h1>
          <div className="mt-10 grid md:grid-cols-3 gap-10 max-w-5xl">
            <p className="md:col-span-2 text-lg text-white/60 leading-relaxed">
              Eleven physician-scientists working at the boundary of genomics, cellular engineering, and computational medicine.
            </p>
          </div>
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            {[["11","Physician-scientists"],["3.2B","Base-pairs sequenced / mo"],["47","Active clinical protocols"],["0.01%","Adverse event rate"]].map(([n,l]) => (
              <div key={l}>
                <div className="text-5xl font-bold" style={{ color: CYAN }}>{n}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/40">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIVE */}
      <section id="collective" className="relative py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-20 gap-8 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-widest mb-4" style={{ color: CYAN }}>— 02 / The Collective</div>
              <h2 className="text-5xl md:text-7xl font-bold leading-[0.95]">
                Five minds. One <em className="italic font-light" style={{ color: CYAN }}>living</em> practice.
              </h2>
            </div>
          </div>
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-14 items-center">
            {/* DNA orb */}
            <div className="relative aspect-square max-w-[400px] mx-auto w-full flex items-center justify-center">
              <DNAOrb size={400} />
            </div>
            {/* Doctors list */}
            <div className="relative">
              <ol className="divide-y" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                {doctors.map((d, i) => (
                  <li key={d.id} onMouseEnter={() => setActive(i)} className="group relative">
                    <button className="w-full py-5 flex items-baseline gap-6 text-left" tabIndex={0}>
                      <span className="text-xs font-mono w-8" style={{ color: `${CYAN}99` }}>0{i + 1}</span>
                      <span className={`text-3xl md:text-5xl font-bold transition-all duration-500 ${active === i ? "translate-x-3" : "text-white/40 group-hover:text-white/70"}`}
                        style={active === i ? { color: CYAN } : {}}>
                        {d.name}
                      </span>
                      <span className={`ml-auto text-xs uppercase tracking-widest transition-opacity ${active === i ? "opacity-100" : "opacity-0"}`} style={{ color: CYAN }}>
                        {d.inst}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="mt-10 min-h-[200px]">
                <AnimatePresence mode="wait">
                  {doc && (
                    <motion.article key={doc.id}
                      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.55 }}
                      className="rounded-2xl p-8 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: `${CYAN}20` }}>
                      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40">
                        <span>{doc.title}</span>
                        <span style={{ color: CYAN }}>{doc.stat}</span>
                      </div>
                      <p className="mt-5 text-2xl font-light leading-snug">{doc.bio}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {doc.focus.map((f) => (
                          <span key={f} className="text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border" style={{ borderColor: `${CYAN}30`, color: `${CYAN}cc` }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </motion.article>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative py-40">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-widest mb-6" style={{ color: CYAN }}>— Manifesto</div>
          <p className="text-3xl md:text-5xl font-light leading-[1.15]">
            <span className="text-white/50">Medicine has treated us as populations.</span>{" "}
            We are returning it to what it always was —{" "}
            <em className="italic" style={{ color: CYAN }}>a conversation with one body at a time.</em>
          </p>
          <div className="mt-14 flex justify-center gap-4 flex-wrap">
            <a id="consult" href="#" className="px-8 py-4 rounded-full text-sm uppercase tracking-widest text-black font-bold transition-opacity hover:opacity-90" style={{ background: CYAN }}>
              Request a consultation
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-14" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="mx-auto max-w-7xl px-6 flex justify-between text-xs uppercase tracking-widest text-white/30 flex-wrap gap-3">
          <span>© 2026 Helix Collective AB</span>
          <span>All patient data encrypted at rest — HIPAA / GDPR</span>
        </div>
      </footer>
    </div>
  );
}
