import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Layers, Cpu, Palette, ArrowRight } from "lucide-react";
import { GradientBackdrop } from "@/components/templates/vibrant-glass/GradientBackdrop";
import { SpotlightCursor } from "@/components/templates/vibrant-glass/SpotlightCursor";
import { Reveal } from "@/components/templates/vibrant-glass/Reveal";
import { ProjectCard, type Project } from "@/components/templates/vibrant-glass/ProjectCard";
import type { PortfolioData } from "@/components/portfolio-builder/types";

const HeroScene = lazy(() =>
  import("@/components/templates/vibrant-glass/HeroScene").then((m) => ({ default: m.HeroScene })),
);

export const Route = createFileRoute("/templates/vibrant-glass")({
  head: () => ({
    meta: [
      { title: "Nova Rhee — UI/UX Designer & 3D Artist" },
      {
        name: "description",
        content:
          "Portfolio of Nova Rhee, a UI/UX designer and 3D artist crafting spatial interfaces, glassmorphic products, and cinematic 3D worlds.",
      },
      { property: "og:title", content: "Nova Rhee — UI/UX Designer & 3D Artist" },
      {
        property: "og:description",
        content:
          "Spatial interfaces, glass UI, and cinematic 3D — a vibrant portfolio in motion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

const PROJECTS: Project[] = [
  {
    title: "Prism OS",
    category: "Product Design",
    year: "2026",
    gradient: "linear-gradient(135deg,#ff7ac2,#ffb36b)",
    emoji: "🔮",
    tags: ["UX", "Design System", "Motion"],
  },
  {
    title: "Nebula Studio",
    category: "3D Art Direction",
    year: "2025",
    gradient: "linear-gradient(135deg,#7ac9ff,#b18cff)",
    emoji: "🪐",
    tags: ["Three.js", "Shaders", "Brand"],
  },
  {
    title: "Aurora Wallet",
    category: "Mobile App",
    year: "2025",
    gradient: "linear-gradient(135deg,#c4ff6b,#7ac9ff)",
    emoji: "💠",
    tags: ["iOS", "Fintech", "Glass UI"],
  },
  {
    title: "Chromacast",
    category: "Interactive Web",
    year: "2024",
    gradient: "linear-gradient(135deg,#ffd76b,#ff7ac2)",
    emoji: "🎛",
    tags: ["WebGL", "Audio", "Realtime"],
  },
  {
    title: "Kite AI",
    category: "AI Product",
    year: "2024",
    gradient: "linear-gradient(135deg,#b18cff,#7ac9ff)",
    emoji: "🪁",
    tags: ["Agents", "Enterprise", "Onboarding"],
  },
  {
    title: "Halcyon Home",
    category: "Spatial UI",
    year: "2024",
    gradient: "linear-gradient(135deg,#ff9a7a,#ffd76b)",
    emoji: "🏝",
    tags: ["visionOS", "Prototype"],
  },
];

const SERVICES = [
  { icon: Palette, title: "Interface Design", body: "Design systems, product surfaces, and glass-first component libraries built for scale." },
  { icon: Layers, title: "3D Direction", body: "Bespoke 3D scenes, material studies, and real-time WebGL crafted with Three & Blender." },
  { icon: Cpu, title: "Prototyping", body: "High-fidelity, motion-driven prototypes that behave like the real product on day one." },
  { icon: Sparkles, title: "Brand Systems", body: "Identity, iconography, and motion language for products that need to feel alive." },
];

function Portfolio({ data }: { data?: PortfolioData }) {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const displayName = data?.personalInfo?.name ?? "Nova Rhee";
  const displayRole = data?.personalInfo?.role ?? "UI/UX Designer & 3D Artist";
  const displayBio = data?.personalInfo?.bio ?? "A UI/UX designer and 3D artist crafting refractive, motion-first products for teams shaping tomorrow.";
  const displayEmail = data?.personalInfo?.email ?? "hello@nova.studio";

  const GRADIENTS = [
    "linear-gradient(135deg,#ff7ac2,#ffb36b)",
    "linear-gradient(135deg,#7ac9ff,#b18cff)",
    "linear-gradient(135deg,#c4ff6b,#7ac9ff)",
    "linear-gradient(135deg,#ffd76b,#ff7ac2)",
    "linear-gradient(135deg,#b18cff,#7ac9ff)",
    "linear-gradient(135deg,#ff9a7a,#ffd76b)",
  ];
  const EMOJIS = ["🔮", "🪐", "💠", "🎛", "🪁", "🏝"];

  const displayProjects: Project[] = data?.projects?.length
    ? data.projects.map((p, i) => ({
        title: p.title,
        category: p.highlight ?? "Project",
        year: new Date().getFullYear().toString(),
        gradient: GRADIENTS[i % GRADIENTS.length],
        emoji: EMOJIS[i % EMOJIS.length],
        tags: p.techStack ?? p.tech ?? [],
      }))
    : PROJECTS;

  const marqueeWords = data?.skills?.length
    ? [...data.skills.slice(0, 5).map(s => s), "★"].flatMap(w => [w, "★"])
    : ["Spatial UI", "★", "3D Direction", "★", "Motion", "★", "Design Systems", "★", "WebGL", "★"];

  return (
    <div className="relative min-h-screen text-white">
      <GradientBackdrop />
      <SpotlightCursor />

      {/* NAV */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
      >
        <div className="glass flex items-center gap-1 rounded-full px-2 py-2 text-sm">
          <a href="#" className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold">
            <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-pink-400 to-cyan-300" />
            {displayName.split(" ")[0]}
          </a>
          {["Work", "Studio", "Playground", "Contact"].map((item) => (
            <a
              key={item}
              data-spotlight
              href={`#${item.toLowerCase()}`}
              className="rounded-full px-4 py-2 text-white/70 transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
          <a
            data-spotlight
            href="#contact"
            className="ml-1 rounded-full bg-white px-4 py-2 font-medium text-black transition-transform hover:scale-105"
          >
            Let's talk
          </a>
        </div>
      </motion.nav>

      {/* HERO */}
      <motion.section
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative flex min-h-screen items-center px-6 pt-32 md:px-12"
      >
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="glass inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-white/80"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
            Available for Q2 · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl font-display text-6xl font-semibold leading-[0.95] tracking-tighter md:text-8xl lg:text-9xl"
          >
            {data?.personalInfo?.bio
              ? <><span className="text-gradient italic">{displayName}</span> — {displayRole}</>  
              : <>Designing <span className="text-gradient italic">spatial</span> interfaces &amp; <span className="text-gradient italic">3D worlds</span> that feel alive.</> 
            }
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="max-w-2xl text-lg text-white/70 md:text-xl"
          >
            I&apos;m <span className="text-white">{displayName}</span> &mdash; {displayBio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              data-spotlight
              href="#work"
              className="glass-strong group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium"
            >
              View selected work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              data-spotlight
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              Book an intro call
            </a>
          </motion.div>

          <div className="mt-16 grid max-w-3xl grid-cols-3 gap-6">
            {[
              { k: data?.experience?.length ? String(data.experience.length) : "8y", v: data?.experience?.length ? "Roles" : "Design practice" },
              { k: data?.projects?.length ? String(data.projects.length) + "+" : "40+", v: "Projects shipped" },
              { k: data?.skills?.length ? String(data.skills.length) : "12", v: data?.skills?.length ? "Skills" : "Awards & features" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-2xl p-4">
                <div className="text-3xl font-semibold">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* MARQUEE */}
      <section className="relative overflow-hidden py-10">
        <div className="flex whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex gap-16 pr-16 text-5xl font-display font-medium md:text-7xl"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 2 }).flatMap((_, r) =>
              marqueeWords.map((w, i) => (
                <span key={`${r}-${i}`} className={i % 2 === 0 ? "text-gradient italic" : "text-white/30"}>{w}</span>
              )),
            )}
          </motion.div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="relative px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/60">Selected Work — 2024/26</div>
              <h2 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tighter md:text-7xl">
                Products that <span className="text-gradient italic">move</span> the field forward.
              </h2>
            </div>
            <a href="#" data-spotlight className="glass rounded-full px-5 py-2.5 text-sm">All case studies →</a>
          </Reveal>

          {displayProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayProjects.map((p, i) => (
                <ProjectCard key={p.title} project={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-center py-12">No projects added yet.</p>
          )}
        </div>
      </section>

      {/* STUDIO / SERVICES */}
      <section id="studio" className="relative px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-14 max-w-3xl">
            <div className="text-xs uppercase tracking-widest text-white/60">Studio</div>
            <h2 className="mt-3 text-5xl font-semibold tracking-tighter md:text-6xl">
              A practice built around <span className="text-gradient italic">craft</span>, code, and 3D.
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div data-spotlight className="glass group h-full rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1">
                  <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLAYGROUND */}
      <section id="playground" className="relative px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="glass-strong relative overflow-hidden rounded-[2.5rem] p-10 md:p-16">
              <div
                className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
                style={{ background: "linear-gradient(135deg,#ff7ac2,#b18cff)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
                style={{ background: "linear-gradient(135deg,#7ac9ff,#c4ff6b)" }}
              />
              <div className="relative grid gap-10 md:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Playground</div>
                  <h2 className="mt-3 text-4xl font-semibold tracking-tighter md:text-6xl">
                    Experiments in <span className="text-gradient italic">glass, gravity</span> and grain.
                  </h2>
                  <p className="mt-6 max-w-xl text-white/70">
                    Weekly explorations in shaders, refractive materials, and interaction. Every experiment feeds the next product decision.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {["🌊", "🧊", "🪞", "💎"].map((e, i) => (
                    <motion.div
                      key={i}
                      data-spotlight
                      whileHover={{ scale: 1.06, rotate: i % 2 ? 3 : -3 }}
                      className="glass flex aspect-square items-center justify-center rounded-3xl text-5xl"
                      style={{
                        background: `linear-gradient(135deg, ${["#ff7ac233","#7ac9ff33","#c4ff6b33","#b18cff33"][i]}, transparent)`,
                      }}
                    >
                      {e}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative px-6 py-32 md:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-widest text-white/60">Contact</div>
            <h2 className="mt-4 text-6xl font-semibold tracking-tighter md:text-8xl">
              Let's build something <span className="text-gradient italic">luminous</span>.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-white/70">
              Currently taking on 2 selective engagements for Q2. Product design, 3D direction, or full end-to-end craft.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                data-spotlight
                href={`mailto:${displayEmail}`}
                className="glass-strong inline-flex items-center gap-3 rounded-full px-7 py-4 text-base font-medium"
              >
                {displayEmail}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                data-spotlight
                href="#"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-base text-white/80 hover:text-white"
              >
                Read work journal
              </a>
            </div>
          </Reveal>
        </div>

        <footer className="mx-auto mt-24 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {displayName} Studio. Handcrafted in refractive glass.</span>
          <div className="flex gap-5">
            <a href="#" data-spotlight className="hover:text-white">Twitter</a>
            <a href="#" data-spotlight className="hover:text-white">Dribbble</a>
            <a href="#" data-spotlight className="hover:text-white">Read.cv</a>
          </div>
        </footer>
      </section>
    </div>
  );
}
