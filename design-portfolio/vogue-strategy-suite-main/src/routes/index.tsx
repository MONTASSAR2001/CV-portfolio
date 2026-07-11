import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import portrait from "@/assets/portrait.jpg";
import case1 from "@/assets/case-1.jpg";
import case2 from "@/assets/case-2.jpg";
import case3 from "@/assets/case-3.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------- SVG filters for the WebGL-style silk distortion ---------- */
function SilkFilters() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden>
      <defs>
        <filter id="silk-distort">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="6" />
        </filter>
        <filter id="silk-distort-active">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.02" numOctaves="2" seed="7">
            <animate attributeName="baseFrequency" dur="8s" values="0.014 0.02;0.02 0.014;0.014 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="26" />
        </filter>
      </defs>
    </svg>
  );
}

/* ---------- Silk image with hover distortion ---------- */
function SilkImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover silk-image ${hover ? "silk-image-hover" : ""}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.04_155/0.35)] via-transparent to-transparent" />
    </div>
  );
}

/* ---------- Curtain-reveal section wrapper ---------- */
function Curtain({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ y: "12%", opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ boxShadow: "0 -30px 60px -30px oklch(0.18 0.04 155 / 0.25)" }}
      className={`relative bg-background ${className ?? ""}`}
    >
      {children}
    </motion.section>
  );
}

/* ---------- Page ---------- */
function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SilkFilters />

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          <a href="#" className="text-display text-xl tracking-tight">
            Maison<span className="italic text-[color:var(--champagne)]"> Vaillant</span>
          </a>
          <nav className="hidden gap-10 md:flex">
            {["Practice", "Portfolio", "Perspective", "Studio"].map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} className="text-eyebrow text-foreground/70 hover:text-foreground transition-colors">
                {n}
              </a>
            ))}
          </nav>
          <a href="#contact" className="text-eyebrow rounded-full border border-foreground/30 px-5 py-2.5 hover:bg-foreground hover:text-background transition-all">
            Enquire
          </a>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[110vh] overflow-hidden pt-32 grain">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-6 px-6 md:px-12">
          <div className="col-span-12 md:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-eyebrow text-foreground/60"
            >
              Bespoke Advisory · Est. MMXVI · Zürich / New York
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-display mt-8 text-[clamp(3.5rem,10vw,10rem)]"
            >
              Strategy<br />
              <span className="italic text-[color:var(--champagne)]">for the next</span><br />
              century.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-14 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm"
            >
              <div className="h-px w-16 self-center bg-foreground/40" />
              <p className="text-foreground/70 leading-relaxed">
                I counsel founders, funds, and family offices at the intersection of capital, culture, and code — turning quiet conviction into enduring positions.
              </p>
            </motion.div>
          </div>

          <motion.div
            style={{ y: heroY, scale: heroScale }}
            className="col-span-12 md:col-span-5 md:mt-6"
          >
            <div className="relative aspect-[4/5] w-full">
              <SilkImage src={portrait} alt="Portrait of Elena Vaillant" className="h-full w-full rounded-sm" />
              <div className="absolute -bottom-4 -left-4 rounded-sm bg-background px-4 py-3 shadow-[var(--shadow-elegant)]">
                <p className="text-eyebrow text-foreground/60">Principal</p>
                <p className="text-display text-xl italic">Elena Vaillant</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* marquee */}
        <div className="mt-24 overflow-hidden border-y border-foreground/10 py-6">
          <div className="marquee-track flex whitespace-nowrap text-display text-4xl md:text-6xl">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-16 px-8">
                {["Capital Formation", "· ", "Governance", "· ", "Narrative", "· ", "Onchain Treasury", "· ", "Brand Architecture", "· "].map((w, j) => (
                  <span key={j} className={j % 2 ? "text-[color:var(--champagne)]" : "italic"}>{w}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRACTICE — first curtain */}
      <Curtain className="rounded-t-[2rem] px-6 pt-28 pb-32 md:px-12 md:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <div id="practice" className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className="text-eyebrow text-foreground/60">01 — Practice</p>
              <h2 className="text-display mt-6 text-5xl md:text-7xl">
                A quiet<br /><em className="text-[color:var(--champagne)]">atelier</em><br />of counsel.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-10">
              {[
                { k: "I", t: "Capital Architecture", d: "Term sheets, cap tables, and treasury design for founders raising Series A through pre-IPO. Onchain and off." },
                { k: "II", t: "Narrative & Positioning", d: "Editorial-grade brand and comms strategy. The story your company tells before you enter the room." },
                { k: "III", t: "Governance Design", d: "Boards, DAOs, and family constitutions engineered for the second and third generations of stewardship." },
              ].map((s) => (
                <div key={s.k} className="group grid grid-cols-[auto_1fr] gap-8 border-t border-foreground/15 pt-8">
                  <span className="text-display text-3xl italic text-[color:var(--champagne)]">{s.k}</span>
                  <div>
                    <h3 className="text-display text-3xl md:text-4xl">{s.t}</h3>
                    <p className="mt-4 max-w-lg text-foreground/70 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Curtain>

      {/* PORTFOLIO */}
      <Curtain className="rounded-t-[2rem] bg-[color:var(--forest)] text-[color:var(--cream)] px-6 pt-28 pb-32 md:px-12 md:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <div id="portfolio" className="flex items-end justify-between border-b border-[color:var(--cream)]/20 pb-10">
            <div>
              <p className="text-eyebrow text-[color:var(--cream)]/60">02 — Selected work</p>
              <h2 className="text-display mt-4 text-5xl md:text-7xl">Portfolio.</h2>
            </div>
            <p className="hidden max-w-sm text-sm text-[color:var(--cream)]/70 md:block">
              A discreet selection. Full case studies available upon written request under NDA.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-12 gap-6">
            {[
              { img: case1, tag: "Series C · Fintech", title: "Havre Capital", year: "2025", note: "Repositioned a private bank for a digital-native clientele. €4.2B AUM within eighteen months." },
              { img: case2, tag: "IPO Advisory · Luxury", title: "Maison Aubade", year: "2024", note: "Guided a fourth-generation atelier to a listing on Euronext Paris at a 38× multiple." },
              { img: case3, tag: "DAO Treasury · Web3", title: "Verdant Protocol", year: "2024", note: "Designed governance and treasury framework for a $180M onchain endowment." },
            ].map((c, i) => (
              <article key={c.title} className={`group col-span-12 md:col-span-6 ${i === 2 ? "md:col-span-12 md:mt-8" : ""}`}>
                <div className={`relative ${i === 2 ? "aspect-[21/9]" : "aspect-[4/5]"}`}>
                  <SilkImage src={c.img} alt={c.title} className="h-full w-full rounded-sm" />
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-eyebrow text-[color:var(--champagne)]">{c.tag}</p>
                    <h3 className="text-display mt-3 text-3xl md:text-5xl italic">{c.title}</h3>
                    <p className="mt-3 max-w-md text-[color:var(--cream)]/70">{c.note}</p>
                  </div>
                  <span className="text-display shrink-0 text-2xl text-[color:var(--cream)]/50">{c.year}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Curtain>

      {/* PERSPECTIVE */}
      <Curtain className="rounded-t-[2rem] px-6 pt-28 pb-32 md:px-12 md:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <div id="perspective" className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-5">
              <p className="text-eyebrow text-foreground/60">03 — Perspective</p>
              <h2 className="text-display mt-6 text-5xl md:text-7xl">
                Field notes,<br /><em className="text-[color:var(--champagne)]">not</em> content.
              </h2>
              <p className="mt-8 max-w-md text-foreground/70">
                A slow quarterly dispatch. Read by roughly nine hundred operators, allocators, and stewards.
              </p>
              <a href="#" className="text-eyebrow mt-10 inline-block border-b border-foreground pb-1">Subscribe →</a>
            </div>
            <ul className="col-span-12 md:col-span-6 md:col-start-7 divide-y divide-foreground/15">
              {[
                { n: "N° 14", t: "On the vanishing centre of taste", d: "Winter 2025" },
                { n: "N° 13", t: "Sovereign wealth, softly", d: "Autumn 2025" },
                { n: "N° 12", t: "The onchain family office", d: "Summer 2025" },
                { n: "N° 11", t: "What Hermès knows that Silicon Valley forgot", d: "Spring 2025" },
              ].map((e) => (
                <li key={e.n} className="group flex items-baseline justify-between gap-6 py-8 transition-all hover:pl-4">
                  <div className="flex items-baseline gap-6">
                    <span className="text-eyebrow text-[color:var(--champagne)]">{e.n}</span>
                    <span className="text-display text-2xl md:text-4xl italic">{e.t}</span>
                  </div>
                  <span className="text-eyebrow text-foreground/50">{e.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Curtain>

      {/* CONTACT */}
      <Curtain className="rounded-t-[2rem] bg-[color:var(--forest-deep)] text-[color:var(--cream)] px-6 pt-28 pb-16 md:px-12 md:pt-40">
        <div id="contact" className="mx-auto max-w-[1600px]">
          <p className="text-eyebrow text-[color:var(--cream)]/60">04 — Enquiries</p>
          <h2 className="text-display mt-6 text-6xl md:text-[9rem]">
            Begin a<br /><em className="text-[color:var(--champagne)]">conversation</em>.
          </h2>
          <div className="mt-16 grid grid-cols-12 gap-8 border-t border-[color:var(--cream)]/20 pt-12">
            <div className="col-span-12 md:col-span-4">
              <p className="text-eyebrow text-[color:var(--cream)]/60">By post</p>
              <p className="mt-3 leading-relaxed">Bahnhofstrasse 42<br />8001 Zürich, CH</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <p className="text-eyebrow text-[color:var(--cream)]/60">Direct</p>
              <p className="text-display mt-3 text-2xl italic">elena@vaillant.co</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <p className="text-eyebrow text-[color:var(--cream)]/60">Discretion</p>
              <p className="mt-3 text-[color:var(--cream)]/70">All engagements begin under mutual NDA. Retainers commence quarterly.</p>
            </div>
          </div>

          <div className="mt-32 flex flex-col items-start justify-between gap-6 border-t border-[color:var(--cream)]/20 pt-8 text-eyebrow text-[color:var(--cream)]/50 md:flex-row md:items-center">
            <span>© MMXXVI Maison Vaillant. All rights, quietly, reserved.</span>
            <span>Zürich · New York · Onchain</span>
          </div>
        </div>
      </Curtain>
    </div>
  );
}
