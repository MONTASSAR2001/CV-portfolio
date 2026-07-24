import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const TICKER_WORDS = [
  "WORDS",
  "★",
  "THAT",
  "★",
  "MOVE",
  "★",
  "MARKETS",
  "★",
  "MINDS",
  "★",
  "&",
  "★",
  "METRICS",
  "★",
];

function CylinderTicker({ radius = 4, y = 0, speed = 0.15, reverse = false }: { radius?: number; y?: number; speed?: number; reverse?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const words = useMemo(() => TICKER_WORDS, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (reverse ? -1 : 1) * speed * delta;
  });

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {words.map((w, i) => {
        const angle = (i / words.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <Text
            key={i}
            position={[x, 0, z]}
            rotation={[0, angle + Math.PI, 0]}
            fontSize={1.5}
            font="https://fonts.gstatic.com/s/archivoblack/v21/HTxqL289NzCGg4MzN6KJ7eW6OYuP_x7yx3A.woff"
            color={w === "★" ? "#ef2b2b" : "#0a0a0a"}
            anchorX="center"
            anchorY="middle"
            letterSpacing={-0.03}
          >
            {w}
          </Text>
        );
      })}
    </group>
  );
}

import type { PortfolioData } from "@/components/portfolio-builder/types";

export function KineticHero({ data }: { data?: PortfolioData }) {
  return (
    <section className="relative border-b border-ink bg-paper">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-4 px-6 pt-8 pb-4">
        <div className="col-span-6 text-mono text-xs">Vol. 07 — Issue 24</div>
        <div className="col-span-6 text-right text-mono text-xs">Friday, July 24, 2026 · Est. 2019</div>
      </div>
      <div className="border-y border-ink">
        <div className="mx-auto max-w-[1600px] px-6 py-6">
          <p className="text-mono text-[0.7rem] text-muted-foreground">{data?.personalInfo?.role || "Copywriter · Content editor · Voice architect"}</p>
        </div>
      </div>

      <div className="relative h-[75vh] w-full overflow-hidden">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={["#f7f4ec"]} />
          <ambientLight intensity={1} />
          <CylinderTicker radius={4.2} y={1.6} speed={0.18} />
          <CylinderTicker radius={4.2} y={0} speed={0.28} reverse />
          <CylinderTicker radius={4.2} y={-1.6} speed={0.14} />
        </Canvas>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-transparent to-paper" />
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-4 border-t border-ink px-6 py-10">
        <h1 className="text-display col-span-12 text-[clamp(3rem,10vw,10rem)] uppercase">
          {data?.personalInfo?.name?.split(" ")[0] || "Ren Kovac"} <span className="text-neon">/</span> {data?.personalInfo?.role || "Copy Editor"}
        </h1>
        <div className="col-span-12 mt-6 grid grid-cols-12 gap-4 border-t border-ink pt-6">
          <p className="text-serif col-span-12 text-2xl leading-snug italic md:col-span-7">
            I write the sentences that get remembered — and the ones that get bought. Ten years, six industries, one obsession: making language do more with less.
          </p>
          <div className="col-span-12 flex flex-col justify-between gap-4 md:col-span-5">
            <div className="text-mono text-xs text-muted-foreground">Filed under</div>
            <div className="flex flex-wrap gap-2">
              {(data?.skills || ["Brand voice", "Long-form", "Campaigns", "Manifestos", "Naming"]).map((t) => (
                <span key={t} className="border border-ink bg-paper px-3 py-1 text-mono text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
