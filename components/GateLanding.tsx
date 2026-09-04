"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { CoreState } from "./three/VetumCore";

const VetumCore = dynamic(
  () => import("./three/VetumCore").then((m) => m.VetumCore),
  { ssr: false }
);

const LOOP: { id: string; label: string; state: CoreState }[] = [
  { id: "intent", label: "INTENT", state: "idle" },
  { id: "plan", label: "PLAN", state: "idle" },
  { id: "sim", label: "SIMULATE", state: "idle" },
  { id: "policy", label: "POLICY", state: "idle" },
  { id: "allow", label: "ALLOW", state: "ALLOW" },
  { id: "deny", label: "DENY", state: "DENY" },
  { id: "confirm", label: "CONFIRM", state: "CONFIRM" },
  { id: "mcp", label: "MCP", state: "ALLOW" },
  { id: "audit", label: "AUDIT", state: "idle" },
];

export function GateLanding() {
  const [hover, setHover] = useState<CoreState>("idle");

  return (
    <div className="bg-void text-bone">
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4 backdrop-blur-md">
        <span className="font-serif text-2xl">Vetum</span>
        <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
          <a href="#loop">Loop</a>
          <a href="#autonomy">Autonomy</a>
          <a href="#gate">Gate</a>
          <Link
            href="/app"
            className="rounded-full border border-line px-4 py-2 text-bone hover:border-violet"
          >
            Chamber
          </Link>
        </nav>
      </header>

      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <VetumCore state={hover} />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-mist">
            Binance Agent OS · Track A
          </p>
          <h1 className="mt-6 font-serif text-6xl leading-[0.88] tracking-tight md:text-8xl">
            Vetum
          </h1>
          <p className="mt-8 max-w-xl font-serif text-3xl leading-tight text-bone/90 md:text-4xl">
            Agents propose.
            <br />
            Policy decides.
            <br />
            Binance executes.
          </p>
          <p className="mt-6 max-w-md text-sm text-mist">
            Account limits are not a constitution. Vetum is the control plane
            between autonomous intent and a $5 spot sub-account.
          </p>
          <div className="mt-10 flex gap-3">
            <Link
              href="/app"
              className="rounded-full bg-bone px-6 py-3 text-sm text-void"
            >
              Enter the chamber
            </Link>
            <a
              href="#loop"
              className="rounded-full border border-line px-6 py-3 text-sm text-mist"
            >
              Read the constitution
            </a>
          </div>
        </div>
      </section>

      <section id="loop" className="border-t border-line px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-4xl md:text-6xl">
            Account limits
            <br />
            are not a constitution.
          </h2>
          <p className="mt-6 max-w-lg text-mist">
            Binance says the agent may trade. Vetum says whether this plan, this
            size, this hour, this loss budget may proceed.
          </p>
          <div className="mt-12 flex flex-wrap gap-2">
            {LOOP.map((n) => (
              <button
                key={n.id}
                onMouseEnter={() => setHover(n.state)}
                onMouseLeave={() => setHover("idle")}
                className="rounded-full border border-line px-3 py-2 font-mono text-[11px] text-mist hover:border-violet hover:text-bone"
              >
                {n.label}
              </button>
            ))}
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-line">
            Hover a node. The core takes that state.
          </p>
        </div>
      </section>

      <section id="autonomy" className="border-t border-line px-6 py-24">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-4">
          {[
            { l: "L0", t: "Read", d: "Market data only. All writes denied." },
            { l: "L1", t: "Propose", d: "Plans exist. Every order confirms." },
            {
              l: "L2",
              t: "Bounded auto",
              d: "Max $5. Spot only. Futures hard-denied.",
              featured: true,
            },
            { l: "HALT", t: "Dead writes", d: "Circuit breaker. Autonomy off." },
          ].map((c) => (
            <article
              key={c.l}
              className={`border p-6 ${
                c.featured
                  ? "border-violet bg-violet/10 shadow-[0_0_40px_rgba(123,108,255,0.25)]"
                  : "border-line"
              }`}
            >
              <p className="font-mono text-[10px] text-mist">{c.l}</p>
              <h3 className="mt-3 font-serif text-3xl">{c.t}</h3>
              <p className="mt-3 text-sm text-mist">{c.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="gate" className="border-t border-line px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-4xl md:text-6xl">
            Two agents.
            <br />
            One gate.
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="border border-line p-6">
              <p className="font-mono text-[10px] text-mist">PortfolioAgent</p>
              <p className="mt-3 text-sm text-mist">Proposes a structured plan.</p>
            </div>
            <div className="border border-violet bg-violet/10 p-6">
              <p className="font-mono text-[10px] text-violet">Vetum.checkPolicy()</p>
              <p className="mt-3 font-serif text-2xl">ALLOW · DENY · CONFIRM</p>
            </div>
            <div className="border border-line p-6">
              <p className="font-mono text-[10px] text-mist">MemeAgent</p>
              <p className="mt-3 text-sm text-mist">Same function. Same constitution.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-10 font-mono text-[11px] text-mist">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <span className="font-serif text-xl text-bone">Vetum</span>
          <span>Agents cannot withdraw.</span>
          <a href="https://github.com/Ebubechukwucyber/Vetum" className="hover:text-bone">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
