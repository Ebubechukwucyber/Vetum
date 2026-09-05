"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { Color, MeshBasicMaterial, MeshStandardMaterial } from "three";

export type CoreState = "idle" | "planning" | "ALLOW" | "DENY" | "CONFIRM" | "HALT";

export const COLORS: Record<CoreState, string> = {
  idle: "#7B6CFF",
  planning: "#9B8CFF",
  ALLOW: "#6EE7A8",
  DENY: "#FF5A4F",
  CONFIRM: "#F0B95A",
  HALT: "#2A2A32",
};

/** Purple → green → gold → red, ~6.5s each. */
const CYCLE: CoreState[] = ["idle", "ALLOW", "CONFIRM", "DENY"];
const HOLD = 6.5;

function cycleState(t: number): CoreState {
  return CYCLE[Math.floor(t / HOLD) % CYCLE.length];
}

function Nucleus({
  state,
  autoCycle,
}: {
  state: CoreState;
  autoCycle?: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const live = useRef<CoreState>(state);
  const color = useRef(new Color(COLORS[state]));
  const target = useRef(new Color(COLORS[state]));

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    live.current = autoCycle ? cycleState(clock.getElapsedTime()) : state;
    const s = live.current;
    const spin =
      s === "DENY" || s === "HALT" ? 0.04 : s === "planning" ? 1.2 : s === "CONFIRM" ? 0.5 : 0.32;
    mesh.current.rotation.y += delta * spin;
    mesh.current.rotation.x += delta * spin * 0.4;
    const goal = s === "CONFIRM" ? 1.08 : s === "ALLOW" ? 1.04 : s === "HALT" ? 0.92 : 1;
    mesh.current.scale.x += (goal - mesh.current.scale.x) * Math.min(1, delta * 2.2);
    mesh.current.scale.y = mesh.current.scale.z = mesh.current.scale.x;

    target.current.set(COLORS[s]);
    color.current.lerp(target.current, Math.min(1, delta * 1.6));
    const raw = mesh.current.material;
    const mat = Array.isArray(raw) ? raw[0] : raw;
    if (mat instanceof MeshStandardMaterial) {
      mat.color.copy(color.current);
      mat.emissive.copy(color.current);
      mat.emissiveIntensity = s === "HALT" ? 0 : s === "DENY" ? 0.22 : 0.46;
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color={COLORS[state]}
        roughness={0.22}
        metalness={0.72}
        emissive={COLORS[state]}
        emissiveIntensity={0.48}
        wireframe={state === "HALT"}
      />
    </mesh>
  );
}

function Rings({ state, autoCycle }: { state: CoreState; autoCycle?: boolean }) {
  const group = useRef<Group>(null);
  const a = useRef<Mesh>(null);
  const b = useRef<Mesh>(null);
  const c = useRef<Mesh>(null);
  const tint = useRef(new Color(COLORS[state]));
  const goal = useRef(new Color(COLORS[state]));
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const s = autoCycle ? cycleState(clock.getElapsedTime()) : state;
    const speed = s === "DENY" || s === "HALT" ? 0.05 : s === "ALLOW" ? 0.28 : 0.16;
    group.current.rotation.z += delta * speed;
    group.current.rotation.y += delta * speed * 0.68;
    goal.current.set(COLORS[s]);
    tint.current.lerp(goal.current, Math.min(1, delta * 1.6));
    const paint = (mesh: Mesh | null, opacity: number) => {
      if (!mesh) return;
      const raw = mesh.material;
      const mat = Array.isArray(raw) ? raw[0] : raw;
      if (mat instanceof MeshBasicMaterial) {
        mat.color.copy(tint.current);
        mat.opacity = opacity;
      }
    };
    paint(a.current, 0.78);
    paint(c.current, 0.45);
    if (b.current) {
      const raw = b.current.material;
      const mat = Array.isArray(raw) ? raw[0] : raw;
      if (mat instanceof MeshBasicMaterial) mat.color.lerp(tint.current, Math.min(1, delta * 0.35));
    }
  });
  return (
    <group ref={group}>
      <mesh ref={a} rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[1.52, 0.018, 10, 100]} />
        <meshBasicMaterial color={COLORS[state]} transparent opacity={0.72} />
      </mesh>
      <mesh ref={b} rotation={[0.4, Math.PI / 3, 0.3]}>
        <torusGeometry args={[1.76, 0.011, 8, 100]} />
        <meshBasicMaterial color="#F4EFE6" transparent opacity={0.32} />
      </mesh>
      <mesh ref={c} rotation={[1.2, 0.8, 0.1]}>
        <torusGeometry args={[1.98, 0.009, 8, 100]} />
        <meshBasicMaterial color={COLORS[state]} transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

function Dust({ state, autoCycle }: { state: CoreState; autoCycle?: boolean }) {
  const ref = useRef<Group>(null);
  const positions = useMemo(() => {
    const n = 620;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = (Math.random() - 0.5) * 15;
      a[i * 3 + 1] = (Math.random() - 0.5) * 10;
      a[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return a;
  }, []);
  useFrame((_, d) => {
    if (ref.current && state !== "HALT") ref.current.rotation.y += d * 0.018;
  });
  void autoCycle;
  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.016} color={COLORS[state]} opacity={0.36} transparent />
      </points>
    </group>
  );
}

function CoreScene({
  state,
  autoCycle,
  labels = true,
}: {
  state: CoreState;
  autoCycle?: boolean;
  labels?: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 2, 4]} intensity={24} color={COLORS[state]} />
      <pointLight position={[-4, -2, -3]} intensity={8} color="#F4EFE6" />
      <Float speed={state === "HALT" ? 0 : 1.25} rotationIntensity={0.18} floatIntensity={0.3}>
        <Nucleus state={state} autoCycle={autoCycle} />
        <Rings state={state} autoCycle={autoCycle} />
      </Float>
      {labels ? (
        <>
          <Html position={[2.35, 1.15, 0]} center>
            <span style={{ fontSize: 9, letterSpacing: ".22em", color: "#6EE7A8", fontFamily: "monospace", fontWeight: 700 }}>
              ALLOW
            </span>
          </Html>
          <Html position={[2.45, -0.15, 0]} center>
            <span style={{ fontSize: 9, letterSpacing: ".22em", color: "#F0B95A", fontFamily: "monospace", fontWeight: 700 }}>
              CONFIRM
            </span>
          </Html>
          <Html position={[2.2, -1.35, 0]} center>
            <span style={{ fontSize: 9, letterSpacing: ".22em", color: "#FF5A4F", fontFamily: "monospace", fontWeight: 700 }}>
              DENY
            </span>
          </Html>
        </>
      ) : null}
      <Dust state={state} autoCycle={autoCycle} />
    </>
  );
}

export function VetumCore({
  state = "idle",
  className = "h-full w-full",
  autoCycle = false,
  labels = true,
}: {
  state?: CoreState;
  className?: string;
  autoCycle?: boolean;
  labels?: boolean;
}) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4.35], fov: 42 }} dpr={[1, 1.8]} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={["#07070B"]} />
        <CoreScene state={state} autoCycle={autoCycle} labels={labels} />
      </Canvas>
    </div>
  );
}
