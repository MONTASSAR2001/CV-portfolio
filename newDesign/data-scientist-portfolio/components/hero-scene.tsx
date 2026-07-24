'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'

const NEON = '#4dff9e'
const PURPLE = '#a855f7'

function DataBar({
  position,
  height,
  color,
}: {
  position: [number, number, number]
  height: number
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  const seed = useMemo(() => Math.random() * 10, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // gentle pulsing height to feel "live"
    const pulse = height + Math.sin(t * 1.2 + seed) * 0.25
    ref.current.scale.y = Math.max(0.2, pulse)
    ref.current.position.y = ref.current.scale.y / 2
  })

  return (
    <mesh ref={ref} position={[position[0], height / 2, position[2]]}>
      <boxGeometry args={[0.55, 1, 0.55]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        metalness={0.6}
        roughness={0.25}
        transparent
        opacity={0.92}
      />
    </mesh>
  )
}

function DataCity() {
  const group = useRef<THREE.Group>(null)

  const bars = useMemo(() => {
    const items: {
      position: [number, number, number]
      height: number
      color: string
    }[] = []
    const size = 9
    const spacing = 0.85
    const offset = ((size - 1) * spacing) / 2
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const dist = Math.hypot(x - (size - 1) / 2, z - (size - 1) / 2)
        const height = Math.max(0.4, 3.4 - dist * 0.5 + Math.random() * 1.2)
        items.push({
          position: [x * spacing - offset, 0, z * spacing - offset],
          height,
          color: (x + z) % 3 === 0 ? PURPLE : NEON,
        })
      }
    }
    return items
  }, [])

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15
    // subtle idle sway
    if (group.current)
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.04
  })

  return (
    <group ref={group}>
      {bars.map((bar, i) => (
        <DataBar key={i} {...bar} />
      ))}
      {/* reflective base grid plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[10, 10, 20, 20]} />
        <meshBasicMaterial color={PURPLE} wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

function ScatterNodes() {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 260
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const neon = new THREE.Color(NEON)
    const purple = new THREE.Color(PURPLE)
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.7 + 0.5
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      const c = Math.random() > 0.5 ? neon : purple
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [10, 8, 12], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 15, 10]} intensity={1.2} color={NEON} />
        <pointLight position={[-10, 8, -10]} intensity={1} color={PURPLE} />
        <fog attach="fog" args={['#05070d', 18, 32]} />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <DataCity />
        </Float>
        <ScatterNodes />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
          rotateSpeed={0.6}
        />
      </Suspense>
    </Canvas>
  )
}
