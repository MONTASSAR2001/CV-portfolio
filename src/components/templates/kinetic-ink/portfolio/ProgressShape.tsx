import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function Shape({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const fillRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.15;
    }
    if (fillRef.current) {
      fillRef.current.rotation.y += delta * 0.4;
      fillRef.current.rotation.x += delta * 0.15;
    }
  });

  const scale = 0.05 + progress * 0.95;

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#0a0a0a" wireframe />
      </mesh>
      <mesh ref={fillRef} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ef2b2b" />
      </mesh>
    </group>
  );
}

export function ProgressShape() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1">
      <div className="h-20 w-20 border border-ink bg-paper">
        <Canvas camera={{ position: [0, 0, 2.6], fov: 45 }} dpr={[1, 2]}>
          <Shape progress={progress} />
        </Canvas>
      </div>
      <div className="text-mono text-[0.6rem]">{Math.round(progress * 100)}%</div>
    </div>
  );
}
