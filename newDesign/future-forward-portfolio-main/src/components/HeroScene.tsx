import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Sparkles, Torus } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import type { Mesh, Group } from "three";

function GradCap({ hover }: { hover: boolean }) {
  const group = useRef<Group>(null);
  const tassel = useRef<Mesh>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.4 + (hover ? 0.5 : 0);
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    }
    if (tassel.current) {
      tassel.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.4;
    }
  });

  return (
    <group ref={group} scale={hover ? 1.15 : 1}>
      {/* Cap base (skull cap) */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.9, 0.45, 48]} />
        <meshStandardMaterial color="#1a0b2e" roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Mortarboard (flat square top) */}
      <mesh position={[0, 0.18, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[2.2, 0.08, 2.2]} />
        <meshStandardMaterial color="#2a0e4f" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Center button */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#ff8a3d" emissive="#ff8a3d" emissiveIntensity={0.6} />
      </mesh>
      {/* Tassel string */}
      <mesh ref={tassel} position={[0.5, 0.25, 0]}>
        <group>
          <mesh position={[0.35, -0.35, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
            <meshStandardMaterial color="#ff5faa" />
          </mesh>
          <mesh position={[0.55, -0.75, 0]}>
            <coneGeometry args={[0.09, 0.25, 16]} />
            <meshStandardMaterial color="#ff5faa" emissive="#ff5faa" emissiveIntensity={0.4} />
          </mesh>
        </group>
      </mesh>
      {/* Orbit ring */}
      <Torus args={[1.6, 0.02, 12, 100]} rotation={[Math.PI / 2.2, 0.4, 0]}>
        <meshStandardMaterial color="#ff8a3d" emissive="#ff8a3d" emissiveIntensity={0.8} />
      </Torus>
    </group>
  );
}

function Orb() {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.2;
      ref.current.rotation.y = s.clock.elapsedTime * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={[2.2, -1.4, -1]} scale={0.55}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial color="#c026d3" distort={0.45} speed={2} roughness={0.2} />
    </mesh>
  );
}

function Orb2() {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.4;
  });
  return (
    <mesh ref={ref} position={[-2.4, 1.2, -1]} scale={0.4}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial color="#ff8a3d" distort={0.5} speed={3} roughness={0.2} />
    </mesh>
  );
}

export default function HeroScene() {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="h-[26rem] w-full md:h-[32rem]"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Canvas camera={{ position: [0, 0.4, 4.5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 3]} intensity={1.4} color="#ffb27a" />
        <pointLight position={[-3, -2, 2]} intensity={1.2} color="#ff5faa" />
        <pointLight position={[0, 2, -2]} intensity={1} color="#a855f7" />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.6} floatIntensity={1.4}>
            <GradCap hover={hover} />
          </Float>
          <Orb />
          <Orb2 />
          <Sparkles count={80} scale={7} size={3} speed={0.6} color="#ff8a3d" />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}
