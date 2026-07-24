import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Portfolio } from "@/components/Portfolio";
import { projects, DEFAULT_COLOR } from "@/lib/projects";

const HeroBlob = lazy(() =>
  import("@/components/HeroBlob").then((m) => ({ default: m.HeroBlob })),
);

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Elin Vasseur — Architect & Fine Artist" },
      {
        name: "description",
        content:
          "Portfolio of Elin Vasseur — architecture and fine art of quiet luxury, warm materials, and considered gesture.",
      },
      { property: "og:title", content: "Elin Vasseur — Architect & Fine Artist" },
      {
        property: "og:description",
        content: "Architecture and fine art in beige, ivory and brushed gold.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const [heroColor, setHeroColor] = useState(DEFAULT_COLOR);

  return (
    <SmoothScroll>
      <main className="relative bg-background text-foreground">
        {/* NAV */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 py-6 md:px-14"
        >
          <div className="font-serif text-xl italic tracking-tight">Elin Vasseur</div>
          <nav className="hidden gap-10 text-[11px] uppercase tracking-[0.32em] text-muted-foreground md:flex">
            <a href="#works" className="transition-colors hover:text-foreground">Works</a>
            <a href="#studio" className="transition-colors hover:text-foreground">Studio</a>
            <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
          </nav>
          <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            Paris — Kyoto
          </div>
        </motion.header>

        {/* HERO */}
        <section
          className="relative flex h-screen w-full items-end overflow-hidden"
          onMouseLeave={() => setHeroColor(DEFAULT_COLOR)}
        >
          <div className="absolute inset-0">
            <Suspense fallback={<div className="h-full w-full bg-beige" />}>
              <HeroBlob color={heroColor} />
            </Suspense>
            {/* soft veil so type stays readable */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/40 via-transparent to-ivory/80" />
          </div>

          <div className="relative z-10 w-full px-8 pb-16 md:px-14 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground"
            >
              Est. 2011 — Architecture & Fine Art
            </motion.div>

            <h1 className="mt-6 font-serif text-[15vw] leading-[0.86] tracking-tight text-foreground md:text-[10.5vw]">
              <SplitLine text="Quiet" delay={0.6} />
              <span className="block italic text-[var(--gold-deep)]">
                <SplitLine text="luxury," delay={0.85} />
              </span>
              <SplitLine text="in warm light." delay={1.1} />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.6 }}
              className="mt-10 max-w-md text-sm leading-relaxed text-muted-foreground"
            >
              A studio devoted to considered form — architecture, sculpture and painting
              drawn from ivory, beige and brushed gold.
            </motion.p>
          </div>

          {/* corner marks */}
          <div className="pointer-events-none absolute bottom-8 right-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground md:bottom-10 md:right-14">
            <span className="h-px w-10 bg-current" />
            Scroll
          </div>
        </section>

        {/* MARQUEE / STATEMENT */}
        <section className="border-y border-border py-8">
          <div className="flex items-center gap-16 overflow-hidden">
            <motion.div
              className="flex shrink-0 items-center gap-16 whitespace-nowrap font-serif text-5xl italic text-foreground/80 md:text-7xl"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            >
              {Array.from({ length: 2 }).map((_, k) => (
                <div key={k} className="flex items-center gap-16">
                  <span>Architecture</span>
                  <span className="text-[var(--gold-deep)]">✶</span>
                  <span>Sculpture</span>
                  <span className="text-[var(--gold-deep)]">✶</span>
                  <span>Painting</span>
                  <span className="text-[var(--gold-deep)]">✶</span>
                  <span>Interior</span>
                  <span className="text-[var(--gold-deep)]">✶</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <div id="works" onMouseLeave={() => setHeroColor(DEFAULT_COLOR)}>
          <div className="px-8 pb-16 pt-28 md:px-14">
            <div className="flex items-end justify-between gap-8">
              <div>
                <div className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
                  Index — MMXI / MMXXV
                </div>
                <h2 className="mt-4 font-serif text-6xl leading-[0.95] md:text-8xl">
                  Selected <span className="italic text-[var(--gold-deep)]">works.</span>
                </h2>
              </div>
              <p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground md:block">
                Hover a title to feel the piece — the background shifts to its keynote hue.
              </p>
            </div>
          </div>

          <Portfolio projects={projects} onHoverProject={setHeroColor} />
        </div>

        {/* STUDIO */}
        <section id="studio" className="border-t border-border px-8 py-32 md:px-14 md:py-48">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
                Studio
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="font-serif text-3xl leading-[1.15] text-foreground md:text-5xl">
                The studio moves slowly. We work in stone, plaster, brass and
                oil — <span className="italic text-[var(--gold-deep)]">favoring
                gesture over statement</span>, and warmth over gloss. Each
                commission begins with a walk through the light of the site.
              </p>
              <div className="mt-16 grid grid-cols-2 gap-10 text-sm text-muted-foreground md:grid-cols-3">
                <Stat k="18" v="Years practicing" />
                <Stat k="42" v="Completed works" />
                <Stat k="7" v="International awards" />
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="border-t border-border px-8 py-32 md:px-14 md:py-48">
          <div className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
            Correspondence
          </div>
          <h2 className="mt-6 max-w-5xl font-serif text-6xl leading-[0.95] md:text-[9rem]">
            Let us <span className="italic text-[var(--gold-deep)]">begin</span>
            <br />a conversation.
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <ContactCol label="Studio">
              14 rue de Sèvres<br />75006 Paris
            </ContactCol>
            <ContactCol label="Enquiries">
              studio@elinvasseur.fr<br />+33 1 42 84 01 22
            </ContactCol>
            <ContactCol label="Social">
              Instagram<br />Are.na
            </ContactCol>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-border px-8 py-8 text-[11px] uppercase tracking-[0.32em] text-muted-foreground md:px-14">
          <div>© MMXXV Elin Vasseur</div>
          <div>Site — quiet, warm, gold.</div>
        </footer>
      </main>
    </SmoothScroll>
  );
}

function SplitLine({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-serif text-5xl text-foreground">{k}</div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.28em]">{v}</div>
    </div>
  );
}

function ContactCol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-4 font-serif text-2xl leading-snug text-foreground">
        {children}
      </div>
    </div>
  );
}
