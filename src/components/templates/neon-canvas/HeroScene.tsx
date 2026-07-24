import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Blob() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const { x, y } = state.pointer;
    mesh.current.rotation.y += (x * 0.6 - mesh.current.rotation.y) * 0.05;
    mesh.current.rotation.x += (-y * 0.6 - mesh.current.rotation.x) * 0.05;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={mesh} scale={2.2}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          color="#a855f7"
          emissive="#22d3ee"
          emissiveIntensity={0.4}
          distort={0.45}
          speed={2}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a855f7" />
      <directionalLight position={[-5, -3, -5]} intensity={1} color="#22d3ee" />
      <pointLight position={[0, 0, 3]} intensity={2} color="#ffffff" />
      <Blob />
    </Canvas>
  );
}