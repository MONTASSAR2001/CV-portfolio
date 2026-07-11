import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function DNAHelix({ zoom, tilt }: { zoom: number; tilt: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const strands = useMemo(() => {
    const turns = 4;
    const points = 120;
    const radius = 1.3;
    const height = 6;
    const a: [number, number, number][] = [];
    const b: [number, number, number][] = [];
    const rungs: Array<{ a: [number, number, number]; b: [number, number, number] }> = [];
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;
      const p1: [number, number, number] = [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
      const p2: [number, number, number] = [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius];
      a.push(p1);
      b.push(p2);
      if (i % 4 === 0) rungs.push({ a: p1, b: p2 });
    }
    return { a, b, rungs };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.25;
    // smooth zoom + tilt
    groupRef.current.scale.lerp(new THREE.Vector3(zoom, zoom, zoom), 0.06);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tilt, 0.06);
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      (zoom - 1) * -1.4,
      0.06,
    );
  });

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.11, 20, 20), []);
  const nodeMatA = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#7de8ff",
        emissive: "#3ad0ff",
        emissiveIntensity: 1.6,
        roughness: 0.2,
        metalness: 0.1,
      }),
    [],
  );
  const nodeMatB = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#84ffb8",
        emissive: "#3affa0",
        emissiveIntensity: 1.4,
        roughness: 0.2,
        metalness: 0.1,
      }),
    [],
  );

  return (
    <group ref={groupRef}>
      {strands.a.map((p, i) => (
        <mesh key={`a${i}`} position={p} geometry={sphereGeo} material={nodeMatA} />
      ))}
      {strands.b.map((p, i) => (
        <mesh key={`b${i}`} position={p} geometry={sphereGeo} material={nodeMatB} />
      ))}
      {strands.rungs.map((r, i) => {
        const start = new THREE.Vector3(...r.a);
        const end = new THREE.Vector3(...r.b);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dir = end.clone().sub(start);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize(),
        );
        return (
          <mesh key={`r${i}`} position={mid.toArray()} quaternion={quat}>
            <cylinderGeometry args={[0.015, 0.015, len, 8]} />
            <meshStandardMaterial
              color="#a9f0ff"
              emissive="#5fd8ff"
              emissiveIntensity={0.7}
              transparent
              opacity={0.55}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function DNAScene({ zoom = 1, tilt = 0 }: { zoom?: number; tilt?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[6, 4, 6]} intensity={2.2} color="#7de8ff" />
      <pointLight position={[-5, -3, -4]} intensity={1.4} color="#3affa0" />
      <DNAHelix zoom={zoom} tilt={tilt} />
    </Canvas>
  );
}
