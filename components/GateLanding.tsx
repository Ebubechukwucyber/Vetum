"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { CoreState } from "./three/VetumCore";

const VetumCore = dynamic(() => import("./three/VetumCore").then((m) => m.VetumCore), { ssr:false });
const VetumHorizon = dynamic(() => import("./three/VetumHorizon").then((m) => m.VetumHorizon), { ssr:false });

const LOOP:{id:string;label:string;state:CoreState;icon:string}[]=[
 {id:"intent",label:"INTENT",state:"planning",icon:"↗"},{id:"plan",label:"PLAN",state:"planning",icon:"◇"},{id:"sim",label:"SIMULATE",state:"idle",icon:"≈"},{id:"policy",label:"POLICY",state:"planning",icon:"⌘"},{id:"allow",label:"ALLOW",state:"ALLOW",icon:"✓"},{id:"deny",label:"DENY",state:"DENY",icon:"×"},{id:"confirm",label:"CONFIRM",state:"CONFIRM",icon:"!"},{id:"audit",label:"LEDGER",state:"idle",icon:"▤"}
];
const decisions=[
 {stamp:"ALLOW",tone:"allow",intent:"Buy $800 of BNB on spot",reason:"Within constitution.",state:"ALLOW" as CoreState},
 {stamp:"CONFIRM",tone:"confirm",intent:"Buy $2,800 of ETH on spot",reason:"Notional $2,800 requires a human.",state:"CONFIRM" as CoreState},
 {stamp:"DENY",tone:"deny",intent:"Buy $50,000 BTC",reason:"max_notional_usd · $50,000 > $10,000",state:"DENY" as CoreState},
 {stamp:"DENY",tone:"deny",intent:"Open 10x BTC perpetual",reason:"forbidden_venues · futures",state:"DENY" as CoreState}
];
function Icon({type}:{type:"gate"|"scale"|"halt"|"spot"|"agent"|"ledger"}){const d={gate:"M3 8h10M8 3v10M3 3h10v10H3z",scale:"M2 4h12M8 2v12M4 7l-2 4h4L4 7zm8 0-2 4h4l-2-4z",halt:"M4 2h8v12H4zM7 5v4M9 5v4",spot:"M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 3v3l2 1",agent:"M3 6h10v7H3zM6 3h4M8 1v2M5 9h.01M11 9h.01",ledger:"M3 2h10v12H3zM5 5h6M5 8h6M5 11h4"}[type];return <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden><path d={d} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>}

export function GateLanding(){
 const [hover,setHover]=useState<CoreState>("idle"); const [selected,setSelected]=useState(0);
 return <main className="overflow-hidden bg-void text-bone film-grain">
 <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.06] bg-void/75 px-4 py-3 backdrop-blur-xl md:px-8"><div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4"><Link href="/" className="relative z-10 block"><Image src="/vetum-wordmark.jpg" alt="Vetum" width={420} height={150} className="h-10 w-auto object-contain mix-blend-screen md:h-14" priority/></Link><nav className="hidden items-center gap-6 font-mono text-[10px] uppercase tracking-[.18em] text-mist lg:flex"><a href="#loop">Machine</a><Link href="/agent">Agent</Link><Link href="/skill">Skill</Link><Link href="/constitution">Law</Link><Link href="/how">How</Link></nav><Link href="/app" className="rounded-full border border-white/20 bg-white/[.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[.16em] hover:border-violet hover:bg-violet/10">Enter chamber</Link></div></header>

 <section className="relative min-h-[100svh] overflow-hidden">
  <div className="pointer-events-none absolute inset-0">
   <VetumCore state={hover} autoCycle={hover==="idle"} labels/>
   <div className="hero-vignette absolute inset-0"/>
   <div className="scan-lines absolute inset-0 opacity-30"/>
  </div>
  <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col items-center justify-center px-5 py-28 text-center md:px-10 lg:px-12">
   <div className="max-w-3xl [text-shadow:0_2px_24px_rgba(7,7,11,.85)]">
    <div className="mb-5 flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[.28em] text-mist"><span className="pulse-dot"/> Programmable control plane</div>
    <h1 className="font-serif text-[clamp(4.2rem,13vw,11rem)] leading-[.78] tracking-[-.06em] text-bone">Vetum</h1>
    <p className="mx-auto mt-6 max-w-xl font-serif text-[clamp(1.2rem,2.2vw,1.75rem)] leading-[1.25] text-bone/90">A constitution between an autonomous agent and an exchange.</p>
    <p className="mt-5 text-sm leading-6 text-mist">Agents propose. Policy decides. Binance executes.</p>
    <div className="mt-8 flex justify-center">
     <Link href="/app" className="rounded-full bg-bone px-6 py-3 text-center text-sm font-semibold text-void">Enter the chamber</Link>
    </div>
   </div>
   <div className="absolute bottom-16 right-12 hidden lg:block"><div className="decision-ticker"><span>POLICY SIGNAL</span><b>ALLOW · DENY · CONFIRM</b><span>CYCLE · 6.5s</span></div></div>
  </div>
 </section>

 <section className="border-t border-line px-5 py-16 md:px-8 md:py-24"><div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">01 · THE PROBLEM</p><h2 className="mt-5 font-serif text-5xl leading-[.86] md:text-7xl">Exchange permission is not a strategy constitution.</h2></div><div className="grid gap-px border border-line bg-line sm:grid-cols-3"><article className="bg-ink p-6"><Icon type="agent"/><p className="mt-12 font-mono text-[10px] text-mist">01 / AGENT</p><h3 className="mt-3 font-serif text-3xl">Proposes anything.</h3></article><article className="bg-ink p-6"><Icon type="gate"/><p className="mt-12 font-mono text-[10px] text-violet">02 / VETUM</p><h3 className="mt-3 font-serif text-3xl">Checks the law.</h3></article><article className="bg-ink p-6"><Icon type="ledger"/><p className="mt-12 font-mono text-[10px] text-mist">03 / EXCHANGE</p><h3 className="mt-3 font-serif text-3xl">Only then acts.</h3></article></div></div></section>

 <section id="loop" className="border-t border-line px-5 py-16 md:px-8 md:py-24"><div className="mx-auto max-w-[1500px]"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">02 · THE MACHINE</p><h2 className="mt-5 font-serif text-5xl leading-[.86] md:text-7xl">Make every step visible.</h2></div><p className="max-w-sm text-sm leading-6 text-mist">Hover or tap the rail. The living gate changes state with the machine.</p></div><div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{LOOP.map((node,i)=><button key={node.id} onClick={()=>setHover(node.state)} onMouseEnter={()=>setHover(node.state)} onMouseLeave={()=>setHover("idle")} className={`group relative overflow-hidden border p-5 text-left transition-all hover:-translate-y-1 ${hover===node.state&&hover!=="idle"?"border-violet bg-violet/[.07]":"border-line bg-ink"}`}><div className="flex items-center justify-between"><span className="font-mono text-xs text-mist">{String(i+1).padStart(2,"0")}</span><span className="font-mono text-xl text-violet transition-transform group-hover:rotate-12">{node.icon}</span></div><div className="mt-12 font-mono text-[11px] tracking-[.16em] text-bone">{node.label}</div><div className="absolute bottom-0 left-0 h-[2px] w-0 bg-violet transition-all duration-500 group-hover:w-full"/></button>)}</div></div></section>

 <section id="decisions" className="border-t border-line px-5 py-16 md:px-8 md:py-24"><div className="mx-auto max-w-[1500px]"><p className="eyebrow">03 · WORKED DECISIONS</p><h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[.86] md:text-7xl">The gate does not speak in vibes. It gives a reason.</h2><div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{decisions.map((d,i)=><button key={d.intent} onClick={()=>{setSelected(i);setHover(d.state)}} onMouseLeave={()=>setHover("idle")} className={`decision-card ${d.tone} ${selected===i?"active":""} text-left`}><div className="flex items-center justify-between"><span className="decision-stamp">{d.stamp}</span><span className="font-mono text-[10px] opacity-60">0{i+1}</span></div><h3>{d.intent}</h3><p>{d.reason}</p><div className="mt-7 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.14em]"><span className="status-orb"/> inspect decision</div></button>)}</div></div></section>

 <section className="border-t border-line px-5 py-16 md:px-8 md:py-24"><div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">04 · AUTONOMY</p><h2 className="mt-5 font-serif text-5xl leading-[.86] md:text-7xl">Freedom, with boundaries drawn first.</h2></div><div className="grid gap-2 sm:grid-cols-2"><article className="level-card"><b>L0 — read only</b><h3>Observe</h3><p>Not a blockchain layer. Agent may read markets. Every write is denied.</p></article><article className="level-card"><b>L1 — propose</b><h3>Ask a human</h3><p>Not L1 chain. Plans are allowed. Every order waits for CONFIRM.</p></article><article className="level-card featured"><b>L2 — bounded auto</b><h3>Act inside the law</h3><p>Not L2 rollup. Small legal spot plans may ALLOW. Futures still denied.</p></article><article className="level-card halt"><b>HALT — stop</b><h3>Dead writes</h3><p>Circuit breaker. Autonomy off. Even a legal spot buy is DENY.</p></article></div></div></section>

 <section className="border-t border-line px-5 py-16 md:px-8 md:py-24"><div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-2"><div><p className="eyebrow">05 · THREAT MODEL</p><h2 className="mt-5 font-serif text-5xl leading-[.86] md:text-7xl">The model proposes. It never gets the keys.</h2></div><div className="space-y-2">{[["halt","NO WITHDRAWALS","Withdrawal capability is false in the constitution."],["scale","PAPER DEFAULT","Simulation precedes policy. Policy precedes any write."],["gate","HALT HARDWARE","Autonomy halted. No writes."]].map(([icon,title,copy])=><article key={title} className="threat-row"><Icon type={icon as "halt"|"scale"|"gate"}/><div><b>{title}</b><p>{copy}</p></div></article>)}</div></div></section>

 <section className="border-t border-line px-5 py-16 md:px-8 md:py-24"><div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">06 · SKILL</p><h2 className="mt-5 font-serif text-5xl leading-[.86] md:text-7xl">Other agents can call the gate.</h2><Link href="/skill" className="mt-8 inline-flex rounded-full border border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[.16em] hover:border-violet">Open skill hub ↗</Link></div><div className="terminal-card"><div className="terminal-top"><span/><span/><span/><b>VETUM / CHECK_POLICY</b></div><pre>const decision = await check_policy({`\n  intent,\n  plan,\n  constitution\n`});{`\n\n`}→ decision · code · reason · simulated</pre><div className="terminal-result">ALLOW <span>Within constitution.</span></div></div></div></section>

 <section className="relative border-t border-line">
  <div className="h-[280px] md:h-[380px]"><VetumHorizon /></div>
  <div className="pointer-events-none absolute inset-x-0 top-8 z-10 px-5 text-center md:px-8">
   <p className="font-mono text-[10px] uppercase tracking-[.28em] text-mist">07 · LEDGER FIELD</p>
   <p className="mx-auto mt-3 max-w-lg font-serif text-3xl leading-[.95] md:text-5xl">Every decision becomes a shard in the field.</p>
  </div>
 </section>

 <footer className="border-t border-line px-5 py-10 md:px-8"><div className="mx-auto flex max-w-[1500px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><Image src="/vetum-wordmark.jpg" alt="Vetum" width={300} height={120} className="h-9 w-auto mix-blend-screen"/><span className="font-mono text-[9px] uppercase tracking-[.16em] text-mist">Agents cannot withdraw.</span><a href="https://github.com/Ebubechukwucyber/Vetum" className="font-mono text-[9px] uppercase tracking-[.16em] text-mist hover:text-bone">GitHub ↗</a></div></footer>
 </main>;
}
