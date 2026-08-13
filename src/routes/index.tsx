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

export const Route = createFileRoute("/")({
  component: Landing,
});


/* ── CSS keyframes injected once — all infinite animations live here (GPU) ── */
// Animation components removed

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
        <div className="hidden items-center gap-7 text-sm text-gray-500 md:flex">
          <a href="#how-it-works" className="hover:text-black font-semibold transition">How it works</a>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex h-9 w-24 items-center justify-center rounded-xl bg-white/5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : data?.session ? (
            <Link
              to="/dashboard"
              className="bg-black text-white hover:bg-gray-800 transition rounded-xl px-4 py-2 text-sm font-semibold"
            >
              <span className="relative z-10">Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden items-center gap-1 text-sm text-gray-500 transition hover:text-black font-medium md:flex px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-black text-white hover:bg-gray-800 transition rounded-xl px-4 py-2 text-sm font-semibold"
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
      <motion.div style={{ y: reduce ? 0 : y }} className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
          style={{ willChange: "opacity, transform" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-black" />
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
          Build a Professional
          <br />
          <span className="text-gradient">CV</span>
          {" "}in seconds.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-base text-gray-900 font-medium sm:text-lg"
        >
          Powered by AI. No coding required. Stand out to recruiters instantly with a print-ready, ATS-optimized CV that renders perfectly in milliseconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link to="/cv-studio" className="bg-black text-white hover:bg-gray-800 transition group relative inline-flex items-center gap-2 rounded-2xl px-7 py-4 font-display text-base font-semibold">
            <span className="relative z-10">Start Building for Free</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <a href="#how-it-works" className="glass rounded-2xl px-6 py-4 font-display text-sm font-semibold text-black transition hover:bg-gray-100">
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
            <div className="glass-strong relative overflow-hidden rounded-3xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-1.5 pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="ml-3 text-xs text-gray-900 font-bold">careeros.ai / studio</span>
              </div>
              <div className="glass rounded-2xl p-5 bg-white">
                <div className="mb-3 text-xs uppercase tracking-widest text-gray-900 font-bold">Agent transcript</div>
                {[
                  "Parsing 4-year work history…",
                  "Rewriting achievements in impact voice…",
                  "Generating design system: minimalist / clean…",
                  "Exporting PDF → ready in 2s",
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    <span className="text-black font-semibold">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          
        </motion.div>
      </motion.div>
    </section>
  );
}

function SplitPath() { return null; }

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
      title: "Export Print-Ready PDF",
      body: "Pick a premium, minimalist template. Hit export and get a high-resolution PDF that parses perfectly in any ATS system.",
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
          <div className="text-xs uppercase tracking-[0.3em] text-gray-900 font-bold">How it works</div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Three steps to <span className="text-gradient">go live.</span>
          </h2>
          <p className="mt-4 text-sm text-gray-900 font-medium">
            From raw text to a professional CV — no complex configuration or formatting struggles.
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
                {/* background hue glow removed */}
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
                <h3 className="relative font-display text-xl font-semibold tracking-tight text-black">{s.title}</h3>
                <p className="relative mt-3 text-sm text-gray-900 font-medium leading-relaxed">{s.body}</p>
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

function TemplateShowcase() { return null; }
function Dashboard() { return null; }

function Pricing() { return null; }

const Footer = memo(function Footer() {
  return (
    <footer className="relative border-t border-gray-200 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="relative h-6 w-6">
            <div className="absolute inset-0 rounded-md bg-black" />
            <div className="absolute inset-[2px] rounded bg-white grid place-items-center text-[10px] font-bold text-black font-display">N</div>
          </div>
          <span className="font-display text-sm font-semibold text-black">CareerOS · Agentic Career Platform</span>
        </div>
        <div className="text-xs text-gray-500 font-medium">© {new Date().getFullYear()} CareerOS. Completely Free.</div>
      </div>
    </footer>
  );
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-white">
      <Nav />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}
