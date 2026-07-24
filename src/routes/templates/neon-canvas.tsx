import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CustomCursor } from "@/components/templates/neon-canvas/CustomCursor";
import { ProjectCard, type Project } from "@/components/templates/neon-canvas/ProjectCard";
import { Reveal } from "@/components/templates/neon-canvas/Reveal";
import type { PortfolioData } from "@/components/portfolio-builder/types";

const HeroScene = lazy(() =>
  import("@/components/templates/neon-canvas/HeroScene").then((m) => ({ default: m.HeroScene })),
);

export const Route = createFileRoute("/templates/neon-canvas")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Kai Nakamura — Independent Digital Designer & Developer" },
      {
        name: "description",
        content:
          "Portfolio of Kai Nakamura, an independent designer and developer crafting award-winning interactive experiences for ambitious brands.",
      },
      { property: "og:title", content: "Kai Nakamura — Digital Designer & Developer" },
      {
        property: "og:description",
        content:
          "Award-winning interactive design and development for ambitious brands. Studios, startups, and cultural institutions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Kai Nakamura — Digital Designer & Developer",
      },
      {
        name: "twitter:description",
        content: "Independent designer and developer for interactive experiences.",
      },
    ],
  }),
});

const projects: Project[] = [
  {
    title: "Aurora Finance",
    category: "Fintech",
    year: "2026",
    color: "rgba(168,85,247,0.55)",
    image:
      "https://images.unsplash.com/photo-1642790551116-18e150f248e8?w=1200&q=80",
  },
  {
    title: "Nebula Studio",
    category: "Branding",
    year: "2025",
    color: "rgba(34,211,238,0.55)",
    image:
      "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=1200&q=80",
  },
  {
    title: "Vector Motion",
    category: "Interactive",
    year: "2025",
    color: "rgba(217,70,239,0.55)",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
  },
  {
    title: "Quantum Labs",
    category: "Product",
    year: "2024",
    color: "rgba(59,130,246,0.55)",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
  },
  {
    title: "Halo Commerce",
    category: "E-commerce",
    year: "2024",
    color: "rgba(236,72,153,0.55)",
    image:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1200&q=80",
  },
];

function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export function Index({ data }: { data?: PortfolioData }) {
  const hydrated = useHydrated();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: projectsRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);

  const name = data?.personalInfo?.name ?? "Kai Nakamura";
  const shortName = name.split(" ")[0].toUpperCase();
  const bio = data?.personalInfo?.bio ?? "Independent designer & developer crafting interactive experiences at the intersection of code, motion, and light.";
  const role = data?.personalInfo?.role ?? "Designing";
  const email = data?.personalInfo?.email ?? "hello@kai.studio";
  
  const displayProjects: Project[] = data?.projects?.length
    ? data.projects.map((p, i) => ({
        title: p.title,
        category: p.highlight ?? p.tech?.[0] ?? "Interactive",
        year: "2026",
        color: ["rgba(168,85,247,0.55)", "rgba(34,211,238,0.55)", "rgba(217,70,239,0.55)", "rgba(59,130,246,0.55)", "rgba(236,72,153,0.55)"][i % 5],
        image: p.imageUrl ?? projects[i % projects.length].image,
      }))
    : projects;

  const marqueeWords = data?.skills?.length
    ? data.skills.flatMap(s => [s, "◆"])
    : ["Interaction Design", "◆", "Creative Development", "◆", "Motion", "◆", "Brand Systems", "◆", "3D & WebGL", "◆"];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {hydrated && <CustomCursor />}

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-40 blur-[120px]"
          style={{ background: "oklch(0.65 0.28 300)" }}
        />
        <div
          className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full opacity-30 blur-[140px]"
          style={{ background: "oklch(0.85 0.18 200)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
      >
        <div className="glass flex items-center gap-8 rounded-full px-6 py-3 text-sm">
          <span
            className="font-semibold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {shortName}<span className="text-gradient-neon">.</span>
          </span>
          <div className="hidden gap-6 text-white/70 md:flex">
            <a href="#work" className="hover:text-white">Work</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#services" className="hover:text-white">Services</a>
          </div>
          <a
            href="#contact"
            className="rounded-full px-4 py-1.5 text-xs font-medium"
            style={{ background: "var(--gradient-neon)", color: "#0a0a0f" }}
          >
            Let's talk
          </a>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-32">
        <div className="absolute inset-0">
          {hydrated && (
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          )}
        </div>
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Available for Q3 · 2026
          </motion.div>
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-semibold leading-[0.9] tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {role.split("").map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {c}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-gradient-neon italic font-light"
            >
              beyond pixels.
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mx-auto mt-8 max-w-xl text-lg text-white/70"
          >
            {bio}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <a
              href="#work"
              className="group relative overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium"
              style={{ background: "var(--gradient-neon)", color: "#0a0a0f", boxShadow: "var(--glow-purple)" }}
              data-cursor-hover
            >
              View selected work
            </a>
            <a
              href="#contact"
              className="glass rounded-full px-8 py-3.5 text-sm font-medium text-white hover:bg-white/10"
              data-cursor-hover
            >
              Book a call
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/40"
        >
          scroll ↓
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="relative border-y border-white/10 py-6 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex gap-16 whitespace-nowrap text-4xl md:text-5xl font-light text-white/40"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {Array.from({ length: 2 }).map((_, r) => (
            <div key={r} className="flex gap-16">
              {marqueeWords.map(
                (t, i) => (
                  <span key={i} className={t === "◆" ? "text-gradient-neon" : ""}>
                    {t}
                  </span>
                ),
              )}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Projects horizontal scroll */}
      <section id="work" ref={projectsRef} className="relative" style={{ height: "300vh" }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mb-12 px-6 md:px-16">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.4em] text-white/50">
                ◆ Selected Work / 2024—2026
              </span>
            </Reveal>
            <Reveal index={1}>
              <h2
                className="mt-4 text-5xl md:text-7xl font-semibold tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Projects that <span className="text-gradient-neon italic font-light">move.</span>
              </h2>
            </Reveal>
          </div>
          <motion.div
            ref={scrollerRef}
            style={{ x }}
            className="flex gap-8 px-6 md:px-16"
          >
            {displayProjects.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
            <div className="shrink-0 w-[400px] flex items-center justify-center">
              <a
                href="#contact"
                className="glass rounded-full px-8 py-4 text-sm text-white hover:bg-white/10"
                data-cursor-hover
              >
                Start a project →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative px-6 py-32 md:px-16">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
          <div>
            <Reveal>
              <span className="text-xs uppercase tracking-[0.4em] text-white/50">◆ About</span>
            </Reveal>
            <Reveal index={1}>
              <h2
                className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                A one-person <span className="text-gradient-neon italic font-light">studio</span> obsessed
                with the details others skip.
              </h2>
            </Reveal>
          </div>
          <div className="space-y-8 text-white/70">
            <Reveal index={2}>
              <p className="text-lg leading-relaxed">
                I partner with founders, agencies, and cultural institutions to design and build
                websites that feel unmistakably crafted. Eight years of practice across brand,
                interface, and interactive systems.
              </p>
            </Reveal>
            <Reveal index={3}>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  [String(data?.projects?.length ?? "48+"), "Shipped projects"],
                  [String(data?.experience?.length ?? "12"), "Awwwards"],
                  [String(data?.skills?.length ?? "8 yrs"), "Independent"],
                  [String(data?.education?.length ?? "4"), "FWA of the day"],
                ].map(([n, l]) => (
                  <div key={l} className="glass rounded-2xl p-5">
                    <div
                      className="text-3xl font-semibold text-gradient-neon"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {n}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-white/50">{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative px-6 py-32 md:px-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.4em] text-white/50">◆ Services</span>
          </Reveal>
          <Reveal index={1}>
            <h2
              className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              What I <span className="text-gradient-neon italic font-light">do.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Interaction Design",
                d: "Interfaces engineered around motion, feedback, and rhythm.",
                n: "01",
              },
              {
                t: "Creative Development",
                d: "React, WebGL, and shaders — production-ready, framerate-obsessed.",
                n: "02",
              },
              {
                t: "Brand & Identity",
                d: "Systems built to breathe across every surface, from favicon to launch film.",
                n: "03",
              },
            ].map((s, i) => (
              <Reveal key={s.t} index={i + 2}>
                <div
                  className="glass group relative h-full overflow-hidden rounded-3xl p-8 transition-all hover:bg-white/[0.06]"
                  data-cursor-hover
                >
                  <div
                    className="absolute -right-8 -top-8 text-8xl font-bold opacity-10 text-gradient-neon"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {s.n}
                  </div>
                  <h3
                    className="text-2xl font-semibold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {s.t}
                  </h3>
                  <p className="mt-4 text-white/60">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative px-6 py-32 md:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.4em] text-white/50">◆ Contact</span>
          </Reveal>
          <Reveal index={1}>
            <h2
              className="mt-6 text-5xl md:text-8xl font-semibold tracking-tight leading-[0.95]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Have something <br />
              <span className="text-gradient-neon italic font-light">extraordinary</span> in mind?
            </h2>
          </Reveal>
          <Reveal index={2}>
            <a
              href={`mailto:${email}`}
              className="mt-12 inline-block text-2xl md:text-4xl font-light underline decoration-white/20 underline-offset-8 hover:decoration-white"
              data-cursor-hover
            >
              {email}
            </a>
          </Reveal>
          <Reveal index={3}>
            <div className="mt-16 flex justify-center gap-6 text-sm text-white/50">
              {["Twitter", "Instagram", "Read.cv", "GitHub"].map((l) => (
                <a key={l} href="#" className="hover:text-white" data-cursor-hover>
                  {l}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-xs text-white/40 md:px-16">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span>© {new Date().getFullYear()} {name} Studio</span>
          <span>Made in Tokyo · Berlin</span>
        </div>
      </footer>
    </div>
  );
}
