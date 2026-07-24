import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Shape({
  position,
  geometry,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  geometry: "box" | "torus" | "ico" | "sphere" | "cone";
  color: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
  });

  const geo = {
    box: <boxGeometry args={[1.1, 1.1, 1.1]} />,
    torus: <torusGeometry args={[0.7, 0.25, 32, 128]} />,
    ico: <icosahedronGeometry args={[0.9, 0]} />,
    sphere: <sphereGeometry args={[0.85, 64, 64]} />,
    cone: <coneGeometry args={[0.8, 1.4, 6]} />,
  }[geometry];

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={position}>
        {geo}
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.6}
          chromaticAberration={0.4}
          anisotropy={0.3}
          distortion={0.4}
          distortionScale={0.4}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 800]}
          color={color}
          roughness={0.05}
          transmission={1}
          ior={1.4}
        />
      </mesh>
    </Float>
  );
}

function Rig() {
  useFrame((state) => {
    const { pointer, camera } = state;
    camera.position.x += (pointer.x * 2 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 1.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#00000000"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -2]} intensity={2} color="#ff5ea8" />
      <pointLight position={[5, 3, -2]} intensity={2} color="#5ec8ff" />

      <Shape position={[-2.2, 0.8, 0]} geometry="torus" color="#ff7ac2" speed={0.8} />
      <Shape position={[0, -0.4, 0.5]} geometry="ico" color="#a5f3ff" speed={1.1} />
      <Shape position={[2.2, 0.6, -0.5]} geometry="box" color="#c4ff6b" speed={0.9} />
      <Shape position={[-1.2, -1.5, -1]} geometry="cone" color="#b18cff" speed={1.2} />
      <Shape position={[1.6, -1.4, -0.8]} geometry="sphere" color="#ffd76b" speed={0.7} />

      <Environment preset="city" />
      <Rig />
    </Canvas>
  );
}
