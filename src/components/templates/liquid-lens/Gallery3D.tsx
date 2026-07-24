import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import g1 from "@/assets/gallery/01.jpg";
import g2 from "@/assets/gallery/02.jpg";
import g3 from "@/assets/gallery/03.jpg";
import g4 from "@/assets/gallery/04.jpg";
import g5 from "@/assets/gallery/05.jpg";
import g6 from "@/assets/gallery/06.jpg";
import type { PortfolioData } from "@/components/portfolio-builder/types";

const IMAGES = [
  { src: g1, title: "Umbra", meta: "PORTRAIT · 2025" },
  { src: g2, title: "Ridgeline", meta: "LANDSCAPE · 2024" },
  { src: g3, title: "Rainlight", meta: "TOKYO · 2025" },
  { src: g4, title: "Solitude", meta: "SAHARA · 2023" },
  { src: g5, title: "Suspend", meta: "STUDIO · 2025" },
  { src: g6, title: "Passage", meta: "OREGON · 2024" },
];

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uAspect; // fit correction

  void main(){
    vec2 uv = (vUv - 0.5) * uAspect + 0.5;
    // clamp
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.03, 0.03, 0.03, 1.0);
      return;
    }
    float glitchLine = step(0.985, fract(sin(uv.y * 90.0 + uTime * 6.0) * 43.0));
    float g = uHover;
    float amt = 0.02 * g + glitchLine * g * 0.02;
    vec2 shift = vec2(amt, 0.0);
    float r = texture2D(uTex, uv + shift).r;
    float gr = texture2D(uTex, uv).g;
    float b = texture2D(uTex, uv - shift).b;
    vec3 col = vec3(r, gr, b);
    // scanline flicker on hover
    col *= 1.0 - g * glitchLine * 0.5;
    // slight brightness boost on hover
    col = mix(col * 0.85, col * 1.05, g);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Card({
  src,
  index,
  count,
  radius,
  rotation,
  onHoverTitle,
}: {
  src: string;
  index: number;
  count: number;
  radius: number;
  rotation: { current: number };
  onHoverTitle: (i: number | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const hoverTarget = useRef(0);
  const hover = useRef(0);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    new THREE.TextureLoader().load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      const img = t.image as HTMLImageElement;
      const ar = img.width / img.height; // ~0.8 (portrait)
      const target = 2 / 2.6; // plane aspect
      // fit "cover" via uAspect scaling; here plane has fixed size, so pass ratio
      const rx = ar / target;
      setAspect(rx > 1 ? [1 / rx, 1] : [1, rx]);
      setTex(t);
    });
  }, [src]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: null as THREE.Texture | null },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useEffect(() => {
    if (tex && matRef.current) {
      matRef.current.uniforms.uTex.value = tex;
      matRef.current.uniforms.uAspect.value.set(aspect[0], aspect[1]);
    }
  }, [tex, aspect]);

  const angleBase = (index / count) * Math.PI * 2;

  useFrame((_, delta) => {
    hover.current += (hoverTarget.current - hover.current) * Math.min(1, delta * 8);
    if (matRef.current) {
      matRef.current.uniforms.uHover.value = hover.current;
      matRef.current.uniforms.uTime.value += delta;
    }
    const g = groupRef.current;
    if (g) {
      const a = angleBase + rotation.current;
      g.position.x = Math.sin(a) * radius;
      g.position.z = Math.cos(a) * radius - radius;
      g.position.y = Math.sin(a * 2 + rotation.current * 0.3) * 0.08;
      g.rotation.y = a + Math.PI;
      // subtle scale on the front-facing card
      const front = Math.cos(a); // 1 when facing
      const s = 1 + Math.max(0, front) * 0.08;
      g.scale.setScalar(s);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoverTarget.current = 1;
        onHoverTitle(index);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hoverTarget.current = 0;
        onHoverTitle(null);
        document.body.style.cursor = "";
      }}
    >
      <mesh>
        <planeGeometry args={[2, 2.6, 1, 1]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
        />
      </mesh>
      {/* frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.02, 2.62)]} />
        <lineBasicMaterial color="#1a1a1a" />
      </lineSegments>
    </group>
  );
}

function Carousel({
  onHoverTitle,
  rotationRef,
  items,
}: {
  onHoverTitle: (i: number | null) => void;
  rotationRef: { current: number };
  items: typeof IMAGES;
}) {
  const { size } = useThree();
  const radius = size.width < 640 ? 3.4 : 4.6;
  return (
    <group>
      {items.map((img, i) => (
        <Card
          key={i} // Use index as key since src could be duplicated fallback images
          src={img.src}
          index={i}
          count={items.length}
          radius={radius}
          rotation={rotationRef}
          onHoverTitle={onHoverTitle}
        />
      ))}
    </group>
  );
}

export function Gallery3D({ data }: { data?: PortfolioData }) {
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const dragRef = useRef<{ dragging: boolean; lastX: number; startX: number; moved: number }>({
    dragging: false,
    lastX: 0,
    startX: 0,
    moved: 0,
  });

  const displayImages = data?.projects?.length
    ? data.projects.map((p, i) => ({
        src: p.imageUrl ?? [g1, g2, g3, g4, g5, g6][i % 6],
        title: p.title,
        meta: (p.highlight ?? p.tech?.[0] ?? "WORK").toUpperCase(),
      }))
    : IMAGES;

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (!dragRef.current.dragging) {
        rotationRef.current += velocityRef.current;
        velocityRef.current *= 0.94;
        // subtle idle drift
        rotationRef.current += 0.0012;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragRef.current.dragging = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.startX = e.clientX;
    dragRef.current.moved = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    dragRef.current.lastX = e.clientX;
    dragRef.current.moved += Math.abs(dx);
    const delta = dx * 0.005;
    rotationRef.current += delta;
    velocityRef.current = delta;
  };
  const onUp = () => {
    dragRef.current.dragging = false;
  };

  const activeTitle = hoverIdx !== null ? displayImages[hoverIdx] : null;

  return (
    <section id="work" className="relative w-full bg-[#080808] py-32">
      <div className="mx-auto flex max-w-[1400px] items-end justify-between px-12">
        <div>
          <div className="mono text-[11px] tracking-[0.4em] text-white/40">
            CHAPTER 02 — SELECTED FRAMES
          </div>
          <h2 className="mt-4 font-display text-5xl font-light tracking-tight text-white md:text-7xl">
            The <span className="italic text-white/70">carousel</span>.
          </h2>
        </div>
        <div className="mono hidden text-right text-[11px] tracking-[0.3em] text-white/40 md:block">
          DRAG TO ROTATE
          <br />
          HOVER TO GLITCH
        </div>
      </div>

      <div
        className="relative mt-16 h-[70vh] w-full cursor-grab select-none active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <Canvas camera={{ position: [0, 0.4, 6], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={["#080808"]} />
          <ambientLight intensity={0.6} />
          <Carousel onHoverTitle={setHoverIdx} rotationRef={rotationRef} items={displayImages} />
        </Canvas>

        {/* Floor gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080808] to-transparent" />

        {/* Overlay title */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div
            className="mono text-[11px] tracking-[0.4em] text-white/40 transition-opacity duration-300"
            style={{ opacity: activeTitle ? 1 : 0.4 }}
          >
            {activeTitle ? activeTitle.meta : "— — —"}
          </div>
          <div
            className="mt-2 font-display text-2xl font-light italic text-white transition-all duration-500"
            style={{
              opacity: activeTitle ? 1 : 0.5,
              transform: activeTitle ? "translateY(0)" : "translateY(6px)",
            }}
          >
            {activeTitle ? activeTitle.title : "drag · spin · look"}
          </div>
        </div>
      </div>
    </section>
  );
}
