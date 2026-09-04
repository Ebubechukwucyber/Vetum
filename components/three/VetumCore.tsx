"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

export type CoreState = "idle" | "ALLOW" | "DENY" | "CONFIRM" | "HALT";

const COLORS: Record<CoreState, string> = {
  idle: "#7B6CFF",
  ALLOW: "#C8F4D2",
  DENY: "#FF5A4F",
  CONFIRM: "#E8B86D",
  HALT: "#2A2A32",
};

function Nucleus({ state }: { state: CoreState }) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, d) => {
    if (!mesh.current) return;
    const spin = state === "DENY" || state === "HALT" ? 0 : state === "CONFIRM" ? 0.35 : 0.2;
    mesh.current.rotation.y += d * spin;
    mesh.current.rotation.x += d * spin * 0.35;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={COLORS[state]}
        roughness={0.35}
        metalness={0.55}
        emissive={COLORS[state]}
        emissiveIntensity={state === "HALT" ? 0.02 : 0.25}
        wireframe={state === "HALT"}
      />
    </mesh>
  );
}

function Rings({ state }: { state: CoreState }) {
  const group = useRef<Mesh>(null);
  useFrame((_, d) => {
    if (!group.current) return;
    if (state === "DENY" || state === "HALT") return;
    group.current.rotation.z += d * 0.12;
    group.current.rotation.y += d * 0.08;
  });
  return (
    <group ref={group as never}>
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[1.55, 0.012, 8, 80]} />
        <meshBasicMaterial color={COLORS[state]} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[0.4, Math.PI / 3, 0.3]}>
        <torusGeometry args={[1.75, 0.01, 8, 80]} />
        <meshBasicMaterial color="#F4EFE6" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[1.2, 0.8, 0.1]}>
        <torusGeometry args={[1.95, 0.008, 8, 80]} />
        <meshBasicMaterial color={COLORS[state]} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function Dust() {
  const positions = useMemo(() => {
    const n = 400;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#F4EFE6" opacity={0.28} transparent />
    </points>
  );
}

export function VetumCore({
  state = "idle",
  className = "h-full w-full",
}: {
  state?: CoreState;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 42 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#07070B"]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 2, 4]} intensity={18} color={COLORS[state]} />
        <pointLight position={[-4, -2, -3]} intensity={6} color="#F4EFE6" />
        <Float speed={state === "HALT" ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.25}>
          <Nucleus state={state} />
        </Float>
        <Rings state={state} />
        <Dust />
      </Canvas>
    </div>
  );
}
