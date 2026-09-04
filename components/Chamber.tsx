"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { demoPolicy } from "@/lib/demoPolicy";
import { parseIntent } from "@/lib/parseIntent";
import { checkPolicy } from "@/lib/policy";
import type { AutonomyLevel, Decision, Policy } from "@/lib/types";

const VetumCore = dynamic(
  () => import("./three/VetumCore").then((m) => m.VetumCore),
  { ssr: false }
);

const CHIPS = [
  "Buy $800 of BNB on spot",
  "Buy $2,800 of ETH on spot",
  "Buy $50,000 BTC",
  "Open 10x BTC perpetual",
];

type Row = Decision & { id: string; at: string };

const MIDS: Record<string, number> = {
  BNBUSDT: 600,
  BTCUSDT: 64000,
  ETHUSDT: 2400,
};

function kindColor(kind: Decision["kind"]) {
  if (kind === "ALLOW") return "text-allow";
  if (kind === "DENY") return "text-deny";
  return "text-confirm";
}

function stripe(kind: Decision["kind"]) {
  if (kind === "ALLOW") return "bg-allow";
  if (kind === "DENY") return "bg-deny";
  return "bg-confirm";
}

export function Chamber() {
  const [policy, setPolicy] = useState<Policy>(demoPolicy);
  const [agent, setAgent] = useState("PortfolioAgent");
  const [intent, setIntent] = useState("");
  const [last, setLast] = useState<Decision | null>(null);
  const [ledger, setLedger] = useState<Row[]>([]);
  const [filter, setFilter] = useState<"ALL" | Decision["kind"]>("ALL");
  const [tab, setTab] = useState<"Plan" | "Policy" | "Ledger">("Plan");
  const [pnl, setPnl] = useState(0);

  const spent = useMemo(
    () =>
      ledger
        .filter((r) => r.kind === "ALLOW")
        .reduce((s, r) => s + r.plan.notional_usd, 0),
    [ledger]
  );

  function run(text: string) {
    const raw = text.trim();
    if (!raw) return;
    const plan = parseIntent(raw, agent);
    const decision = checkPolicy(plan, policy, {
      mid_usd: MIDS[plan.symbol] ?? 0,
      realized_pnl_today_usd: pnl,
    });
    const row: Row = {
      ...decision,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: new Date().toISOString().slice(11, 19),
    };
    setLast(decision);
    setLedger((prev) => [row, ...prev]);
    setTab("Plan");
    setIntent(raw);
  }

  function halt() {
    const haltedPolicy = { ...policy, autonomy: "HALT" as AutonomyLevel };
    setPolicy(haltedPolicy);
    const plan = parseIntent("Buy $800 of BNB on spot", agent);
    const decision = checkPolicy(plan, haltedPolicy, {
      mid_usd: MIDS[plan.symbol] ?? 0,
      realized_pnl_today_usd: pnl,
    });
    const row: Row = {
      ...decision,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: new Date().toISOString().slice(11, 19),
    };
    setLast(decision);
    setLedger((prev) => [row, ...prev]);
    setTab("Plan");
    setIntent("Buy $800 of BNB on spot");
  }

  function resume() {
    setPolicy((p) => ({ ...p, autonomy: "L2" }));
  }

  const visible = ledger.filter((r) => filter === "ALL" || r.kind === filter);
  const halted = policy.autonomy === "HALT";

  return (
    <div className="min-h-screen bg-void text-bone">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-void/90 px-5 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <a href="/" aria-label="Vetum home" className="block shrink-0">
            <Image
              src="/vetum-wordmark.jpg"
              alt="Vetum"
              width={126}
              height={84}
              className="h-7 w-auto object-contain object-center mix-blend-screen"
              priority
            />
          </a>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-mist sm:inline">
            Chamber
          </span>
        </div>
        <div className="h-11 w-11 overflow-hidden rounded-full border border-line bg-void">
          <VetumCore
            state={
              policy.autonomy === "HALT"
                ? "HALT"
                : last
                  ? last.kind
                  : "idle"
            }
            className="h-12 w-12"
          />
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="rounded-full border border-line px-3 py-1 text-mist">
            {policy.autonomy === "L0"
              ? "L0 read"
              : policy.autonomy === "L1"
                ? "L1 propose"
                : policy.autonomy === "L2"
                  ? "L2 auto"
                  : "HALT"}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-mist">
            ${spent.toFixed(2)} / ${policy.max_notional_usd.toFixed(2)}
          </span>
          <span className="rounded-full border border-line px-3 py-1 uppercase text-paper">
            {policy.mode}
          </span>
          {halted ? (
            <button
              onClick={resume}
              className="rounded-sm border border-confirm px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-confirm hover:bg-confirm/10"
            >
              RESUME L2
            </button>
          ) : (
            <button
              onClick={halt}
              className="rounded-sm border border-deny bg-deny/10 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-deny hover:bg-deny/15"
            >
              HALT
            </button>
          )}
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-53px)] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="flex flex-col border-r border-line px-5 py-8 lg:px-12 lg:py-10">
          <div className="mb-6 flex items-center justify-between">
            <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
              Agent
            </label>
            <div className="flex gap-1 rounded-full border border-line p-1">
              {["PortfolioAgent", "MemeAgent"].map((name) => (
                <button
                  key={name}
                  onClick={() => setAgent(name)}
                  className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                    agent === name ? "bg-ink text-bone" : "text-mist"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <h1 className="max-w-3xl font-serif text-5xl leading-[0.88] tracking-tight md:text-7xl">
            What should the agent attempt?
          </h1>

          <form
            className="mt-8 flex items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              run(intent);
            }}
          >
            <input
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Buy $800 of BNB on spot"
              className="min-w-0 flex-1 border-b border-line bg-transparent pb-4 font-serif text-2xl outline-none transition-colors placeholder:text-line focus:border-violet md:text-3xl"
            />
            <button
              type="submit"
              aria-label="Submit intent"
              className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center border border-line text-bone hover:border-violet hover:bg-violet/10"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => run(c)}
                className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-mist transition hover:border-violet hover:text-bone"
              >
                {c}
              </button>
            ))}
          </div>

          {last && (
            <section className="mt-10 space-y-4">
              <div
                className={`inline-flex items-center gap-3 rounded-full border border-line px-4 py-2 font-mono text-sm ${kindColor(last.kind)}`}
              >
                <span className={`h-2 w-2 rounded-full ${stripe(last.kind)}`} />
                {last.kind}
                <span className="text-mist">{last.code}</span>
              </div>
              <p className="font-serif text-2xl">{last.reason}</p>
              <dl className="grid grid-cols-2 gap-3 font-mono text-[11px] text-mist sm:grid-cols-4">
                <Stat label="Fee" value={`$${last.simulated.est_fee_usd}`} />
                <Stat label="Slip" value={`$${last.simulated.est_slippage_usd}`} />
                <Stat label="Fill" value={`$${last.simulated.est_fill_usd}`} />
                <Stat label="Venue" value={last.plan.venue} />
              </dl>
              {last.kind === "CONFIRM" && (
                <p className="font-mono text-[11px] text-confirm">
                  Human path. Approve is a demo stamp — no MCP write in Chunk 2.
                </p>
              )}
            </section>
          )}

          {!last && (
            <p className="mt-16 font-mono text-xs text-mist">
              No agent has spoken yet.
            </p>
          )}

          <div className="mt-auto pt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-line">
            Agents cannot withdraw · one constitution · two agents
          </div>
        </main>

        <aside className="flex flex-col bg-ink">
          <div className="flex border-b border-line font-mono text-[11px]">
            {(["Plan", "Policy", "Ledger"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 px-3 py-3 ${
                  tab === t ? "text-bone" : "text-mist"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {tab === "Plan" && (
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-5 text-mist">
                {last
                  ? JSON.stringify(
                      { ...last.plan, decision: last.kind, code: last.code },
                      null,
                      2
                    )
                  : "// submit an intent"}
              </pre>
            )}

            {tab === "Policy" && (
              <div className="space-y-4 font-mono text-[12px]">
                <Field label="autonomy">
                  <select
                    value={policy.autonomy}
                    onChange={(e) =>
                      setPolicy({ ...policy, autonomy: e.target.value as AutonomyLevel })
                    }
                    className="w-full bg-void px-2 py-1 text-bone outline-none"
                  >
                    {["L0", "L1", "L2", "HALT"].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </Field>
                <Field label="mode">
                  <select
                    value={policy.mode}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        mode: e.target.value as Policy["mode"],
                      })
                    }
                    className="w-full bg-void px-2 py-1 text-bone outline-none"
                  >
                    <option value="paper">paper</option>
                    <option value="live">live</option>
                  </select>
                </Field>
                <Field label="max_notional_usd">
                  <input
                    type="number"
                    value={policy.max_notional_usd}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        max_notional_usd: Number(e.target.value),
                      })
                    }
                    className="w-full bg-void px-2 py-1 text-bone outline-none"
                  />
                </Field>
                <Field label="confirmation_above">
                  <input
                    type="number"
                    value={policy.confirmation_above}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        confirmation_above: Number(e.target.value),
                      })
                    }
                    className="w-full bg-void px-2 py-1 text-bone outline-none"
                  />
                </Field>
                <Field label="realized_pnl_today_usd">
                  <input
                    type="number"
                    value={pnl}
                    onChange={(e) => setPnl(Number(e.target.value))}
                    className="w-full bg-void px-2 py-1 text-bone outline-none"
                  />
                </Field>
                <p className="text-[10px] leading-4 text-mist">
                  forbidden_venues: futures, margin
                  <br />
                  withdrawals: false
                  <br />
                  Saving policy does not fork per agent.
                </p>
              </div>
            )}

            {tab === "Ledger" && (
              <div>
                <div className="mb-3 flex flex-wrap gap-1 font-mono text-[10px]">
                  {(["ALL", "ALLOW", "DENY", "CONFIRM"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`rounded-full border px-2 py-0.5 ${
                        filter === f
                          ? "border-violet text-bone"
                          : "border-line text-mist"
                      }`}
                    >
                      {f}{" "}
                      {f === "ALL"
                        ? ledger.length
                        : ledger.filter((r) => r.kind === f).length}
                    </button>
                  ))}
                </div>
                <ul className="space-y-1">
                  {visible.map((r) => (
                    <li
                      key={r.id}
                      className="flex gap-3 border border-line bg-void/60 p-3 font-mono text-[10px]"
                    >
                      <span className={`w-0.5 shrink-0 ${stripe(r.kind)}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between text-mist">
                          <span>{r.at}</span>
                          <span className={kindColor(r.kind)}>{r.kind}</span>
                        </div>
                        <div className="truncate text-bone">{r.plan.intent}</div>
                        <div className="truncate text-mist">
                          {r.plan.agent} · {r.code}
                        </div>
                      </div>
                    </li>
                  ))}
                  {visible.length === 0 && (
                    <p className="text-[11px] text-mist">No agent has spoken yet.</p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-mist">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line p-3">
      <dt className="uppercase tracking-[0.16em]">{label}</dt>
      <dd className="mt-1 text-bone">{value}</dd>
    </div>
  );
}
