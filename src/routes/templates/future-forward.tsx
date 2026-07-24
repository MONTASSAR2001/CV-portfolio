import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { lazy, useRef, useState } from "react";
import {
  Download, MapPin, Mail, Github, Linkedin, Cpu, Rocket, Bot, Radio,
  Award, Zap, Code2, Lightbulb, Users, Trophy, ArrowUpRight,
} from "lucide-react";

const HeroScene = lazy(() => import("@/components/templates/future-forward/HeroScene"));
import type { PortfolioData } from "@/components/portfolio-builder/types";

export const Route = createFileRoute("/templates/future-forward")({
  head: () => ({
    meta: [
      { title: "Yassine — ENET'COM Sfax · Growth & Future Potential" },
      {
        name: "description",
        content:
          "Interactive 3D portfolio of a telecom engineering student at ENET'COM Sfax — Smart Bella robot, embedded systems, AI projects, and the road to graduation.",
      },
      { property: "og:title", content: "Yassine — ENET'COM Sfax Portfolio" },
      { property: "og:description", content: "3D interactive student portfolio: academic journey, projects, and the Smart Bella robot defense." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const timeline = [
  { year: "2021", title: "Preparatory Cycle — Maths & Physics", body: "Two intense years of foundations: algebra, signals, and the first taste of programming.", icon: Lightbulb },
  { year: "2023", title: "Entered ENET'COM Sfax", body: "Joined the École Nationale d'Électronique et des Télécommunications de Sfax, specializing in electronics & telecom.", icon: Rocket },
  { year: "2024", title: "Embedded Systems Group Project", body: "Built a low-power sensor mesh with Rayen and Anas — soldered, coded, and demoed at the department showcase.", icon: Cpu },
  { year: "2025", title: "AI & IoT Internship", body: "Prototyped a computer-vision pipeline for real-time object tracking on Jetson Nano.", icon: Radio },
  { year: "Jun–Jul 2026", title: "Smart Bella Robot — Final Defense", body: "Graduation defense with teammates Yassine, Rayen & Anas: an autonomous companion robot with voice + gesture control.", icon: Bot, highlight: true },
];

const stack = [
  "Python", "C / C++", "Embedded C", "React", "TypeScript", "TensorFlow",
  "PyTorch", "STM32", "Arduino", "Raspberry Pi", "MATLAB", "LTspice",
  "ROS", "Linux", "Git", "Figma",
];

const projects = [
  {
    title: "Smart Bella",
    tag: "Graduation Project",
    desc: "Autonomous companion robot with voice interaction, computer-vision navigation, and adaptive personality modes.",
    stack: ["ROS", "Python", "OpenCV", "STM32"],
    gradient: "from-brand-orange to-brand-pink",
    icon: Bot,
  },
  {
    title: "MeshSense",
    tag: "Embedded IoT",
    desc: "Low-power distributed sensor mesh for indoor air-quality monitoring, deployed across the ENET'COM labs.",
    stack: ["Arduino", "LoRa", "C", "MQTT"],
    gradient: "from-brand-pink to-brand-purple",
    icon: Radio,
  },
  {
    title: "VisionTrack",
    tag: "AI Internship",
    desc: "Real-time multi-object tracking optimized for Jetson Nano — 30 fps on the edge with a custom lightweight model.",
    stack: ["PyTorch", "CUDA", "OpenCV"],
    gradient: "from-brand-purple to-brand-orange",
    icon: Cpu,
  },
];

const stats = [
  { value: "3+", label: "Group Projects" },
  { value: "16", label: "Technologies" },
  { value: "2026", label: "Graduation" },
  { value: "∞", label: "Curiosity" },
];

const achievements = [
  { icon: Trophy, title: "Top 10 Robotics Challenge", body: "ENET'COM inter-department competition, 2025." },
  { icon: Award, title: "Best IoT Prototype", body: "Departmental showcase for MeshSense, 2024." },
  { icon: Users, title: "Tech Club Coordinator", body: "Leading weekly hardware workshops on campus." },
  { icon: Zap, title: "Hackathon Finalist", body: "Sfax Regional AI Hackathon — 48h build sprint." },
];

function Blobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Grid mesh */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.58 0.25 300 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.58 0.25 300 / 0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 75%)",
        }}
      />
      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Blobs */}
      <div className="absolute -top-32 -left-32 h-[42rem] w-[42rem] rounded-full opacity-70 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.78 0.19 55 / 0.9), transparent 60%)" }} />
      <div className="absolute top-1/3 -right-40 h-[46rem] w-[46rem] rounded-full opacity-60 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.72 0.24 355 / 0.9), transparent 60%)", animationDelay: "-7s" }} />
      <div className="absolute bottom-[-15rem] left-1/4 h-[44rem] w-[44rem] rounded-full opacity-60 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.58 0.25 300 / 0.9), transparent 60%)", animationDelay: "-14s" }} />
      <div className="absolute top-2/3 right-1/3 h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.85 0.15 200 / 0.7), transparent 60%)", animationDelay: "-4s" }} />
    </div>
  );
}

function TimelineItem({ item, index }: { item: typeof timeline[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 40%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -40 : 40, 0]);
  const dotScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.5]);
  const isLeft = index % 2 === 0;
  const Icon = item.icon;

  return (
    <motion.div ref={ref} style={{ opacity }}
      className={`relative flex w-full items-center gap-4 md:gap-10 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
      <div className="hidden flex-1 md:block" />
      <div className="relative flex flex-col items-center">
        <motion.div style={{ scale: dotScale }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand shadow-[0_0_0_6px_oklch(1_0_0),0_10px_30px_-5px_oklch(0.58_0.25_300/0.5)]">
          <Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
          <motion.span style={{ opacity }} className="absolute inset-0 rounded-full bg-gradient-brand blur-lg" />
        </motion.div>
      </div>
      <motion.div style={{ x }}
        className={`flex-1 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_40px_-15px_oklch(0.58_0.25_300/0.25)] backdrop-blur-md ${item.highlight ? "ring-2 ring-brand-pink/50" : ""}`}>
        <div className="mb-2 inline-flex items-center gap-2">
          <span className="rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-white">{item.year}</span>
          {item.highlight && <span className="rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-semibold text-brand-orange">{item.highlight}</span>}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
      </motion.div>
    </motion.div>
  );
}

function DraggableTag({ label, i }: { label: string; i: number }) {
  const colors = [
    "from-brand-orange to-brand-pink",
    "from-brand-pink to-brand-purple",
    "from-brand-purple to-brand-orange",
  ];
  return (
    <motion.div
      drag
      dragConstraints={{ left: -60, right: 60, top: -60, bottom: 60 }}
      dragElastic={0.6}
      whileDrag={{ scale: 1.2, zIndex: 20, rotate: 5 }}
      whileHover={{ scale: 1.1, y: -6 }}
      className={`cursor-grab active:cursor-grabbing rounded-full bg-gradient-to-r ${colors[i % 3]} px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_oklch(0.58_0.25_300/0.6)] select-none`}
    >
      {label}
    </motion.div>
  );
}

function ProjectCard({ p, i }: { p: typeof projects[number]; i: number }) {
  const Icon = p.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-7 backdrop-blur-md transition hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_oklch(0.58_0.25_300/0.4)]"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mouse.x}px ${mouse.y}px, oklch(0.72 0.24 355 / 0.15), transparent 40%)`,
        }}
      />
      <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient} shadow-lg`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-purple">{p.tag}</p>
      <h3 className="text-2xl font-bold">{p.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <span key={s} className="rounded-full border border-foreground/10 bg-white/60 px-3 py-1 text-xs font-medium text-foreground/70">{s}</span>
        ))}
      </div>
      <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-foreground/30 transition group-hover:rotate-45 group-hover:text-brand-pink" />
    </motion.div>
  );
}

function HeroFallback() {
  return (
    <div className="flex h-[26rem] w-full items-center justify-center md:h-[32rem]">
      <div className="h-48 w-48 rounded-full bg-gradient-brand opacity-60 blur-2xl animate-blob" />
    </div>
  );
}

function Index({ data }: { data?: PortfolioData }) {
  const name = data?.personalInfo?.name ?? "Yassine";
  const bio = data?.personalInfo?.bio ?? "Telecom & electronics engineering student at the École Nationale d'Électronique et des Télécommunications de Sfax. Building embedded systems, AI projects, and — this summer — defending the Smart Bella robot.";
  const role = data?.personalInfo?.role ?? "Growing into what's next.";
  const email = data?.personalInfo?.email ?? "yassine@enetcom.tn";
  const github = data?.personalInfo?.socials?.github ?? "#";
  const linkedin = data?.personalInfo?.socials?.linkedin ?? "#";

  const displayTimeline = data?.experience?.length
    ? data.experience.map((exp, i) => ({
        year: exp.period ?? "Current",
        title: exp.role,
        body: exp.description ?? exp.company,
        icon: [Lightbulb, Rocket, Cpu, Radio, Bot][i % 5],
        highlight: i === 0 ? "Latest" : undefined,
      }))
    : timeline;

  const displayProjects = data?.projects?.length
    ? data.projects.map((p, i) => ({
        title: p.title,
        tag: p.highlight ?? "Project",
        desc: p.description,
        stack: p.techStack ?? p.tech ?? [],
        gradient: ["from-brand-orange to-brand-pink", "from-brand-pink to-brand-purple", "from-brand-purple to-brand-orange"][i % 3],
        icon: [Bot, Radio, Cpu][i % 3],
      }))
    : projects;

  const displayStack = data?.skills?.length ? data.skills : stack;

  const displayStats = data?.experience?.length
    ? [
        { value: String(data.projects?.length ?? 3), label: "Group Projects" },
        { value: String(data.skills?.length ?? 16), label: "Technologies" },
        { value: String(data.education?.length ?? 1), label: "Degrees" },
        { value: "∞", label: "Curiosity" },
      ]
    : stats;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Blobs />

      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-lg">{name.charAt(0).toUpperCase()}</span>
          <span>{name.split(" ")[0]}.dev</span>
        </div>
        <div className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#journey" className="hover:text-foreground">Journey</a>
          <a href="#projects" className="hover:text-foreground">Projects</a>
          <a href="#stack" className="hover:text-foreground">Stack</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 pt-8 pb-24 md:grid-cols-2 md:pt-16">
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <MapPin className="h-3.5 w-3.5" /> ENET'COM · Sfax, Tunisia
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl font-bold leading-[1.05] md:text-7xl">
            {role.split(" ").slice(0, 2).join(" ")} <br />
            <span className="text-gradient">{role.split(" ").slice(2).join(" ")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_-15px_oklch(0.58_0.25_300/0.6)] transition hover:opacity-95">
              See my projects
            </a>
            <a href="#journey" className="rounded-full border border-foreground/15 bg-white/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white">
              Academic journey
            </a>
          </motion.div>

          {/* Stats */}
          <div className="mt-12 grid max-w-md grid-cols-4 gap-4">
            {displayStats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-2xl border border-white/60 bg-white/50 p-3 text-center backdrop-blur">
                <div className="text-gradient text-2xl font-bold">{s.value}</div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <ClientOnly fallback={<HeroFallback />}>
          <HeroScene />
        </ClientOnly>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">Featured Projects</p>
            <h2 className="text-4xl font-bold md:text-5xl">Things I've <span className="text-gradient">built</span></h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Hardware, software, and the messy joyful place where they meet. Group work with Yassine, Rayen & Anas.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
        </div>
      </section>

      {/* Timeline */}
      <section id="journey" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-purple">Academic Journey</p>
          <h2 className="text-4xl font-bold md:text-5xl">Milestones on the <span className="text-gradient">way up</span></h2>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-brand-orange/40 via-brand-pink/40 to-brand-purple/40 md:block" />
          <div className="space-y-14">
            {displayTimeline.map((item, i) => <TimelineItem key={item.year} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-pink">Recognition</p>
          <h2 className="text-4xl font-bold md:text-5xl">Little <span className="text-gradient">wins</span></h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand shadow-lg">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section id="stack" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-pink">Tech Stack & Learning</p>
          <h2 className="text-4xl font-bold md:text-5xl">Tools I <span className="text-gradient">play with</span></h2>
          <p className="mt-4 text-muted-foreground">Grab a tag, drag it around — everything here is fair game.</p>
        </div>
        <div className="relative flex min-h-[280px] flex-wrap items-center justify-center gap-4 rounded-3xl border border-white/60 bg-white/40 p-10 backdrop-blur-md">
          {displayStack.map((s, i) => <DraggableTag key={s} label={s} i={i} />)}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <Code2 className="mx-auto mb-6 h-10 w-10 text-brand-purple" />
        <h2 className="text-4xl font-bold md:text-5xl">Let's <span className="text-gradient">build something</span></h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Open to internships, research collaborations, and passionate hardware/AI teams.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a href={`mailto:${email}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur transition hover:scale-110 hover:bg-gradient-brand hover:text-white">
            <Mail className="h-5 w-5" />
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur transition hover:scale-110 hover:bg-gradient-brand hover:text-white">
            <Github className="h-5 w-5" />
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur transition hover:scale-110 hover:bg-gradient-brand hover:text-white">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-16 text-xs text-muted-foreground">© {new Date().getFullYear()} · Built with curiosity.</p>
      </section>

      {/* Floating Resume FAB */}
      <motion.a href="#"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-4 font-semibold text-white shadow-[0_20px_50px_-15px_oklch(0.58_0.25_300/0.7)]">
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-brand animate-pulse-ring" />
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-brand animate-pulse-ring" style={{ animationDelay: "1s" }} />
        <Download className="relative h-5 w-5" />
        <span className="relative hidden sm:inline">Download Resume</span>
      </motion.a>
    </div>
  );
}
