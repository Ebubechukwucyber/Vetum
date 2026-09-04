# Vetum — project context

Hand this file to any LLM before they write code.

---

## One-line product

**Vetum is a programmable control plane for autonomous Binance agents.**  
Agents propose. Policy decides. Binance executes.

It is **not** a trading bot, signal model, meme sniper, or dashboard of candles.

---

## Why it exists

Binance Agent OS (Track A, Mini Hackathon) lets agents call MCP tools against an Agentic sub-account. Account-level limits exist. They are not a **strategy constitution**.

The gap: an agent can be “allowed to trade” and still open the wrong venue, the wrong size, or keep trading after the day’s loss budget is gone.

Vetum sits between intent and execution:

```
USER intent
    → AGENT PLANNER (structured plan)
    → SIMULATOR (fees / slippage / exposure)
    → VETUM checkPolicy()     ALLOW | DENY | CONFIRM
    → Binance MCP (only on ALLOW, or after human CONFIRM)
    → AUDIT LEDGER
```

LLM never holds keys. LLM never sets hard limits. Limits are deterministic TypeScript.

---

## Contest

- Event: Binance Agent OS Mini Hackathon
- Track: **A — Build an AI agent with Agent OS**
- Official stack to respect later (Chunk 5): MCP `https://agent.binance.com/mcp/agentic`, Skills Hub, Agentic sub-account (spot/convert inside sub-account, no external withdraw)
- Capital constraint: operator is broke; **$5** is the live budget if any
- Default mode: **paper**
- Forbidden in v1: futures, margin, withdrawals, tokens, charts, extra venues

Target story for judges:

> Two agents. One constitution. One function. Allow, deny, confirm, halt.

---

## Brand (locked)

- Name: **Vetum**
- Line: Agents propose. Policy decides. Binance executes.
- Public title on the quote-tweet: Vetum
- Repo: `vetum`
- Skill id (Chunk 4): `skills/vetum`
- Do not rename to AgentPolicy, PoliGent, Authera, Pactum, Aegis, Nexora

Killed names (collisions or generic): AgentPolicy (subtitle only), PoliGent, Authera, Arbitra, Veyra, Edict, Pactum, Auctor, Velora, Mandex.

---

## What winning looks like (judge rubric, /100)

Approximate weights we designed against:

| Bucket | Pts | Bar |
|---|---|---|
| Native Agent OS / MCP / Skill shape | 20 | Skill other agents can call |
| Safety / control | 20 | Deterministic gate, no-withdraw, halt |
| Differentiation | 20 | Not SMA / meme-rush cookbook |
| Working demo | 20 | 90s video, live paths |
| Code quality | 20 | Tests, types, readable constitution |

Ceiling if we ship the **control plane** version: high 80s–low 90s.  
Ceiling if we ship “max $500 checker” only: ~75–82.

Do not add features that look like a rules form. The wow is: **plan → simulate → three-way decision → second agent same gate → halt**.

---

## Constitution (the actual product)

Source of truth: `lib/policy.ts` → `checkPolicy(plan, policy, ctx)`.

Default file: `policy.example.yaml` / `lib/defaultPolicy.ts`

```
autonomy: L2
mode: paper
max_notional_usd: 5
max_daily_loss_usd: 5
allowed_venues: [spot]
forbidden_venues: [futures, margin]
allowed_symbols: [BNBUSDT, BTCUSDT, ETHUSDT]
confirmation_above: 4
withdrawals: false
```

### Autonomy

| Level | Meaning |
|---|---|
| L0 | Read / market data only. All writes DENY `READ_ONLY` |
| L1 | Plans allowed. Every order CONFIRM |
| L2 | Auto under `confirmation_above`; CONFIRM at/above it; still capped by max notional |
| HALT | Everything DENY `HALTED`. Circuit breaker |

### Decision order (do not reorder without updating tests)

1. HALT  
2. L0 read-only  
3. Withdrawal / onchain  
4. Forbidden venue / not in allowlist  
5. Symbol allowlist  
6. Daily loss floor (`realized_pnl_today_usd <= -max_daily_loss_usd`)  
7. Max notional  
8. Leverage > 1  
9. L1 **or** notional >= `confirmation_above` → CONFIRM  
10. ALLOW  

### Intent parser

`lib/parseIntent.ts` is heuristic. Not an LLM.

- `$` or first number → notional  
- bnb/btc/eth words → symbol  
- perp/futures/Nx → venue futures + leverage  
- sell/short/reduce/flatten → side sell  
- withdraw → onchain / withdrawal deny path  

### Simulation (stub)

Taker 10 bps, slippage 5 bps. Enough to show “deny is reasoned.” Do not build a matching engine.

---

## File map (Chunk 1, current)

```
vetum/
  BUILD.md                 5 chunks + done checks
  README.md
  project.context.md       this file
  memory.md                where we stopped
  package.json             test script only so far
  policy.example.yaml
  lib/
    types.ts
    defaultPolicy.ts
    parseIntent.ts
    parseIntent.test.ts
    policy.ts              THE GATE
    policy.test.ts
```

Run:

```bash
npm test
```

Uses Node 20+ `--experimental-strip-types`. Verified Node v24 on sandbox and on the operator’s Windows PowerShell.

---

## Build plan (do not skip)

### Chunk 1 — Constitution — DONE

Pure engine + 9 tests.

### Chunk 2 — Chamber — NEXT

Next.js App Router + Tailwind. Route `/app`.

Must show:

- Intent dock + chips:
  - `Buy $3 of BNB on spot` → ALLOW
  - `Buy $4 of BNB on spot` → CONFIRM
  - `Buy $500 BTC` → DENY max notional
  - `Open 5x BTC perpetual` → DENY forbidden venue
- Plan JSON, sim lines, decision stamp
- Policy inspector (edit autonomy / caps; saving re-runs the last plan)
- Ledger (newest first, stripe color by kind)
- HALT hardware-like control
- Agent switch does **not** fork policy

Done when those four chips work without refresh.

### Chunk 3 — Gate (marketing + 3D)

Route `/`. Cinematic Lithos/Foliom language:

- void `#07070B`, bone `#F4EFE6`, mist `#A7A29A`, violet `#7B6CFF`
- allow `#C8F4D2`, deny `#FF5A4F`, confirm `#E8B86D`
- Display: Instrument Serif / Fraunces
- UI: Geist / Satoshi
- Ledger: Geist Mono
- R3F icosahedron core + 3 orbits ALLOW/DENY/CONFIRM — **not** Earth, **not** a BTC coin
- Chamber mini-orb mirrors state

### Chunk 4 — Skill + second agent

- `skills/vetum/SKILL.md` describing `check_policy()`
- Dummy MemeAgent that **must** import the same function
- `/skill` page
- README threat model: no withdraw, LLM no keys, paper default

### Chunk 5 — Live $5 (optional)

Only after 2–4. MCP market data + one spot attempt if minNotional allows. If not, honest paper row. Never fake a live fill.

---

## UI / UX law (Chunk 2–3)

Reference vibe: Dean Perkins cinematic-site tutorial (Lithos / Foliom): black void, huge serif, one 3D object, scroll as story. Not a Binance clone.

Voice:

- ALLOW: `Within constitution.`
- DENY size: `max_notional_usd · $500 > $5`
- DENY venue: `forbidden_venues · futures`
- CONFIRM: `Notional $4.20 requires a human.`
- HALT: `Autonomy halted. Daily loss floor reached.` / `Autonomy halted. No writes.`
- Empty ledger: `No agent has spoken yet.`

No emoji in the Chamber. No candlesticks. No “Oops.”

90-second demo order (UI must support this):

1. Hero (Chunk 3)  
2. Enter chamber, show $5 + PAPER  
3. $3 or $4 path  
4. Perp DENY, orb red  
5. CONFIRM gold + Approve  
6. Second agent, same gate  
7. HALT  
8. GitHub + skill folder  

---

## Hard no’s

- Do not rebuild `checkPolicy` as an LLM prompt
- Do not add indicators, news, token pages, wallet-connect circus
- Do not allow futures “just for the demo”
- Do not spend the $5 until Chunk 5 and minNotional is known
- Do not rename the brand mid-build
- Do not start Chunk 3 before Chunk 2 done-check
- Do not claim live MCP if the row is mocked — label `mock_`

---

## Operator facts

- Path on disk: `C:\Users\Ebubechukwu\Documents\vetum`
- Broke; can get $5 for Agentic sub-account
- After contest, funds move main ↔ sub manually; no special Binance “end of hackathon” pipe
- Wants another LLM to be able to continue from these two markdown files

---

## Git convention

```
feat(policy): chunk 1 constitution
feat(chamber): chunk 2 control plane ui
feat(gate): chunk 3 marketing and r3f
feat(skill): chunk 4 skill hub module
docs: memory and context
```

Never commit `.env` or API keys.

---

## Definition of done for the whole hackathon

- `npm test` still green  
- Chamber demo of ALLOW / DENY / CONFIRM / HALT  
- Two agent names, one function  
- 90s video  
- Skill-shaped folder  
- Honest paper vs live labeling  
- README a judge can skim in 90 seconds  
