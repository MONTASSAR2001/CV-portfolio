import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { ScatterText } from "@/components/templates/kinetic-ink/portfolio/ScatterText";
import { WorkSection } from "@/components/templates/kinetic-ink/portfolio/WorkSection";

const KineticHero = lazy(() =>
  import("@/components/templates/kinetic-ink/portfolio/KineticHero").then((m) => ({ default: m.KineticHero })),
);
const ProgressShape = lazy(() =>
  import("@/components/templates/kinetic-ink/portfolio/ProgressShape").then((m) => ({ default: m.ProgressShape })),
);

import type { PortfolioData } from "@/components/portfolio-builder/types";

export const Route = createFileRoute("/templates/kinetic-ink-main")({
  component: Index,
  head: () => ({
    meta: [
      { title: "REN KOVAC — Copywriter & Content Editor" },
      {
        name: "description",
        content:
          "A bold editorial portfolio from copywriter Ren Kovac. Campaigns, essays, naming, and brand voice systems for brands that want to be read, not skimmed.",
      },
      { property: "og:title", content: "REN KOVAC — Copywriter & Content Editor" },
      {
        property: "og:description",
        content:
          "Campaigns, essays, and brand voice systems built to move readers. Portfolio 2023—2025.",
      },
    ],
  }),
});

export function Index({ data }: { data?: PortfolioData }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-30 border-b border-ink bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3">
          <a href="#top" className="text-display text-xl tracking-tight">
            {(data?.personalInfo?.name || "R.KOVAC").toUpperCase().substring(0, 8)}<span className="text-neon">.</span>
          </a>
          <div className="hidden gap-6 md:flex text-mono text-xs">
            <a href="#work" className="hover:text-neon">Work</a>
            <a href="#about" className="hover:text-neon">About</a>
            <a href="#services" className="hover:text-neon">Services</a>
            <a href="#contact" className="hover:text-neon">Contact</a>
          </div>
          <a
            href="#contact"
            className="text-mono border border-ink bg-ink px-3 py-1 text-xs text-paper hover:bg-neon hover:border-neon"
          >
            Hire
          </a>
        </div>
      </nav>

      <div id="top" className="pt-12">
        {mounted && (
          <Suspense fallback={<div className="h-[75vh] border-y border-ink bg-paper" />}>
            <KineticHero data={data} />
          </Suspense>
        )}
      </div>

      {/* Manifesto / About */}
      <section id="about" className="border-t-[3px] border-ink bg-paper">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-6 px-6 py-20">
          <div className="col-span-12 border-b border-ink pb-4 md:col-span-3">
            <div className="text-mono text-xs text-muted-foreground">Section A</div>
            <h2 className="text-display mt-2 text-4xl">Manifesto</h2>
          </div>
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <ScatterText
              as="p"
              className="text-display block text-[clamp(1.75rem,4.5vw,4rem)] leading-[0.95]"
            >
              {data?.personalInfo?.headline || "WRITING IS NOT DECORATION. IT IS INFRASTRUCTURE. HOVER ANY WORD."}
            </ScatterText>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <ScatterText as="p" className="text-serif text-xl leading-relaxed italic">
                {data?.personalInfo?.bio || "Most brand copy is written to be approved. Mine is written to be read. There is a difference, and it shows up in every metric that matters."}
              </ScatterText>
            </div>
          </div>
        </div>
      </section>

      <WorkSection data={data} />

      {/* Services */}
      <section id="services" className="border-t-[3px] border-ink bg-ink text-paper">
        <div className="mx-auto max-w-[1600px] px-6 py-20">
          <div className="flex items-end justify-between border-b border-paper/30 pb-4">
            <div>
              <div className="text-mono text-xs text-paper/60">Section C</div>
              <h2 className="text-display mt-2 text-[clamp(2.5rem,7vw,6rem)]">Services</h2>
            </div>
            <span className="text-mono hidden text-xs text-paper/60 md:block">Four practices</span>
          </div>
          <div className="mt-10 grid grid-cols-1 divide-y divide-paper/20 md:grid-cols-2 md:divide-x md:divide-y-0">
            {[
              { n: "01", t: "Brand Voice", d: "Positioning, tone systems, and 300-example guides your team will actually use." },
              { n: "02", t: "Campaigns", d: "Launch and always-on copy for teams that want the phone to ring." },
              { n: "03", t: "Long-form", d: "Essays, white papers, and manifestos that do the work of a media buy." },
              { n: "04", t: "Naming", d: "Product and company names, phonetically tested, legally checked, quietly ownable." },
            ].map((s) => (
              <div key={s.n} className="p-8 md:p-12">
                <div className="text-mono text-xs text-neon">— {s.n}</div>
                <h3 className="text-display mt-3 text-4xl">{s.t}</h3>
                <p className="text-serif mt-4 max-w-md text-lg italic text-paper/80">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t-[3px] border-ink bg-paper">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-6 px-6 py-24">
          <div className="col-span-12">
            <div className="text-mono text-xs text-muted-foreground">Section D · The Back Page</div>
            <ScatterText
              as="h2"
              className="text-display mt-4 block text-[clamp(3rem,12vw,14rem)]"
            >
              LET'S WRITE.
            </ScatterText>
          </div>
          <div className="col-span-12 mt-8 flex flex-col justify-between gap-6 border-t border-ink pt-8 md:col-span-8 md:flex-row md:items-end">
            <a
              href={`mailto:${data?.personalInfo?.email || "hello@renkovac.studio"}`}
              className="text-display text-3xl underline decoration-neon decoration-4 underline-offset-8 hover:text-neon md:text-5xl"
            >
              {data?.personalInfo?.email || "hello@renkovac.studio"}
            </a>
            <div className="text-mono text-xs">
              <div>Booking Q4 2026</div>
              <div className="text-muted-foreground">Remote · Berlin · New York</div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="border border-ink bg-neon p-6 text-paper">
              <div className="text-mono text-xs">Rate card</div>
              <div className="text-display mt-2 text-3xl">From $6k / project</div>
              <div className="text-serif mt-2 text-sm italic">
                Fixed-fee engagements. No retainers, no hourly, no surprises.
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-ink">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 text-mono text-xs text-muted-foreground">
            <span>© 2026 Ren Kovac Studio</span>
            <span>Set in Archivo Black &amp; Instrument Serif</span>
          </div>
        </div>
      </section>

      {mounted && (
        <Suspense fallback={null}>
          <ProgressShape />
        </Suspense>
      )}
    </main>
  );
}
