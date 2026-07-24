import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARC//ENG — Autonomous Robotics & Embedded Systems Engineer" },
      {
        name: "description",
        content:
          "Portfolio of an engineer specializing in autonomous robotics, embedded systems (ESP32, Renesas), and IoT architectures. Full-stack from firmware to cloud.",
      },
      { property: "og:title", content: "ARC//ENG — Robotics & Embedded Systems Engineer" },
      {
        property: "og:description",
        content:
          "High-tech blueprint portfolio: autonomous robotics, embedded firmware, and IoT architectures.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

/* ---------- Data ---------- */

const SKILLS = [
  { label: "ESP32", tag: "MCU" },
  { label: "Renesas RA", tag: "MCU" },
  { label: "STM32", tag: "MCU" },
  { label: "FreeRTOS", tag: "RTOS" },
  { label: "Zephyr", tag: "RTOS" },
  { label: "ROS 2", tag: "ROBOT" },
  { label: "CAN Bus", tag: "PROTO" },
  { label: "MQTT", tag: "PROTO" },
  { label: "BLE 5", tag: "PROTO" },
  { label: "LoRaWAN", tag: "PROTO" },
  { label: "Python", tag: "LANG" },
  { label: "C / C++", tag: "LANG" },
  { label: "Rust", tag: "LANG" },
  { label: "React", tag: "WEB" },
  { label: "Supabase", tag: "CLOUD" },
  { label: "PostgreSQL", tag: "DB" },
  { label: "Docker", tag: "OPS" },
  { label: "OpenCV", tag: "CV" },
];

type Project = {
  id: string;
  code: string;
  year: string;
  title: string;
  summary: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  nodes: string[]; // schematic labels
};

const PROJECTS: Project[] = [
  {
    id: "atlas",
    code: "ATLAS-07",
    year: "2025",
    title: "Cognitive Hub // Smart Facility Mesh",
    summary:
      "Edge AI hub coordinating 240+ sensors across a manufacturing plant. Fuses vision, vibration and telemetry into a real-time twin.",
    stack: ["ESP32-S3", "ROS 2", "Supabase", "MQTT", "TensorRT"],
    metrics: [
      { label: "Nodes", value: "240" },
      { label: "Latency", value: "18ms" },
      { label: "Uptime", value: "99.98%" },
    ],
    nodes: ["SENSOR MESH", "EDGE HUB", "INFERENCE", "TWIN CLOUD", "OPS UI"],
  },
  {
    id: "rover",
    code: "MRS-03",
    year: "2024",
    title: "Mobile Server Robot // Autonomous Delivery",
    summary:
      "Differential-drive robot with on-board compute, SLAM and dynamic obstacle avoidance for indoor logistics runs.",
    stack: ["Renesas RA6M5", "ROS 2 Humble", "LiDAR", "Nav2", "Rust"],
    metrics: [
      { label: "Range", value: "12km" },
      { label: "Payload", value: "8kg" },
      { label: "Nav Rate", value: "40Hz" },
    ],
    nodes: ["LIDAR", "SLAM CORE", "MOTOR CTRL", "FLEET LINK", "TASK QUEUE"],
  },
  {
    id: "grid",
    code: "IOT-14",
    year: "2024",
    title: "Grid Sentinel // Distributed Energy IoT",
    summary:
      "LoRaWAN mesh of power monitors streaming to a Supabase-backed control plane with anomaly detection on the edge.",
    stack: ["STM32L4", "LoRaWAN", "Postgres", "React", "Grafana"],
    metrics: [
      { label: "Devices", value: "1.2k" },
      { label: "Battery", value: "5yr" },
      { label: "Coverage", value: "82km²" },
    ],
    nodes: ["METERS", "LORA GW", "STREAM API", "TSDB", "DASHBOARD"],
  },
  {
    id: "swarm",
    code: "SWM-02",
    year: "2023",
    title: "Drone Swarm // Coordinated Survey",
    summary:
      "Six-agent quadrotor swarm running consensus flight with peer-to-peer mesh and central mission orchestration.",
    stack: ["ESP32", "PX4", "Micro-ROS", "Python", "OpenCV"],
    metrics: [
      { label: "Agents", value: "6" },
      { label: "Mesh RTT", value: "6ms" },
      { label: "Sync", value: "±2ms" },
    ],
    nodes: ["FLIGHT CTRL", "MESH RADIO", "VISION", "MISSION OPS", "TELEMETRY"],
  },
];

/* ---------- Components ---------- */

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => {
        const x0 = Math.random() * 100;
        const y0 = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 40;
        const dy = -(Math.random() * 60 + 20);
        return {
          i,
          style: {
            left: `${x0}%`,
            top: `${y0}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            "--x0": "0px",
            "--y0": "0px",
            "--x1": `${dx}vw`,
            "--y1": `${dy}vh`,
            animation: `particle ${Math.random() * 8 + 6}s linear ${Math.random() * 6}s infinite`,
          } as React.CSSProperties,
        };
      }),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.i}
          className="absolute rounded-full bg-cyan"
          style={{ ...p.style, boxShadow: "0 0 6px var(--cyan)" }}
        />
      ))}
    </div>
  );
}

function CornerBrackets() {
  const c = "absolute h-4 w-4 border-cyan/70";
  return (
    <>
      <span className={`${c} top-0 left-0 border-t border-l`} />
      <span className={`${c} top-0 right-0 border-t border-r`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

function SectionLabel({ id, title }: { id: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="text-xs tracking-[0.3em] text-cyan text-glow-cyan">{id}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-cyan/60 to-transparent" />
      <h2 className="text-xl md:text-2xl font-medium tracking-widest uppercase">{title}</h2>
      <span className="h-px flex-1 bg-gradient-to-l from-cyan/60 to-transparent" />
    </div>
  );
}

/* Rotating 3D skill sphere */
function SkillSphere() {
  const points = useMemo(() => {
    const n = SKILLS.length;
    const r = 190;
    return SKILLS.map((s, i) => {
      // Fibonacci sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      return { ...s, x, y, z };
    });
  }, []);
  return (
    <div className="relative mx-auto flex h-[440px] w-[440px] max-w-full items-center justify-center" style={{ perspective: "900px" }}>
      {/* orbit rings */}
      <div className="absolute inset-8 rounded-full border border-cyan/20" />
      <div className="absolute inset-16 rounded-full border border-cyan/15" />
      <div className="absolute inset-24 rounded-full border border-cyan/10" />
      <div className="animate-sphere relative h-full w-full">
        {points.map((p, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 whitespace-nowrap"
            style={{
              transform: `translate(-50%, -50%) translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
            }}
          >
            <div className="flex items-center gap-1.5 rounded-sm border border-cyan/40 bg-background/60 px-2 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-neon" style={{ boxShadow: "0 0 6px var(--neon)" }} />
              <span className="text-[10px] tracking-widest text-foreground">{p.label}</span>
              <span className="text-[9px] text-cyan/70">{p.tag}</span>
            </div>
          </div>
        ))}
      </div>
      {/* core */}
      <div className="pointer-events-none absolute h-8 w-8 rounded-full bg-cyan/30" style={{ boxShadow: "0 0 40px var(--cyan)" }} />
    </div>
  );
}

/* Hexagon grid alt view */
function HexGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {SKILLS.map((s, i) => (
        <div
          key={i}
          className="group relative aspect-square"
          style={{ clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)" }}
        >
          <div className="absolute inset-0 bg-card/60" />
          <div
            className="absolute inset-0 border border-cyan/40 transition-all group-hover:border-neon"
            style={{ clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)" }}
          />
          <div className="relative flex h-full flex-col items-center justify-center text-center">
            <div className="text-[9px] text-cyan/80">{s.tag}</div>
            <div className="mt-0.5 text-xs font-medium tracking-wider">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Blueprint schematic */
function Schematic({ project }: { project: Project }) {
  const nodes = project.nodes;
  const w = 720;
  const h = 320;
  const pad = 60;
  const step = (w - pad * 2) / (nodes.length - 1);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
      <defs>
        <pattern id="bpg" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="var(--grid)" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="wire" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="100%" stopColor="var(--neon)" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#bpg)" opacity="0.5" />
      {/* wire */}
      <path
        d={nodes
          .map((_, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${h / 2}`)
          .join(" ")}
        fill="none"
        stroke="url(#wire)"
        strokeWidth="1.5"
        className="animate-dash"
      />
      {/* trace overlay */}
      <path
        d={nodes.map((_, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${h / 2}`).join(" ")}
        fill="none"
        stroke="var(--neon)"
        strokeWidth="2"
        className="animate-trace"
        opacity="0.7"
      />
      {nodes.map((n, i) => {
        const x = pad + i * step;
        const y = h / 2;
        return (
          <g key={i}>
            <line x1={x} y1={y - 60} x2={x} y2={y - 20} stroke="var(--cyan)" strokeWidth="0.8" opacity="0.6" />
            <rect x={x - 60} y={y - 90} width="120" height="30" fill="var(--card)" stroke="var(--cyan)" strokeWidth="1" />
            <text x={x} y={y - 71} textAnchor="middle" fontSize="10" fill="var(--foreground)" fontFamily="monospace" letterSpacing="1">
              {n}
            </text>
            <circle cx={x} cy={y} r="8" fill="var(--background)" stroke="var(--neon)" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="3" fill="var(--neon)">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <text x={x} y={y + 30} textAnchor="middle" fontSize="9" fill="var(--muted-foreground)" fontFamily="monospace">
              N{String(i).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      {/* corners */}
      {[
        [10, 10],
        [w - 10, 10],
        [10, h - 10],
        [w - 10, h - 10],
      ].map(([x, y], i) => (
        <g key={i} stroke="var(--cyan)" strokeWidth="1">
          <line x1={x - 8} y1={y} x2={x + 8} y2={y} />
          <line x1={x} y1={y - 8} x2={x} y2={y + 8} />
        </g>
      ))}
    </svg>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bp-grid-sm relative w-full max-w-4xl overflow-hidden border border-cyan/50 bg-card/90 box-glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        <CornerBrackets />
        <div className="flex items-center justify-between border-b border-cyan/30 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-neon animate-blink" style={{ boxShadow: "0 0 8px var(--neon)" }} />
            <span className="text-[10px] tracking-[0.4em] text-cyan">SCHEMATIC / {project.code}</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs tracking-widest text-muted-foreground hover:text-neon"
          >
            [ ESC ] CLOSE
          </button>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="text-[10px] tracking-widest text-cyan">{project.year} // FIELD REPORT</div>
            <h3 className="mt-1 text-2xl font-medium tracking-wide text-glow-cyan">{project.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
            <div className="mt-6 border border-cyan/30 bg-background/60 p-3">
              <Schematic project={project} />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="mb-2 text-[10px] tracking-[0.3em] text-cyan">// TELEMETRY</div>
              <div className="grid grid-cols-3 gap-2">
                {project.metrics.map((m) => (
                  <div key={m.label} className="border border-cyan/30 bg-background/50 p-2 text-center">
                    <div className="text-lg font-medium text-neon text-glow-neon">{m.value}</div>
                    <div className="text-[9px] tracking-widest text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[10px] tracking-[0.3em] text-cyan">// STACK</div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span key={s} className="border border-cyan/40 px-2 py-1 text-[10px] tracking-wider">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="border border-cyan/30 bg-background/50 p-3 text-[10px] leading-relaxed text-muted-foreground">
              <div className="mb-1 text-cyan">$ status --verbose</div>
              <div>» integration: <span className="text-neon">nominal</span></div>
              <div>» handoff: <span className="text-neon">deployed</span></div>
              <div>» maintenance: <span className="text-neon">active</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function Portfolio() {
  const [open, setOpen] = useState<Project | null>(null);
  const [view, setView] = useState<"sphere" | "hex">("sphere");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")} // ${String(
          d.getUTCHours(),
        ).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")} UTC`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      {/* Top HUD bar */}
      <header className="sticky top-0 z-40 border-b border-cyan/25 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-[10px] tracking-[0.3em]">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-neon animate-blink" style={{ boxShadow: "0 0 8px var(--neon)" }} />
            <span className="text-cyan">ARC//ENG</span>
            <span className="text-muted-foreground">SYS.ONLINE</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <a href="#overview" className="hover:text-neon">01 / OVERVIEW</a>
            <a href="#skills" className="hover:text-neon">02 / MATRIX</a>
            <a href="#projects" className="hover:text-neon">03 / DEPLOY</a>
            <a href="#contact" className="hover:text-neon">04 / LINK</a>
          </nav>
          <div className="text-muted-foreground">{clock}</div>
        </div>
      </header>

      {/* HERO */}
      <section id="overview" className="relative min-h-[92vh] overflow-hidden">
        <div className="bp-grid animate-grid-pan absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <Particles />
        {/* scan line */}
        <div
          className="pointer-events-none absolute left-0 right-0 h-24 animate-scan"
          style={{
            background:
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--cyan) 20%, transparent), transparent)",
          }}
        />

        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3 text-[10px] tracking-[0.4em] text-cyan">
            <span className="h-px w-10 bg-cyan" />
            <span>DOSSIER · 0x7F.ENGINEER</span>
          </div>
          <h1 className="max-w-4xl text-4xl leading-[1.05] font-medium tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-glow-cyan">AUTONOMOUS</span> ROBOTICS,
            <br />
            <span className="text-neon text-glow-neon">EMBEDDED</span> SYSTEMS &amp;
            <br />
            IoT ARCHITECTURES.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            » Building the layers between silicon and cloud — firmware, sensor fusion,
            fleet orchestration, and the interfaces that keep humans in the loop.
          </p>

          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { k: "MCU", v: "ESP32 · RA · STM" },
              { k: "STACK", v: "Python · React · SB" },
              { k: "DEPLOY", v: "42 systems" },
              { k: "UPTIME", v: "99.97%" },
            ].map((s) => (
              <div key={s.k} className="relative border border-cyan/30 bg-card/50 p-3 backdrop-blur-sm">
                <CornerBrackets />
                <div className="text-[9px] tracking-[0.3em] text-cyan">{s.k}</div>
                <div className="mt-1 text-xs">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-3 border border-neon bg-neon/10 px-6 py-3 text-xs tracking-[0.3em] text-neon box-glow-neon transition hover:bg-neon/20"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-blink" />
              INITIATE / VIEW PROJECTS
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 border border-cyan/40 px-6 py-3 text-xs tracking-[0.3em] text-cyan hover:border-cyan hover:box-glow-cyan"
            >
              OPEN COMMS CHANNEL →
            </a>
          </div>
          </div>

          {/* PORTRAIT PANEL — drop your photo at /public/portrait.jpg to replace the placeholder */}
          <div className="relative mx-auto w-full max-w-sm lg:mx-0">
            <div className="absolute -inset-3 border border-cyan/30" />
            <div className="absolute -top-6 left-0 text-[10px] tracking-[0.3em] text-cyan">
              // ID.CAPTURE
            </div>
            <div className="absolute -top-6 right-0 text-[10px] tracking-[0.3em] text-neon animate-blink">
              ● REC
            </div>
            <div className="relative aspect-[4/5] overflow-hidden border border-cyan/60 bg-card/60 box-glow-cyan">
              <CornerBrackets />
              {/* subtle grid inside frame */}
              <div className="bp-grid-sm absolute inset-0 opacity-40" />
              {/* photo — replace /portrait.jpg with your own file */}
              <img
                src="/portrait.jpg"
                alt="Portrait of the engineer"
                className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity"
                style={{ filter: "contrast(1.05) saturate(0.85)" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {/* placeholder shown when image fails / not yet added */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <svg viewBox="0 0 80 80" className="h-16 w-16 opacity-60" fill="none" stroke="var(--cyan)" strokeWidth="1">
                  <circle cx="40" cy="30" r="12" />
                  <path d="M15 68 Q40 45 65 68" />
                  <rect x="4" y="4" width="72" height="72" strokeDasharray="4 4" opacity="0.5" />
                </svg>
                <div className="text-[10px] tracking-[0.3em] text-cyan/80">AWAITING UPLINK</div>
                <div className="px-6 text-[9px] leading-relaxed tracking-widest text-muted-foreground">
                  DROP YOUR PHOTO AT
                  <br />
                  <span className="text-neon">/public/portrait.jpg</span>
                </div>
              </div>
              {/* cyan overlay tint */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              {/* crosshair */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2">
                <span className="absolute top-1/2 left-0 h-px w-full bg-cyan/50" />
                <span className="absolute left-1/2 top-0 h-full w-px bg-cyan/50" />
              </div>
              {/* HUD readouts */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[8px] tracking-[0.3em] text-cyan/80">
                <span>FOCUS ▮▮▮▮▯</span>
                <span>0x7F</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[9px] tracking-[0.3em] text-muted-foreground">
              <div className="border border-cyan/30 p-2">
                <div className="text-cyan/80">ROLE</div>
                <div className="mt-0.5 text-foreground">ENGINEER</div>
              </div>
              <div className="border border-cyan/30 p-2">
                <div className="text-cyan/80">CLR</div>
                <div className="mt-0.5 text-foreground">LVL-04</div>
              </div>
              <div className="border border-cyan/30 p-2">
                <div className="text-cyan/80">STAT</div>
                <div className="mt-0.5 text-neon">ACTIVE</div>
              </div>
            </div>
          </div>
        </div>

        {/* corner readouts */}
        <div className="absolute bottom-4 left-6 text-[10px] tracking-widest text-cyan/70">
          LAT 47.6062° N · LNG 122.3321° W · ALT 12m
        </div>
        <div className="absolute bottom-4 right-6 text-[10px] tracking-widest text-cyan/70">
          SIG ∙∙∙∙▮  BAT 98%  ENC AES-256
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="relative border-t border-cyan/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel id="02 / SKILLS.MATRIX" title="Capability Grid" />
          <div className="mb-8 flex items-center justify-between">
            <p className="max-w-xl text-sm text-muted-foreground">
              » Rotating capability vector — from microcontroller registers up to
              production cloud. Toggle projection.
            </p>
            <div className="flex border border-cyan/40">
              {(["sphere", "hex"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 text-[10px] tracking-[0.3em] uppercase transition ${
                    view === v ? "bg-cyan/20 text-neon" : "text-muted-foreground hover:text-cyan"
                  }`}
                >
                  {v === "sphere" ? "◉ 3D" : "⬢ HEX"}
                </button>
              ))}
            </div>
          </div>
          <div className="relative rounded-sm border border-cyan/25 bg-card/40 p-6 md:p-12">
            <CornerBrackets />
            {view === "sphere" ? <SkillSphere /> : <HexGrid />}
          </div>
        </div>
      </section>

      {/* PROJECTS TIMELINE */}
      <section id="projects" className="relative border-t border-cyan/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel id="03 / DEPLOY.LOG" title="Projects Timeline" />
          <div className="relative">
            {/* rail */}
            <div className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-cyan via-cyan/50 to-transparent md:left-1/2" />
            <div className="space-y-10">
              {PROJECTS.map((p, i) => (
                <div key={p.id} className={`relative grid gap-6 md:grid-cols-2 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
                  <div className={`md:[direction:ltr] ${i % 2 ? "md:pr-12" : "md:pr-12"}`}>
                    <button
                      onClick={() => setOpen(p)}
                      className="group relative block w-full overflow-hidden border border-cyan/40 bg-card/60 p-6 text-left transition hover:border-neon hover:box-glow-neon"
                    >
                      <CornerBrackets />
                      <div className="flex items-center justify-between text-[10px] tracking-[0.3em] text-cyan">
                        <span>{p.code}</span>
                        <span>{p.year}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-medium tracking-wide text-foreground group-hover:text-glow-neon">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.stack.slice(0, 4).map((s) => (
                          <span key={s} className="border border-cyan/30 px-2 py-0.5 text-[9px] tracking-wider text-cyan">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center justify-between text-[10px] tracking-[0.3em] text-neon">
                        <span>» OPEN SCHEMATIC</span>
                        <span className="transition group-hover:translate-x-1">→</span>
                      </div>
                    </button>
                  </div>
                  {/* node */}
                  <div className="pointer-events-none absolute top-6 left-4 md:left-1/2 md:-translate-x-1/2">
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <span className="absolute h-4 w-4 rounded-full border border-cyan/50" />
                      <span className="h-2 w-2 rounded-full bg-neon" style={{ boxShadow: "0 0 10px var(--neon)" }} />
                    </div>
                  </div>
                  <div className="hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative border-t border-cyan/20 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionLabel id="04 / COMMS" title="Open Channel" />
          <div className="relative border border-cyan/40 bg-card/60 p-8 box-glow-cyan md:p-12">
            <CornerBrackets />
            <div className="text-[10px] tracking-[0.3em] text-cyan">// TRANSMISSION READY</div>
            <h3 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
              Have a system that needs to <span className="text-neon text-glow-neon">think</span>,{" "}
              <span className="text-cyan text-glow-cyan">move</span>, or{" "}
              <span className="text-neon text-glow-neon">connect</span>?
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              » Open to consulting on autonomy stacks, embedded architecture reviews, and
              cloud-to-edge IoT deployments.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { k: "MAIL", v: "engineer@arc.systems" },
                { k: "NODE", v: "github/arc-eng" },
                { k: "FREQ", v: "linkedin/arc-eng" },
              ].map((c) => (
                <div key={c.k} className="border border-cyan/30 bg-background/50 p-4">
                  <div className="text-[9px] tracking-[0.3em] text-cyan">{c.k}</div>
                  <div className="mt-1 text-xs text-foreground">{c.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-cyan/20 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-[10px] tracking-[0.3em] text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} ARC//ENG · ALL SYSTEMS NOMINAL</div>
          <div>BUILD 0x1A.2F · v4.2.0-stable</div>
        </div>
      </footer>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
