"use client";

import { useState } from "react";
import { parseIntent } from "@/lib/parseIntent";
import { check_policy } from "@/lib/skill";
import type { Decision } from "@/lib/types";

const CALLS = [
  { agent: "PortfolioAgent", intent: "Buy $800 of BNB on spot" },
  { agent: "MemeAgent", intent: "Buy $2,800 of ETH on spot" },
  { agent: "MemeAgent", intent: "Buy $50,000 BTC" },
  { agent: "PortfolioAgent", intent: "Open 10x BTC perpetual" },
];

export function SkillStudio() {
  const [last, setLast] = useState<Decision | null>(null);

  function run(agent: string, intent: string) {
    const plan = parseIntent(intent, agent);
    setLast(check_policy(plan));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      <div className="space-y-2">
        {CALLS.map((c) => (
          <button
            key={c.agent + c.intent}
            onClick={() => run(c.agent, c.intent)}
            className="block w-full border border-line bg-ink p-5 text-left hover:border-violet"
          >
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-violet">{c.agent}</p>
            <p className="mt-2 font-serif text-2xl">{c.intent}</p>
            <p className="mt-3 font-mono text-[10px] text-mist">check_policy(plan)</p>
          </button>
        ))}
      </div>
      <div className="border border-line bg-ink p-6">
        {!last ? (
          <p className="font-mono text-sm text-mist">No agent has called the skill yet.</p>
        ) : (
          <>
            <p className={`font-mono text-sm tracking-[.2em] ${
              last.kind === "ALLOW" ? "text-allow" : last.kind === "DENY" ? "text-deny" : "text-confirm"
            }`}>{last.kind} · {last.code}</p>
            <p className="mt-4 font-serif text-3xl">{last.reason}</p>
            <p className="mt-4 font-mono text-[11px] text-mist">{last.plan.agent} · {last.plan.venue} · ${last.plan.notional_usd}</p>
            <pre className="mt-8 overflow-auto text-[11px] leading-6 text-mist">{JSON.stringify(last, null, 2)}</pre>
          </>
        )}
      </div>
    </div>
  );
}
