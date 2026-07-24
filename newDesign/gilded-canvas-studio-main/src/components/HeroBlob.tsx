import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Environment } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

function Blob({ colorHex, pointer }: { colorHex: string; pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<any>(null);
  const target = useMemo(() => new THREE.Color(colorHex), [colorHex]);
  const current = useMemo(() => new THREE.Color(colorHex), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Very slow drift + subtle pointer parallax
      meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.3 + pointer.current.y * 0.25;
      meshRef.current.rotation.y = t * 0.12 + pointer.current.x * 0.35;
      meshRef.current.position.x += (pointer.current.x * 0.6 - meshRef.current.position.x) * 0.03;
      meshRef.current.position.y += (-pointer.current.y * 0.4 - meshRef.current.position.y) * 0.03;
    }
    if (matRef.current) {
      target.set(colorHex);
      current.lerp(target, Math.min(1, dt * 1.2));
      matRef.current.color = current;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.4}>
      <icosahedronGeometry args={[1, 64]} />
      <MeshDistortMaterial
        ref={matRef}
        color={colorHex}
        distort={0.42}
        speed={1.1}
        roughness={0.18}
        metalness={0.85}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

export function HeroBlob({ color }: { color: string }) {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} color="#fff2d6" />
          <directionalLight position={[-4, -2, -2]} intensity={0.4} color="#e9c58a" />
          <Environment preset="sunset" />
          <Blob colorHex={color} pointer={pointer} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
