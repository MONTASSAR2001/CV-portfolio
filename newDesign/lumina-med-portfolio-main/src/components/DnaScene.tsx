import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function DNA() {
  const group = useRef<THREE.Group>(null);
  const { spheres, rungs } = useMemo(() => {
    const count = 44;
    const spheres: { pos: [number, number, number]; strand: number }[] = [];
    const rungs: { pos: [number, number, number]; rot: [number, number, number]; len: number }[] = [];
    const radius = 1.05;
    const height = 6;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = (t - 0.5) * height;
      const a = t * Math.PI * 4;
      const x1 = Math.cos(a) * radius;
      const z1 = Math.sin(a) * radius;
      const x2 = Math.cos(a + Math.PI) * radius;
      const z2 = Math.sin(a + Math.PI) * radius;
      spheres.push({ pos: [x1, y, z1], strand: 0 });
      spheres.push({ pos: [x2, y, z2], strand: 1 });
      if (i % 2 === 0) {
        const mx = (x1 + x2) / 2;
        const mz = (z1 + z2) / 2;
        const dx = x2 - x1;
        const dz = z2 - z1;
        const len = Math.sqrt(dx * dx + dz * dz);
        const rotY = Math.atan2(dz, dx);
        rungs.push({ pos: [mx, y, mz], rot: [0, -rotY, Math.PI / 2], len });
      }
    }
    return { spheres, rungs };
  }, []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshPhysicalMaterial
            color={s.strand === 0 ? "#e8f1fb" : "#4a90d9"}
            roughness={0.15}
            metalness={0.3}
            clearcoat={1}
            emissive={s.strand === 0 ? "#a8c8ee" : "#2d6cb0"}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      {rungs.map((r, i) => (
        <mesh key={`r-${i}`} position={r.pos} rotation={r.rot}>
          <cylinderGeometry args={[0.035, 0.035, r.len, 16]} />
          <meshStandardMaterial color="#c9d8ea" roughness={0.4} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export default function DnaScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#eaf3fb" />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#7bb8f5" />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#bcdcff" />
      <DNA />
    </Canvas>
  );
}
