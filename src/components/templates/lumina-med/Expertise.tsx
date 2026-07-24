import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ClientOnly } from "./ClientOnly";

type Kind = "heart" | "brain" | "lung" | "helix";

function HeartMesh() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.6;
      ref.current.rotation.x = Math.sin(performance.now() * 0.001) * 0.15;
    }
  });
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.bezierCurveTo(0, 0.9, 0.6, 1.1, 0.6, 0.5);
  shape.bezierCurveTo(0.6, 0.1, 0, -0.2, 0, -0.6);
  shape.bezierCurveTo(0, -0.2, -0.6, 0.1, -0.6, 0.5);
  shape.bezierCurveTo(-0.6, 1.1, 0, 0.9, 0, 0.5);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.35, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 8 });
  return (
    <mesh ref={ref} geometry={geo} scale={0.9}>
      <meshPhysicalMaterial color="#5aa4e6" roughness={0.2} metalness={0.4} clearcoat={1} emissive="#2d6cb0" emissiveIntensity={0.1} />
    </mesh>
  );
}

function BrainMesh() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.5; });
  return (
    <group ref={ref}>
      {Array.from({ length: 22 }).map((_, i) => {
        const t = i / 22;
        const a = t * Math.PI * 6;
        const r = 0.85;
        return (
          <mesh key={i} position={[Math.cos(a) * r, (t - 0.5) * 1.2, Math.sin(a) * r]}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshPhysicalMaterial color="#bcdcff" roughness={0.25} metalness={0.35} clearcoat={1} />
          </mesh>
        );
      })}
    </group>
  );
}

function LungMesh() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.5; });
  return (
    <group ref={ref}>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0, 0]} scale={[0.7, 1.1, 0.7]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshPhysicalMaterial color="#7fb6ea" roughness={0.2} metalness={0.3} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
}

function HelixMesh() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.6; });
  return (
    <group ref={ref}>
      {Array.from({ length: 20 }).map((_, i) => {
        const t = i / 19;
        const a = t * Math.PI * 3;
        const y = (t - 0.5) * 2.4;
        return (
          <group key={i}>
            <mesh position={[Math.cos(a) * 0.55, y, Math.sin(a) * 0.55]}>
              <sphereGeometry args={[0.12, 20, 20]} />
              <meshPhysicalMaterial color="#4a90d9" clearcoat={1} metalness={0.3} />
            </mesh>
            <mesh position={[Math.cos(a + Math.PI) * 0.55, y, Math.sin(a + Math.PI) * 0.55]}>
              <sphereGeometry args={[0.12, 20, 20]} />
              <meshPhysicalMaterial color="#dfeaf7" clearcoat={1} metalness={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function OrganScene({ kind }: { kind: Kind }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.4], fov: 42 }} dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} />
      <pointLight position={[-3, -2, 3]} intensity={0.6} color="#7bb8f5" />
      {kind === "heart" && <HeartMesh />}
      {kind === "brain" && <BrainMesh />}
      {kind === "lung" && <LungMesh />}
      {kind === "helix" && <HelixMesh />}
    </Canvas>
  );
}

const items: {
  id: string;
  kind: Kind;
  title: string;
  tag: string;
  short: string;
  detail: string;
  bullets: string[];
}[] = [
  {
    id: "cardio",
    kind: "heart",
    tag: "01 · Cardiothoracic",
    title: "Minimally invasive cardiac surgery",
    short: "Robot-assisted valve repair and coronary revascularization with sub-24hr recovery windows.",
    detail:
      "A refined surgical practice built around 3D-mapped anatomy, robotic articulation, and same-day mobilization. Patients recover in a serene, monitored suite designed with hospitality architects.",
    bullets: ["Mitral valve reconstruction", "Off-pump CABG", "TAVR & structural heart"],
  },
  {
    id: "neuro",
    kind: "brain",
    tag: "02 · Neuroscience",
    title: "Precision neuromodulation",
    short: "Non-invasive protocols pairing focused ultrasound with cognitive rehabilitation.",
    detail:
      "In collaboration with the Vasari Neuro Lab, we translate imaging biomarkers into individualized stimulation maps — combining focused ultrasound with immersive rehabilitation.",
    bullets: ["Focused ultrasound therapy", "fMRI-guided mapping", "Post-stroke rehabilitation"],
  },
  {
    id: "pulm",
    kind: "lung",
    tag: "03 · Pulmonary",
    title: "Regenerative pulmonary care",
    short: "Cellular therapies for fibrosis and long-term respiratory recovery.",
    detail:
      "A quiet, evidence-first program pairing autologous cell infusions with structured breath training. Every plan is co-designed with our pulmonology and physiotherapy team.",
    bullets: ["Autologous cell therapy", "IPF disease modification", "Pulmonary rehab"],
  },
  {
    id: "genome",
    kind: "helix",
    tag: "04 · Genomic Medicine",
    title: "Genomic risk & longevity",
    short: "Whole-genome sequencing translated into calm, actionable lifetime plans.",
    detail:
      "Whole-genome analysis interpreted by a small panel of clinician-scientists — delivered in a private studio over an unhurried afternoon, with a plan you can actually live with.",
    bullets: ["Whole-genome sequencing", "Polygenic risk scoring", "Longevity planning"],
  },
];

import type { PortfolioData } from "@/components/portfolio-builder/types";

export function Expertise({ data }: { data?: PortfolioData }) {
  const [open, setOpen] = useState<string | null>(null);

  const displayItems = data?.projects?.length
    ? data.projects.map((p, i) => ({
        id: `proj-${i}`,
        kind: (["heart", "brain", "lung", "helix"] as Kind[])[i % 4],
        tag: `0${i + 1} · ${p.highlight || "Project"}`,
        title: p.title,
        short: p.description,
        detail: p.description,
        bullets: p.techStack || p.tech || [],
      }))
    : items;

  return (
    <section id="expertise" className="relative py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-8 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-azure-deep">Expertise & Procedures</div>
            <h2 className="mt-4 font-display text-4xl md:text-6xl text-foreground max-w-2xl leading-[1.05]">
              Four disciplines, one uncompromising standard.
            </h2>
          </div>
          <p className="hidden md:block max-w-sm text-muted-foreground text-sm leading-relaxed">
            Every program is led personally by Dr. Vasari, supported by a compact
            multidisciplinary team. Click a card to explore the practice.
          </p>
        </div>

        <LayoutGroup>
          <div className="grid md:grid-cols-2 gap-6">
            {displayItems.map((it) => {
              const isOpen = open === it.id;
              return (
                <motion.article
                  key={it.id}
                  layout
                  onClick={() => setOpen(isOpen ? null : it.id)}
                  transition={{ layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                  className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-card border border-border/60 shadow-soft hover:shadow-elevate transition-shadow ${
                    isOpen ? "md:col-span-2" : ""
                  }`}
                >
                  <motion.div layout="position" className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{it.tag}</div>
                      <h3 className="mt-4 font-display text-2xl md:text-3xl text-foreground leading-tight">{it.title}</h3>
                      <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">{it.short}</p>
                      <div className="mt-8 inline-flex items-center gap-2 text-sm text-azure-deep">
                        {isOpen ? "Close" : "Expand"}
                        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="inline-block text-lg leading-none">+</motion.span>
                      </div>
                    </div>
                    <motion.div
                      layout
                      className={`relative shrink-0 rounded-2xl bg-gradient-to-br from-azure-soft/50 to-transparent border border-border/40 overflow-hidden ${
                        isOpen ? "h-72 w-full md:w-96" : "h-40 w-40"
                      }`}
                    >
                      <ClientOnly>
                        <OrganScene kind={it.kind} />
                      </ClientOnly>
                    </motion.div>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-border/50 bg-gradient-to-b from-transparent to-secondary/40"
                      >
                        <div className="p-8 md:p-10 grid md:grid-cols-[1.4fr_1fr] gap-10">
                          <p className="text-foreground/80 leading-relaxed text-lg font-light">{it.detail}</p>
                          <ul className="space-y-3">
                            {it.bullets.map((b) => (
                              <li key={b} className="flex items-center gap-3 text-sm text-foreground/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-azure" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
