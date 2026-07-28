import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { memo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload, Bot, Rocket, CheckCircle2, Layers, ExternalLink } from "lucide-react";

/* ── SWR Data Fetching ── */
function useLandingData() {
  return useQuery({
    queryKey: ["landing_data"],
    queryFn: async () => {
      const [sessionRes, settingsRes, templatesRes] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from("site_settings").select("*"),
        supabase.from("dynamic_templates").select("*").eq("status", true)
      ]);
      return {
        session: sessionRes.data?.session || null,
        settings: settingsRes.data || [],
        templates: templatesRes.data || []
      };
    },
    staleTime: 1000 * 60 * 5, // 5 min memory cache
  });
}


/* ── CSS keyframes injected once — all infinite animations live here (GPU) ── */
const PERF_STYLES = `
  @keyframes spin-slow   { to { transform: rotate(360deg); } }
  @keyframes shard-spin-0 { to { transform: translateX(-50%) translateY(-50%) rotate(360deg); } }
  @keyframes shard-spin-1 { to { transform: translateX(-50%) translateY(-50%) rotate(360deg); } }
  @keyframes shard-spin-2 { to { transform: translateX(-50%) translateY(-50%) rotate(360deg); } }
  @keyframes shard-spin-3 { to { transform: translateX(-50%) translateY(-50%) rotate(360deg); } }
  @keyframes shard-spin-4 { to { transform: translateX(-50%) translateY(-50%) rotate(360deg); } }
  @keyframes float-blob-0 { 0%,100% { transform:translate(0,0);      } 50% { transform:translate(15px,-30px); } }
  @keyframes float-blob-1 { 0%,100% { transform:translate(0,0);      } 50% { transform:translate(15px,-30px); } }
  @keyframes float-blob-2 { 0%,100% { transform:translate(0,0);      } 50% { transform:translate(15px,-30px); } }
  @keyframes float-blob-3 { 0%,100% { transform:translate(0,0);      } 50% { transform:translate(15px,-30px); } }
  @keyframes float-glass-a { 0%,100% { transform:rotate(-12deg) translateY(0);  } 50% { transform:rotate(-8deg) translateY(-20px);  } }
  @keyframes float-glass-b { 0%,100% { transform:rotate(9deg)  translateY(0);  } 50% { transform:rotate(14deg) translateY(18px);   } }
  @keyframes rotate-border  { to { --angle: 360deg; } }
  @keyframes pulse-dot      { 0%,100% { box-shadow: 0 0 0 0 currentColor; } 50% { box-shadow: 0 0 0 8px transparent; } }
  @keyframes ping-once      { 0% { transform: scale(1); opacity: 0.7; } 75%,100% { transform: scale(2); opacity: 0; } }
`;

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ---------- Custom kinetic ornaments (no stock icons) ---------- */

const OrbitNode = memo(function OrbitNode({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full blur-2xl opacity-70"
        style={{ background: "conic-gradient(from 0deg, oklch(0.72 0.24 300), oklch(0.68 0.24 275), oklch(0.85 0.18 210), oklch(0.72 0.24 300))" }} />
      <div className="relative h-full w-full rounded-full border border-white/15"
        style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.95 0.05 300 / 0.9), oklch(0.3 0.1 280 / 0.6) 50%, oklch(0.12 0.03 280) 80%)" }} />
      <div className="absolute inset-2 rounded-full border border-white/10" />
      <div className="absolute inset-6 rounded-full border border-white/5" />
    </div>
  );
});

const DataExtractionGlyph = memo(function DataExtractionGlyph() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-56 w-full">
      {/* central node — CSS spin, no JS frame loop */}
      <div
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2"
        style={{ animation: reduce ? "none" : "spin-slow 24s linear infinite", willChange: "transform" }}
      >
        <OrbitNode className="h-full w-full" />
      </div>
      {/* orbiting shards — CSS, no JS */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 h-1.5 w-10 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, oklch(0.85 0.18 210), transparent)",
            transformOrigin: "0 50%",
            transform: `translateX(-50%) translateY(-50%) rotate(${i * 72}deg)`,
            animation: reduce ? "none" : `shard-spin-${i} ${10 + i}s linear infinite`,
            willChange: "transform",
          }}
        />
      ))}
      {/* extracted lines */}
      <div className="absolute inset-x-8 bottom-4 space-y-2">
        {[85, 60, 72].map((w, i) => (
          <motion.div
            key={i}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: `${w}%`, opacity: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.9 }}
            className="h-1 rounded-full"
            style={{ background: "linear-gradient(90deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))" }}
          />
        ))}
      </div>
    </div>
  );
});

const WebMeshGlyph = memo(function WebMeshGlyph() {
  const nodes = [
    { x: 20, y: 30 }, { x: 78, y: 22 }, { x: 50, y: 55 },
    { x: 25, y: 78 }, { x: 82, y: 70 }, { x: 60, y: 15 },
  ];
  const edges: [number, number][] = [[0,2],[1,2],[2,3],[2,4],[5,1],[0,3],[4,1]];
  return (
    <div className="relative h-56 w-full">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ln" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.24 300)" />
            <stop offset="100%" stopColor="oklch(0.85 0.18 210)" />
          </linearGradient>
        </defs>
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke="url(#ln)" strokeWidth="0.35"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 1.1 }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 200 }}
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${n.x}%`, top: `${n.y}%`,
            background: "oklch(0.95 0.05 300)",
            boxShadow: "0 0 18px oklch(0.72 0.24 300), 0 0 4px oklch(1 0 0)",
          }}
        />
      ))}
      {/* deploy pulse — CSS, no JS */}
      <div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "oklch(0.85 0.18 210)",
          boxShadow: "0 0 20px oklch(0.85 0.18 210)",
          animation: "spin-slow 3s ease-in-out infinite",
          willChange: "transform",
        }}
      />
    </div>
  );
});

const FloatingShapes = memo(function FloatingShapes() {
  const reduce = useReducedMotion();
  const shapes = [
    { size: 380, x: "-8%",  y: "6%",  hue: "300", dur: 10 },
    { size: 260, x: "72%",  y: "12%", hue: "275", dur: 12 },
    { size: 200, x: "55%",  y: "60%", hue: "210", dur: 14 },
    { size: 140, x: "10%",  y: "70%", hue: "340", dur: 16 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.size, height: s.size, left: s.x, top: s.y,
            background: `radial-gradient(circle at 30% 30%, oklch(0.75 0.22 ${s.hue} / 0.45), oklch(0.75 0.22 ${s.hue} / 0.04) 60%, transparent 75%)`,
            filter: "blur(28px)",
            animation: reduce ? "none" : `float-blob-${i} ${s.dur}s ease-in-out infinite`,
            willChange: "transform",
          }}
        />
      ))}
      {/* glass shards — CSS float, no JS */}
      <div
        className="glass absolute rounded-3xl"
        style={{
          width: 220, height: 140, left: "62%", top: "48%",
          animation: reduce ? "none" : "float-glass-a 9s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        className="glass absolute rounded-2xl"
        style={{
          width: 140, height: 90, left: "8%", top: "38%",
          animation: reduce ? "none" : "float-glass-b 11s ease-in-out infinite",
          willChange: "transform",
        }}
      />
    </div>
  );
});

const KineticBorder = memo(function KineticBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`kinetic-border relative ${className}`}>
      {/* CSS animation — zero JS overhead */}
      <div
        className="kinetic-border-inner rounded-[inherit]"
        style={{ animation: "rotate-border 8s linear infinite", willChange: "transform" }}
      />
      {children}
    </div>
  );
});

/* ---------- Sections ---------- */

const Nav = memo(function Nav() {
  const { data, isLoading } = useLandingData();

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-6xl items-center justify-between px-4"
    >
      <div className="glass flex w-full items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="CareerOS Logo" className="h-7 w-auto object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight">CareerOS</span>
        </div>
        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Architecture</a>
          <a href="#dashboard" className="hover:text-foreground transition">Studio</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex h-9 w-24 items-center justify-center rounded-xl bg-white/5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : data?.session ? (
            <Link
              to="/dashboard"
              className="btn-kinetic relative rounded-xl px-4 py-2 text-sm font-semibold"
            >
              <span className="relative z-10">Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground md:flex px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="btn-kinetic relative rounded-xl px-4 py-2 text-sm font-semibold"
              >
                <span className="relative z-10">Launch app</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
});

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden pt-40 pb-24 sm:pt-48">
      <FloatingShapes />
      <motion.div style={{ y: reduce ? 0 : y }} className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
          style={{ willChange: "opacity, transform" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: "oklch(0.72 0.24 300)", animation: "ping-once 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "oklch(0.72 0.24 300)" }} />
          </span>
          Agentic AI · v3.1 released
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-[11vw] leading-[0.95] font-bold tracking-tight sm:text-7xl lg:text-8xl"
          style={{ willChange: "opacity, transform" }}
        >
          Turn your CV into a
          <br />
          <span className="text-gradient">3D Portfolio</span>
          {" "}in seconds.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Powered by AI. No coding required. Stand out to recruiters instantly with a live, edge-deployed portfolio site that renders your premium 3D template in milliseconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link to="/cv-studio" className="btn-kinetic glow-pulse group relative inline-flex items-center gap-2 rounded-2xl px-7 py-4 font-display text-base font-semibold">
            <span className="btn-kinetic-sweep" />
            <span className="relative z-10">Start Building for Free</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <a href="#how-it-works" className="glass rounded-2xl px-6 py-4 font-display text-sm font-semibold text-foreground/90 transition hover:text-foreground">
            See how it works
          </a>
        </motion.div>

        {/* Hero glass mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="relative mx-auto mt-20 max-w-4xl"
          style={{ perspective: 1200 }}
        >
          <KineticBorder className="rounded-3xl">
            <div className="glass-strong relative overflow-hidden rounded-3xl p-4 sm:p-6">
              <div className="flex items-center gap-1.5 pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 text-xs text-muted-foreground">careeros.ai / studio</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
                <div className="glass rounded-2xl p-5">
                  <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Agent transcript</div>
                  {[
                    "Parsing 4-year work history…",
                    "Rewriting achievements in impact voice…",
                    "Generating design system: obsidian / violet…",
                    "Deploying portfolio → live in 8s",
                  ].map((t, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.9 + i * 0.15 }}
                      className="flex items-center gap-2 py-1.5 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.85 0.18 210)", boxShadow: "0 0 10px oklch(0.85 0.18 210)" }} />
                      <span className="text-foreground/85">{t}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="glass relative flex items-center justify-center overflow-hidden rounded-2xl p-6">
                  <WebMeshGlyph />
                </div>
              </div>
            </div>
          </KineticBorder>
          <div className="absolute -inset-x-10 -bottom-10 h-40 rounded-full blur-3xl"
            style={{ background: "radial-gradient(ellipse, oklch(0.72 0.24 300 / 0.35), transparent 70%)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function SplitPath() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The split-path architecture</div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Two agents. <span className="text-gradient">One career OS.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Path A */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <KineticBorder className="h-full rounded-3xl">
              <div className="glass-strong h-full rounded-3xl p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">Path A</span>
                  <span className="text-xs text-muted-foreground">Smart CV Studio</span>
                </div>
                <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  A resume that <span className="text-gradient">rewrites itself.</span>
                </h3>
                <p className="mt-4 max-w-md text-sm text-muted-foreground">
                  Drop any doc, LinkedIn URL, or voice note. Our parsing agent extracts, ranks, and rewrites every bullet into recruiter-tuned impact language, then renders it as a print-perfect PDF.
                </p>
                <div className="mt-8">
                  <DataExtractionGlyph />
                </div>
                <ul className="mt-8 space-y-2 text-sm">
                  {["Multimodal parsing (PDF, DOCX, audio)", "ATS-optimised, tuned to any job description", "Vector-crisp PDF export"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-foreground/85">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.72 0.24 300)", boxShadow: "0 0 10px oklch(0.72 0.24 300)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </KineticBorder>
          </motion.div>

          {/* Path B */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
          >
            <KineticBorder className="h-full rounded-3xl">
              <div className="glass-strong h-full rounded-3xl p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">Path B</span>
                  <span className="text-xs text-muted-foreground">Agentic Portfolio Builder</span>
                </div>
                <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  A live site, <span className="text-gradient">deployed in seconds.</span>
                </h3>
                <p className="mt-4 max-w-md text-sm text-muted-foreground">
                  An orchestrator spins up copy, design tokens, and layout — then autonomously deploys your portfolio to the edge with a live custom link. No hosting to configure.
                </p>
                <div className="mt-8">
                  <WebMeshGlyph />
                </div>
                <ul className="mt-8 space-y-2 text-sm">
                  {["Autonomous copywriting + design system", "One-click custom domain", "Instant global edge deployment"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-foreground/85">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.85 0.18 210)", boxShadow: "0 0 10px oklch(0.85 0.18 210)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </KineticBorder>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ──────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      n: "01",
      title: "Upload Your CV",
      body: "Drag & drop your PDF resume or paste raw text. Our extractor handles any format — multipage, multi-column, DOCX converted to PDF.",
      hue: "270",
    },
    {
      icon: Bot,
      n: "02",
      title: "AI Structures Your Data",
      body: "Groq LLaMA 3.3 extracts your name, experience, projects, skills, and education into a strict typed JSON payload — the source of truth for every template.",
      hue: "210",
    },
    {
      icon: Rocket,
      n: "03",
      title: "Deploy to Global Edge",
      body: "Pick a premium 3D template — Blueprint Sphere, Vibrant Glass, Neon Canvas, and more. Hit publish and get a permanent shareable URL in under 3 seconds.",
      hue: "150",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">How it works</div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Three steps to <span className="text-gradient">go live.</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            From raw PDF to published 3D portfolio — no configuration, no hosting decisions, no code.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
                whileHover={{ y: -6 }}
                className="glass-strong relative overflow-hidden rounded-3xl p-8"
              >
                {/* background hue glow */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
                  style={{ background: `radial-gradient(circle, oklch(0.75 0.22 ${s.hue} / 0.25), transparent 70%)`, filter: "blur(24px)" }}
                />
                {/* step number */}
                <div className="absolute right-6 top-6 font-display text-5xl font-bold tracking-tight"
                  style={{ color: `oklch(0.75 0.22 ${s.hue} / 0.12)` }}>
                  {s.n}
                </div>
                <div
                  className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: `oklch(0.75 0.22 ${s.hue} / 0.15)`,
                    border: `1px solid oklch(0.75 0.22 ${s.hue} / 0.35)`,
                  }}
                >
                  <Icon size={22} style={{ color: `oklch(0.85 0.2 ${s.hue})` }} />
                </div>
                <h3 className="relative font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="relative mt-3 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                <div className="relative mt-6 h-px w-full" style={{ background: `linear-gradient(90deg, oklch(0.75 0.22 ${s.hue} / 0.4), transparent)` }} />
                <div className="relative mt-4 flex items-center gap-2 text-xs font-semibold" style={{ color: `oklch(0.85 0.2 ${s.hue})` }}>
                  <CheckCircle2 size={13} /> Step {parseInt(s.n)} complete
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Template Showcase ─────────────────────────────────────────────────── */
function TemplateShowcase() {
  const templates = [
    { id: "blueprint-sphere-main", name: "Blueprint Sphere", tag: "3D Interactive", hue: "270", desc: "Immersive Three.js globe with orbital navigation and particle systems." },
    { id: "vibrant-glass", name: "Vibrant Glass", tag: "Glassmorphism", hue: "210", desc: "Layered backdrop-blur panels with vibrant gradient light sources." },
    { id: "neon-canvas", name: "Neon Canvas", tag: "Dark & Bold", hue: "300", desc: "High-contrast neon typography over animated scanline backgrounds." },
    { id: "golden-legacy", name: "Golden Legacy", tag: "Elegant", hue: "45", desc: "Warm gold serif typography — timeless, editorial, print-ready." },
    { id: "data-scientist", name: "Data Scientist", tag: "Technical", hue: "180", desc: "Monospace grids, live chart aesthetics, and metric-first hierarchy." },
    { id: "future-forward", name: "Future Forward", tag: "Futuristic", hue: "230", desc: "Holographic UI elements with depth-of-field blur and aurora glows." },
  ];

  return (
    <section id="templates" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Template Gallery</div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            9 premium templates. <span className="text-gradient">Zero compromises.</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Every template is a fully interactive React application, not a static page. Pick yours in the Studio — you can switch anytime without losing your data.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_40px_oklch(0.75_0.22_var(--t-hue)/0.15)]"
              style={{ "--t-hue": t.hue } as React.CSSProperties}
            >
              {/* ambient glow */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, oklch(0.75 0.22 ${t.hue} / 0.3), transparent 70%)`, filter: "blur(20px)" }}
              />
              {/* header */}
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: `oklch(0.75 0.22 ${t.hue} / 0.15)`,
                    border: `1px solid oklch(0.75 0.22 ${t.hue} / 0.3)`,
                  }}
                >
                  <Layers size={18} style={{ color: `oklch(0.85 0.2 ${t.hue})` }} />
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
                  style={{
                    background: `oklch(0.75 0.22 ${t.hue} / 0.12)`,
                    color: `oklch(0.85 0.2 ${t.hue})`,
                    border: `1px solid oklch(0.75 0.22 ${t.hue} / 0.25)`,
                  }}
                >
                  {t.tag}
                </span>
              </div>
              {/* mock viewport */}
              <div className="mt-4 h-28 overflow-hidden rounded-xl border border-white/8 bg-white/[0.03]">
                <div className="flex h-4 items-center gap-1 border-b border-white/5 px-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                  <span className="ml-1 h-1 w-20 rounded bg-white/8" />
                </div>
                <div className="grid grid-cols-6 gap-1 p-2">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <div
                      key={j}
                      className="aspect-square rounded"
                      style={{
                        background: j % 4 === 0 ? `oklch(0.75 0.22 ${t.hue} / 0.4)` : "oklch(1 0 0 / 0.05)",
                        border: "1px solid oklch(1 0 0 / 0.07)",
                      }}
                    />
                  ))}
                </div>
                <div className="space-y-1 px-2">
                  <div className="h-1.5 w-3/4 rounded" style={{ background: `oklch(0.75 0.22 ${t.hue} / 0.3)` }} />
                  <div className="h-1.5 w-1/2 rounded bg-white/10" />
                </div>
              </div>
              {/* info */}
              <h3 className="mt-4 font-display text-base font-semibold">{t.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              {/* CTA */}
              <Link
                to="/cv-studio"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-foreground/70 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white/10 hover:text-foreground"
              >
                <ExternalLink size={12} /> Use this template
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            to="/cv-studio"
            className="btn-kinetic glow-pulse group relative inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-display text-sm font-semibold"
          >
            <span className="btn-kinetic-sweep" />
            <span className="relative z-10">Browse all templates in the Studio</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Dashboard() {
  return (
    <section id="dashboard" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Studio · Preview</div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Every asset, <span className="text-gradient">generated live.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="mt-16"
        >
          <KineticBorder className="rounded-3xl">
            <div className="glass-strong rounded-3xl p-4 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                {/* CV Preview */}
                <div className="glass relative overflow-hidden rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Generated CV · Rev 4</div>
                    <div className="text-xs text-muted-foreground">A. Kim / Product</div>
                  </div>
                  <div className="mt-5 font-display text-3xl font-semibold tracking-tight">Ari Kim</div>
                  <div className="text-sm text-muted-foreground">Senior Product Designer · Berlin</div>
                  <div className="mt-6 space-y-3">
                    {[["Experience", 92], ["Impact voice", 88], ["ATS match", 96]].map(([label, val]) => (
                      <div key={label as string}>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{label as string}</span><span>{val}%</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }} whileInView={{ width: `${val}%` }}
                            viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: "var(--gradient-kinetic)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {["Figma", "Systems", "Research", "AI/ML", "Roadmapping", "Storytelling"].map((t) => (
                      <div key={t} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center text-xs text-foreground/80">{t}</div>
                    ))}
                  </div>

                  {/* Paywall lock */}
                  <div className="relative mt-6">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">High-res export</div>
                      <div className="mt-2 h-14 space-y-2">
                        <div className="h-2 w-3/4 rounded bg-white/10" />
                        <div className="h-2 w-1/2 rounded bg-white/10" />
                        <div className="h-2 w-2/3 rounded bg-white/10" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                      style={{ background: "oklch(0.10 0.03 280 / 0.82)" }}>
                      <div className="glass flex items-center gap-3 rounded-full px-4 py-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: "oklch(0.72 0.24 300)", animation: "pulse-dot 2s ease-in-out infinite", color: "oklch(0.72 0.24 300 / 0.5)" }}
                        />
                        <span className="text-xs font-semibold tracking-wide">Unlock Pro · High-res PDF</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portfolio preview */}
                <div className="glass relative overflow-hidden rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Portfolio · Live preview</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.75 0.2 150)", boxShadow: "0 0 8px oklch(0.75 0.2 150)" }} />
                      deploying
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-6 gap-2">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                        className="aspect-square rounded-md"
                        style={{
                          background: i % 5 === 0 ? "var(--gradient-kinetic)" : "oklch(1 0 0 / 0.05)",
                          border: "1px solid oklch(1 0 0 / 0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="h-2 w-2/3 rounded bg-white/10" />
                    <div className="h-2 w-1/2 rounded bg-white/10" />
                  </div>

                  {/* live link paywall */}
                  <div className="relative mt-6">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Live cloud link</div>
                      <div className="mt-2 font-mono text-sm text-foreground/70">ari-kim.nexus.app</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                      style={{ background: "oklch(0.10 0.03 280 / 0.82)" }}>
                      <div className="glass flex items-center gap-3 rounded-full px-4 py-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: "oklch(0.85 0.18 210)", animation: "pulse-dot 2s ease-in-out infinite", color: "oklch(0.85 0.18 210 / 0.5)" }}
                        />
                        <span className="text-xs font-semibold tracking-wide">Unlock Pro · Live custom link</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </KineticBorder>
        </motion.div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Preview",
      price: "$0",
      cadence: "forever",
      pitch: "Explore the studio, ship watermarked drafts.",
      features: ["Full AI CV studio", "Watermarked PDF export", "UI preview of your portfolio", "Community templates"],
      cta: "Start free",
      highlight: false,
    },
    {
      name: "Pro Export",
      price: "$15",
      cadence: "one-time",
      pitch: "Ship high-res assets and a live portfolio the world can visit.",
      features: ["High-res, watermark-free PDF", "Live cloud portfolio + custom link", "Unlimited regenerations", "Priority agent runtime"],
      cta: "Unlock Pro",
      highlight: true,
    },
  ];
  return (
    <section id="pricing" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Pricing</div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Preview free. <span className="text-gradient">Ship for $15.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Two tiers. No subscription theatre.</p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {t.highlight ? (
                <KineticBorder className="h-full rounded-3xl">
                  <TierBody t={t} />
                </KineticBorder>
              ) : (
                <div className="h-full rounded-3xl border border-white/10 transition group-hover:border-white/25">
                  <TierBody t={t} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TierBody = memo(function TierBody({ t }: { t: { name: string; price: string; cadence: string; pitch: string; features: string[]; cta: string; highlight: boolean } }) {
  return (
    <div className={`h-full rounded-3xl p-8 sm:p-10 ${t.highlight ? "glass-strong" : "glass"}`}>
      <div className="flex items-baseline justify-between">
        <div>
          <div className="font-display text-lg font-semibold">{t.name}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{t.cadence}</div>
        </div>
        {t.highlight && (
          <span className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
            style={{ background: "oklch(0.72 0.24 300 / 0.15)", color: "oklch(0.9 0.14 300)", border: "1px solid oklch(0.72 0.24 300 / 0.35)" }}>
            Most shipped
          </span>
        )}
      </div>
      <div className="mt-6 flex items-end gap-2">
        <div className={`font-display text-6xl font-bold tracking-tight ${t.highlight ? "text-gradient" : ""}`}>{t.price}</div>
        <div className="pb-2 text-sm text-muted-foreground">{t.cadence === "one-time" ? "/ export" : ""}</div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t.pitch}</p>
      <ul className="mt-8 space-y-3 text-sm">
        {t.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: t.highlight ? "var(--gradient-kinetic)" : "oklch(1 0 0 / 0.5)",
                       boxShadow: t.highlight ? "0 0 10px oklch(0.72 0.24 300)" : "none" }} />
            <span className="text-foreground/85">{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/signup"
        className={`mt-10 flex w-full items-center justify-center rounded-2xl py-4 font-display text-sm font-semibold transition ${
          t.highlight ? "btn-kinetic glow-pulse" : "glass hover:bg-white/[0.08]"
        }`}
      >
        <span className="relative z-10">{t.cta}</span>
      </Link>
    </div>
  );
});

const Footer = memo(function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="relative h-6 w-6">
            <div className="absolute inset-0 rounded-md" style={{ background: "var(--gradient-kinetic)" }} />
            <div className="absolute inset-[2px] rounded bg-background/70 grid place-items-center text-[10px] font-bold text-gradient font-display">N</div>
          </div>
          <span className="font-display text-sm">CareerOS · Agentic Career Platform</span>
        </div>
        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} CareerOS. Engineered on the edge.</div>
      </div>
    </footer>
  );
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Inject performance CSS keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: PERF_STYLES }} />
      <Nav />
      <Hero />
      <HowItWorks />
      <SplitPath />
      <TemplateShowcase />
      <Dashboard />
      <Pricing />
      <Footer />
    </main>
  );
}
