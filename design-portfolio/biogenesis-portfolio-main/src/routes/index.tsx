import { createFileRoute } from "@tanstack/react-router";
import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CellRepairViz, NeuralNetViz, WaveformViz } from "@/components/BioViz";

const DNAScene = lazy(() =>
  import("@/components/DNAScene").then((m) => ({ default: m.DNAScene })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helix Collective — The Future of Medicine, Personalized" },
      {
        name: "description",
        content:
          "A collective of physician-scientists advancing personalized medicine through genomics, cellular therapy, and computational biology.",
      },
      { property: "og:title", content: "Helix Collective — The Future of Medicine, Personalized" },
      {
        property: "og:description",
        content:
          "Physician-scientists advancing personalized medicine through genomics, cellular therapy, and computational biology.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const doctors = [
  {
    id: "aris-vahan",
    name: "Aris Vahan",
    title: "MD, PhD — Genomic Oncology",
    bio: "Pioneering CRISPR-guided immunotherapies that re-teach the body to recognize its own malfunctioning cells.",
    focus: ["Precision oncology", "CRISPR-Cas12", "Adoptive T-cell"],
    stat: "142 peer-reviewed",
    inst: "Karolinska · Stanford",
  },
  {
    id: "livia-chen",
    name: "Livia Chen",
    title: "MD — Regenerative Cardiology",
    bio: "Rebuilding cardiac tissue from induced pluripotent stem cells. First-in-human ventricular patch trials underway.",
    focus: ["iPSC therapy", "Bio-scaffolds", "Post-MI repair"],
    stat: "3 phase-II trials",
    inst: "Johns Hopkins",
  },
  {
    id: "noor-alavi",
    name: "Noor Alavi",
    title: "MD, MSc — Computational Neurology",
    bio: "Translating high-dimensional neural signals into early diagnostic signatures for neurodegenerative disease.",
    focus: ["fMRI foundation models", "Prodromal PD", "BCIs"],
    stat: "27 patents",
    inst: "ETH Zürich · UCSF",
  },
  {
    id: "kai-obermann",
    name: "Kai Obermann",
    title: "MD, PhD — Synthetic Immunology",
    bio: "Designing programmable antibodies that adapt in vivo to evolving pathogens and tumor escape mechanisms.",
    focus: ["Programmable Ab", "mRNA scaffolds", "Adaptive vaccines"],
    stat: "$48M funded",
    inst: "Max Planck · MIT",
  },
  {
    id: "sana-idris",
    name: "Sana Idris",
    title: "MD — Longevity & Cellular Aging",
    bio: "Targeting senescent cell reservoirs to extend healthspan without accelerating cancer risk.",
    focus: ["Senolytics", "Epigenetic clocks", "Mitochondrial rescue"],
    stat: "Cohort n=1,240",
    inst: "Buck Institute",
  },
];

function Nav() {
  const links = [
    ["Practice", "#practice"],
    ["Collective", "#collective"],
    ["Innovations", "#innovations"],
    ["Manifesto", "#manifesto"],
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-serif-display text-lg tracking-tight">
          <span className="relative inline-block h-6 w-6">
            <span className="absolute inset-0 rounded-full bg-cyan/30 blur-md" />
            <span className="absolute inset-1 rounded-full border border-cyan/70" />
            <span className="absolute inset-[9px] rounded-full bg-cyan animate-pulse-glow" />
          </span>
          <span className="text-glow-soft">Helix Collective</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-[13px] uppercase tracking-[0.22em] text-muted-foreground">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="hover:text-foreground transition-colors">
              {l}
            </a>
          ))}
        </nav>
        <a
          href="#consult"
          className="text-[12px] uppercase tracking-[0.24em] px-4 py-2.5 rounded-full border border-cyan/40 text-foreground hover:bg-cyan/10 transition-colors"
        >
          Request Consultation
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background 3D */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-[110vh] w-[110vh] max-w-none">
            <div className="absolute inset-0 rounded-full ring-orbit animate-pulse-glow" />
            <Suspense fallback={null}>
              <DNAScene />
            </Suspense>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-40 pb-24 w-full">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-cyan/80 mb-8">
          <span className="h-px w-10 bg-cyan/60" />
          Est. 2019 · A Physician-Scientist Collective
        </div>
        <h1 className="font-serif-display text-[clamp(3rem,9vw,9.5rem)] leading-[0.9] tracking-tight max-w-5xl">
          The Future of{" "}
          <span className="italic text-glow bg-gradient-to-b from-cyan-glow to-cyan bg-clip-text text-transparent">
            Medicine
          </span>
          , Personalized.
        </h1>
        <div className="mt-10 grid md:grid-cols-3 gap-10 max-w-5xl">
          <p className="md:col-span-2 text-lg text-muted-foreground leading-relaxed">
            Eleven physician-scientists working at the boundary of genomics, cellular
            engineering, and computational medicine. We treat one patient at a time — using
            biology written for them alone.
          </p>
          <div className="flex flex-col gap-3 text-sm">
            <a
              href="#collective"
              className="glass-panel rounded-xl px-5 py-4 flex items-center justify-between group"
            >
              <span className="uppercase tracking-[0.2em] text-xs">Meet the Collective</span>
              <span className="text-cyan group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#innovations"
              className="rounded-xl px-5 py-4 border border-border flex items-center justify-between group hover:border-cyan/40 transition-colors"
            >
              <span className="uppercase tracking-[0.2em] text-xs">See Research</span>
              <span className="text-cyan group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Vital stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl border-t border-border pt-8">
          {[
            ["11", "Physician-scientists"],
            ["3.2B", "Base-pairs sequenced / mo"],
            ["47", "Active clinical protocols"],
            ["0.01%", "Adverse event rate"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-serif-display text-4xl md:text-5xl text-glow-soft">{n}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 inset-x-0 border-y border-border/60 bg-background/40 backdrop-blur-md overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3 text-[11px] uppercase tracking-[0.36em] text-muted-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16 pr-16">
              {[
                "Nature Medicine",
                "The Lancet",
                "Cell",
                "NEJM",
                "Science Translational Medicine",
                "Karolinska",
                "Broad Institute",
                "Wellcome Trust",
              ].map((x) => (
                <span key={x}>◇ {x}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Practice() {
  const items = [
    {
      k: "01",
      t: "Diagnose in high dimension",
      d: "Whole-genome sequencing, single-cell transcriptomics, and longitudinal biomarker capture combined into one patient signature.",
    },
    {
      k: "02",
      t: "Design the intervention",
      d: "Bespoke therapeutic constructs — cell therapies, engineered antibodies, epigenetic reprogrammers — modeled in silico before manufacture.",
    },
    {
      k: "03",
      t: "Monitor at cellular resolution",
      d: "Continuous molecular telemetry replaces episodic follow-ups. Interventions adapt as your biology adapts.",
    },
  ];
  return (
    <section id="practice" className="relative py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-16 gap-8 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.32em] text-cyan/80 mb-4">
              — 01 / Practice
            </div>
            <h2 className="font-serif-display text-5xl md:text-7xl max-w-3xl leading-[0.95]">
              A protocol built <span className="italic text-glow-soft">from your genome</span>,
              not a diagnostic bin.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            We refuse the average patient. Every intervention originates from the specific
            biology in front of us — read, modeled, and answered.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.k}
              className="glass-panel rounded-2xl p-8 group hover:-translate-y-1 transition-transform"
            >
              <div className="font-mono-ui text-cyan text-xs tracking-[0.24em]">{it.k}</div>
              <h3 className="font-serif-display text-2xl mt-6 leading-tight">{it.t}</h3>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{it.d}</p>
              <div className="mt-8 h-px bg-gradient-to-r from-cyan/40 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Collective() {
  const [active, setActive] = useState<number | null>(0);
  const doc = active !== null ? doctors[active] : null;

  return (
    <section id="collective" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-20 gap-8 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.32em] text-cyan/80 mb-4">
              — 02 / The Collective
            </div>
            <h2 className="font-serif-display text-5xl md:text-7xl max-w-3xl leading-[0.95]">
              Eleven minds. One <span className="italic text-glow-soft">living</span> practice.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Hover a name. The cell shifts to reveal the physician working inside it.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-14 items-center">
          {/* Left: 3D reactive to hover */}
          <div className="relative aspect-square max-w-[560px] mx-auto w-full">
            <div className="absolute inset-0 rounded-full ring-orbit" />
            <div
              className="absolute inset-6 rounded-full border border-cyan/20"
              style={{ transform: `rotate(${(active ?? 0) * 12}deg)`, transition: "transform 800ms cubic-bezier(.2,.8,.2,1)" }}
            />
            <div className="absolute inset-0">
              <Suspense fallback={null}>
                <DNAScene
                  zoom={active !== null ? 1.35 : 1}
                  tilt={active !== null ? active * 0.15 - 0.2 : 0}
                />
              </Suspense>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-cyan animate-pulse" />
              Cell viewer · live
            </div>
          </div>

          {/* Right: index + card */}
          <div className="relative">
            <ol className="divide-y divide-border">
              {doctors.map((d, i) => (
                <li
                  key={d.id}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative"
                >
                  <button
                    className="w-full py-5 flex items-baseline gap-6 text-left"
                    tabIndex={0}
                  >
                    <span className="font-mono-ui text-xs text-cyan/70 w-8">
                      0{i + 1}
                    </span>
                    <span
                      className={`font-serif-display text-3xl md:text-5xl transition-all duration-500 ${
                        active === i
                          ? "text-foreground text-glow translate-x-3"
                          : "text-muted-foreground/60 group-hover:text-foreground/80"
                      }`}
                    >
                      {d.name}
                    </span>
                    <span
                      className={`ml-auto text-[10px] uppercase tracking-[0.28em] transition-opacity ${
                        active === i ? "opacity-100 text-cyan" : "opacity-0"
                      }`}
                    >
                      {d.inst}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-10 min-h-[220px] relative">
              <AnimatePresence mode="wait">
                {doc && (
                  <motion.article
                    key={doc.id}
                    initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                    transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                    className="glass-panel rounded-2xl p-8"
                  >
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                      <span>{doc.title}</span>
                      <span className="text-cyan">{doc.stat}</span>
                    </div>
                    <p className="mt-5 font-serif-display text-2xl leading-snug">
                      {doc.bio.split(" ").map((w, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.02, duration: 0.4 }}
                          className="inline-block mr-[0.28em]"
                        >
                          {w}
                        </motion.span>
                      ))}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {doc.focus.map((f) => (
                        <span
                          key={f}
                          className="text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-cyan/30 text-cyan/90"
                        >
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
  );
}

function Innovations() {
  const cards = [
    {
      tag: "Cellular",
      title: "Programmed senescence clearance",
      desc: "A gated senolytic that only activates inside cells expressing three concurrent aging markers — sparing healthy tissue.",
      viz: <CellRepairViz />,
      metric: "−38%",
      metricLabel: "biological age markers, 12mo cohort",
    },
    {
      tag: "Computational",
      title: "Foundation model for onco-signatures",
      desc: "Trained on 4.1M tumor transcriptomes. Predicts response to eleven therapy classes in under 90 seconds.",
      viz: <NeuralNetViz />,
      metric: "0.94",
      metricLabel: "AUC across held-out solid tumors",
    },
    {
      tag: "Molecular",
      title: "Adaptive antibody circuits",
      desc: "Self-tuning biologics that re-fold in response to circulating antigen shifts — one dose, seasons of coverage.",
      viz: <WaveformViz />,
      metric: "1×",
      metricLabel: "dose. 9-month protection window",
    },
  ];
  return (
    <section id="innovations" className="relative py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-20 gap-8 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.32em] text-cyan/80 mb-4">
              — 03 / Innovations
            </div>
            <h2 className="font-serif-display text-5xl md:text-7xl max-w-3xl leading-[0.95]">
              Living systems, <span className="italic text-glow-soft">visualized</span>.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Three of the seventeen research programs currently in translation across the
            collective.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <article
              key={c.title}
              className="glass-panel rounded-3xl p-6 flex flex-col group hover:-translate-y-1 transition-transform"
            >
              <div className="aspect-square rounded-2xl bg-background/40 border border-border/60 overflow-hidden relative">
                {c.viz}
                <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.28em] text-cyan/80 font-mono-ui">
                  {c.tag}
                </div>
              </div>
              <h3 className="font-serif-display text-2xl mt-6 leading-tight">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1">
                {c.desc}
              </p>
              <div className="mt-6 pt-6 border-t border-border/60 flex items-baseline justify-between">
                <span className="font-serif-display text-4xl text-glow-soft">{c.metric}</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground text-right max-w-[55%]">
                  {c.metricLabel}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section id="manifesto" className="relative py-40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="text-[11px] uppercase tracking-[0.32em] text-cyan/80 mb-6">
          — 04 / Manifesto
        </div>
        <p className="font-serif-display text-3xl md:text-5xl leading-[1.15]">
          <span className="text-muted-foreground/70">Medicine has treated us as populations.</span>{" "}
          We are returning it to what it always was —{" "}
          <span className="italic text-glow">a conversation with one body at a time.</span>
        </p>
        <div className="mt-14 flex justify-center gap-4 flex-wrap">
          <a
            id="consult"
            href="#"
            className="px-8 py-4 rounded-full bg-cyan text-primary-foreground text-sm uppercase tracking-[0.28em] hover:bg-cyan-glow transition-colors"
          >
            Request a consultation
          </a>
          <a
            href="#"
            className="px-8 py-4 rounded-full border border-border text-sm uppercase tracking-[0.28em] hover:border-cyan/50 transition-colors"
          >
            Read the white paper
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-14">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-10 text-sm">
        <div className="md:col-span-2">
          <div className="font-serif-display text-2xl text-glow-soft">Helix Collective</div>
          <p className="text-muted-foreground mt-3 max-w-md">
            A physician-scientist practice registered in Stockholm and Boston. Clinical
            programs operated under IRB-approved protocols.
          </p>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4">
            Practice
          </div>
          <ul className="space-y-2">
            <li>Stockholm · Grev Turegatan</li>
            <li>Boston · Longwood</li>
            <li>Remote genomic intake</li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4">
            Contact
          </div>
          <ul className="space-y-2">
            <li>collective@helix.md</li>
            <li>+46 8 000 00 00</li>
            <li>Press · press@helix.md</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-12 pt-6 border-t border-border/60 flex justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground flex-wrap gap-3">
        <span>© 2026 Helix Collective AB</span>
        <span>All patient data encrypted at rest — HIPAA / GDPR</span>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="relative min-h-screen text-foreground selection:bg-cyan/30">
      <Nav />
      <main>
        <Hero />
        <Practice />
        <Collective />
        <Innovations />
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}
