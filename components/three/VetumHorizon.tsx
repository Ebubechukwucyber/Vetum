"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { Color } from "three";

const PALETTE = ["#7B6CFF", "#6EE7A8", "#F0B95A", "#FF5A4F"];

function GateShard({
  i,
  color,
}: {
  i: number;
  color: string;
}) {
  const mesh = useRef<Mesh>(null);
  const x = ((i % 7) - 3) * 1.15;
  const z = Math.floor(i / 7) * -1.1 + 0.4;
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.position.y = Math.sin(t * 0.55 + i * 0.7) * 0.18;
    mesh.current.rotation.y = t * 0.12 + i;
  });
  return (
    <mesh ref={mesh} position={[x, 0, z]}>
      <octahedronGeometry args={[0.16 + (i % 3) * 0.04, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

function Scene() {
  const ring = useRef<Group>(null);
  const tint = useRef(new Color("#7B6CFF"));
  const shards = useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);
  useFrame(({ clock }, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.08;
    const idx = Math.floor(clock.getElapsedTime() / 6.5) % PALETTE.length;
    tint.current.lerp(new Color(PALETTE[idx]), Math.min(1, delta * 1.4));
  });
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2, 4]} intensity={16} color="#7B6CFF" />
      <pointLight position={[4, -1, 2]} intensity={8} color="#6EE7A8" />
      <group ref={ring} rotation={[Math.PI / 2.6, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.2, 0.012, 8, 160]} />
          <meshBasicMaterial color="#F4EFE6" transparent opacity={0.22} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.35, 0.008, 8, 140]} />
          <meshBasicMaterial color="#7B6CFF" transparent opacity={0.35} />
        </mesh>
      </group>
      {shards.map((i) => (
        <GateShard key={i} i={i} color={PALETTE[i % PALETTE.length]} />
      ))}
    </>
  );
}

export function VetumHorizon({ className = "h-full w-full" }: { className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className={className} aria-hidden />;
  return (
    <div className={className} aria-hidden="true">
      <Canvas camera={{ position: [0, 0.6, 7.2], fov: 38 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={["#07070B"]} />
        <Scene />
      </Canvas>
    </div>
  );
}
