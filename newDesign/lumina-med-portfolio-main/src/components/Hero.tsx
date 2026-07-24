import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { ClientOnly } from "./ClientOnly";

const DnaScene = lazy(() => import("./DnaScene"));

export function Hero() {
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden">
      <div className="absolute inset-0 pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,oklch(0.6_0.05_240/0.08)_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/70 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-muted-foreground shadow-soft"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-azure animate-pulse" />
            Now accepting new patients · 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 font-display text-5xl md:text-7xl leading-[1.02] text-foreground"
          >
            The quiet precision of{" "}
            <span className="text-gradient-azure italic">modern medicine.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
          >
            Two decades at the intersection of cardiothoracic surgery, regenerative
            science, and human-centered care. Fellow of the American College of Surgeons.
            Research faculty, Johns Hopkins.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-azure-deep to-azure px-7 py-3.5 text-sm text-primary-foreground shadow-glow hover:shadow-elevate transition-shadow"
            >
              Book a consultation
              <span aria-hidden>→</span>
            </a>
            <a href="#expertise" className="text-sm text-foreground/80 hover:text-foreground border-b border-border pb-0.5">
              Explore expertise
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg"
          >
            {[
              ["21", "Years practicing"],
              ["3,400+", "Procedures led"],
              ["42", "Peer-reviewed papers"],
            ].map(([k, v]) => (
              <div key={v as string}>
                <dt className="font-display text-3xl text-foreground">{k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square w-full max-w-[620px] mx-auto"
        >
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-azure-soft/60 to-transparent blur-3xl" />
          <div className="absolute inset-0 rounded-[2rem]">
            <ClientOnly fallback={<div className="h-full w-full rounded-[2rem] bg-card/40" />}>
              <Suspense fallback={<div className="h-full w-full rounded-[2rem] bg-card/40" />}>
                <DnaScene />
              </Suspense>
            </ClientOnly>
          </div>
          <div className="pointer-events-none absolute inset-x-8 bottom-8 flex justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span>Helix · 03</span>
            <span>Regenerative Lab</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
