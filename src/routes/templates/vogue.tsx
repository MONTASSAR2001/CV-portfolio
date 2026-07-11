import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const Route = createFileRoute("/templates/vogue")({
  component: VogueTemplate,
});

// Unsplash replacements for local assets
const portrait = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop";
const case1    = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1200&auto=format&fit=crop";
const case2    = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop";
const case3    = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop";

const CHAMPAGNE = "#c4a35a";
const FOREST    = "#1a2e1a";
const CREAM     = "#f5f0e0";

/* ── SVG silk distortion filter (replaces WebGL) ── */
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

function SilkImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <img src={src} alt={alt} loading="lazy"
        className="h-full w-full object-cover transition-all duration-700"
        style={{ filter: hover ? "url(#silk-distort-active) saturate(1.1)" : "url(#silk-distort)", transform: hover ? "scale(1.03)" : "scale(1)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,46,26,0.35), transparent)" }} />
    </div>
  );
}

function Curtain({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ y: "12%", opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className ?? ""}`}
    >
      {children}
    </motion.section>
  );
}

function VogueTemplate() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY     = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div className="min-h-screen antialiased" style={{ background: "#f5f0e0", color: "#1a1208", fontFamily: "'Georgia', serif" }}>
      <SilkFilters />

      {/* Back link */}
      <Link to="/portfolio-builder" className="fixed left-4 top-4 z-50 rounded-lg bg-black/10 px-3 py-1.5 text-xs text-black/60 backdrop-blur transition hover:bg-black/20 hover:text-black">← Builder</Link>

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-[#f5f0e0]/80 border-b border-black/5">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          <a href="#" className="text-xl tracking-tight font-bold">
            Maison<span className="italic font-light" style={{ color: CHAMPAGNE }}>Vaillant</span>
          </a>
          <nav className="hidden gap-10 md:flex">
            {["Practice","Portfolio","Perspective","Studio"].map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} className="text-xs uppercase tracking-widest text-black/50 hover:text-black transition-colors">{n}</a>
            ))}
          </nav>
          <a href="#contact" className="text-xs uppercase tracking-widest rounded-full border border-black/20 px-5 py-2.5 hover:bg-black hover:text-white transition-all">
            Enquire
          </a>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[110vh] overflow-hidden pt-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-6 px-6 md:px-12">
          <div className="col-span-12 md:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xs uppercase tracking-widest text-black/50 mb-8">
              Bespoke Advisory · Est. MMXVI · Zürich / New York
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3.5rem,10vw,10rem)] leading-[0.9] tracking-tight font-bold">
              Strategy<br />
              <span className="italic font-light" style={{ color: CHAMPAGNE }}>for the next</span><br />
              century.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-14 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <div className="h-px w-16 self-center bg-black/30" />
              <p className="text-black/60 leading-relaxed">
                I counsel founders, funds, and family offices at the intersection of capital, culture, and code.
              </p>
            </motion.div>
          </div>

          <motion.div style={{ y: heroY, scale: heroScale }} className="col-span-12 md:col-span-5 md:mt-6">
            <div className="relative aspect-[4/5] w-full">
              <SilkImage src={portrait} alt="Portrait of Elena Vaillant" className="h-full w-full rounded-sm" />
              <div className="absolute -bottom-4 -left-4 rounded-sm px-4 py-3 shadow-xl" style={{ background: CREAM }}>
                <p className="text-xs uppercase tracking-widest text-black/40">Principal</p>
                <p className="text-xl italic font-bold">Elena Vaillant</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="mt-24 overflow-hidden border-y border-black/10 py-6">
          <div className="flex whitespace-nowrap text-4xl md:text-6xl font-bold"
            style={{ animation: "marquee-vogue 25s linear infinite", width: "200%" }}>
            <style>{`@keyframes marquee-vogue { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-16 px-8">
                {["Capital Formation","·","Governance","·","Narrative","·","Onchain Treasury","·","Brand Architecture","·"].map((w, j) => (
                  <span key={j} className={j % 2 ? "italic" : ""} style={j % 2 ? { color: CHAMPAGNE } : {}}>
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRACTICE */}
      <Curtain className="rounded-t-[2rem] px-6 pt-28 pb-32 md:px-12 md:pt-40" style={{ background: CREAM }}>
        <div className="mx-auto max-w-[1600px]">
          <div id="practice" className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className="text-xs uppercase tracking-widest text-black/40 mb-6">01 — Practice</p>
              <h2 className="text-5xl md:text-7xl font-bold leading-[0.95]">
                A quiet<br /><em className="italic font-light" style={{ color: CHAMPAGNE }}>atelier</em><br />of counsel.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-10">
              {[
                { k: "I",   t: "Capital Architecture",   d: "Term sheets, cap tables, and treasury design for founders raising Series A through pre-IPO." },
                { k: "II",  t: "Narrative & Positioning", d: "Editorial-grade brand and comms strategy. The story your company tells before you enter the room." },
                { k: "III", t: "Governance Design",       d: "Boards, DAOs, and family constitutions engineered for the second and third generations of stewardship." },
              ].map((s) => (
                <div key={s.k} className="grid grid-cols-[auto_1fr] gap-8 border-t border-black/10 pt-8">
                  <span className="text-3xl italic font-bold" style={{ color: CHAMPAGNE }}>{s.k}</span>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold">{s.t}</h3>
                    <p className="mt-4 max-w-lg text-black/50 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Curtain>

      {/* PORTFOLIO */}
      <Curtain className="rounded-t-[2rem] px-6 pt-28 pb-32 md:px-12 md:pt-40" style={{ background: FOREST, color: CREAM }}>
        <div className="mx-auto max-w-[1600px]">
          <div id="portfolio" className="flex items-end justify-between border-b pb-10" style={{ borderColor: `${CREAM}20` }}>
            <div>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: `${CREAM}60` }}>02 — Selected work</p>
              <h2 className="text-5xl md:text-7xl font-bold">Portfolio.</h2>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-12 gap-6">
            {[
              { img: case1, tag: "Series C · Fintech",   title: "Havre Capital",    year: "2025", note: "Repositioned a private bank for a digital-native clientele. €4.2B AUM within eighteen months.", full: false },
              { img: case2, tag: "IPO Advisory · Luxury", title: "Maison Aubade",   year: "2024", note: "Guided a fourth-generation atelier to a listing on Euronext Paris at a 38× multiple.",          full: false },
              { img: case3, tag: "DAO Treasury · Web3",   title: "Verdant Protocol", year: "2024", note: "Designed governance and treasury framework for a $180M onchain endowment.",                      full: true },
            ].map((c) => (
              <article key={c.title} className={`group col-span-12 md:col-span-6 ${c.full ? "md:col-span-12 md:mt-8" : ""}`}>
                <div className={`relative ${c.full ? "aspect-[21/9]" : "aspect-[4/5]"}`}>
                  <SilkImage src={c.img} alt={c.title} className="h-full w-full rounded-sm" />
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: CHAMPAGNE }}>{c.tag}</p>
                    <h3 className="text-3xl md:text-5xl italic font-bold">{c.title}</h3>
                    <p className="mt-3 max-w-md" style={{ color: `${CREAM}70` }}>{c.note}</p>
                  </div>
                  <span className="text-2xl shrink-0" style={{ color: `${CREAM}50` }}>{c.year}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Curtain>

      {/* CONTACT */}
      <Curtain className="rounded-t-[2rem] px-6 pt-28 pb-16 md:px-12 md:pt-40" style={{ background: "#0f1f0f", color: CREAM }}>
        <div id="contact" className="mx-auto max-w-[1600px]">
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: `${CREAM}50` }}>04 — Enquiries</p>
          <h2 className="text-6xl md:text-[9rem] font-bold leading-[0.9]">
            Begin a<br /><em className="italic font-light" style={{ color: CHAMPAGNE }}>conversation</em>.
          </h2>
          <div className="mt-32 flex flex-col items-start justify-between gap-6 border-t pt-8 text-xs uppercase tracking-widest" style={{ borderColor: `${CREAM}15`, color: `${CREAM}40` }}>
            <div className="flex gap-4">
              <span>elena@vaillant.co</span>
              <span>·</span>
              <span>Zürich · New York · Onchain</span>
            </div>
            <span>© MMXXVI Maison Vaillant. All rights, quietly, reserved.</span>
          </div>
        </div>
      </Curtain>
    </div>
  );
}
