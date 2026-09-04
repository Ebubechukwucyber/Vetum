# Vetum

**Agents propose. Policy decides. Binance executes.**

Vetum is a programmable control plane for [Binance Agent OS](https://agent.binance.com). It is the constitution between an autonomous agent and an exchange write.

It is **not** a trading bot, signal model, meme sniper, or candlestick terminal.

```
intent  →  plan  →  simulate  →  checkPolicy()  →  ALLOW | DENY | CONFIRM
                         ↓
              paper fill  |  human  |  blocked
                         ↓
                    audit ledger
```

On `ALLOW` and only then may a caller invoke Binance MCP  
`https://agent.binance.com/mcp/agentic`  
on an Agentic sub-account. Withdrawals are out of scope. Futures are denied by the demo constitution.

---

## Why it exists

Agent OS lets an LLM call trading tools against a sandboxed sub-account. Account-level limits exist. They are not a **strategy constitution**.

An agent can be “allowed to trade” and still:

- open the wrong venue (perp instead of spot)
- size past the desk’s max
- keep writing after the daily loss floor
- attempt a withdraw

Vetum is the missing gate: deterministic TypeScript, no keys in the model, one function shared by every agent.

---

## Contest framing

- Event: Binance Agent OS Mini Hackathon  
- Track: **A — Build an AI agent with Agent OS**  
- Repo: https://github.com/Ebubechukwucyber/Vetum  
- Skill id: `skills/vetum`

Vetum is the **gate the agent must pass**. The agent is the caller (planner + MCP). The product you judge is: two agents, one constitution, three stamps, halt.

---

## Quick start

```powershell
cd C:\Users\Ebubechukwu\Documents\vetum
npm install
npm test
npm run dev
```

| URL | What |
|---|---|
| http://localhost:3000 | Cinematic gate + core |
| http://localhost:3000/app | Chamber — live control plane |
| http://localhost:3000/skill | Other agents call `check_policy()` |
| /how /constitution /agents /ledger | Explainer surfaces |

`npm test` must be **9/9**. Those tests pin `lib/defaultPolicy.ts` (small fixture). The UI uses `lib/demoPolicy.ts` (institutional demo caps). Do not merge those files.

---

## The gate

Source of truth: `lib/policy.ts`

```ts
checkPolicy(plan, policy, market) → Decision
```

Public Skill Hub name: `lib/skill.ts` → `check_policy(plan, constitution?, market?)`

Decision:

```
kind: ALLOW | DENY | CONFIRM
code: WITHIN_CONSTITUTION | HALTED | READ_ONLY | FORBIDDEN_VENUE
      | SYMBOL_NOT_ALLOWED | MAX_NOTIONAL | MAX_LEVERAGE
      | DAILY_LOSS_FLOOR | WITHDRAWAL_FORBIDDEN | REQUIRES_HUMAN
reason: string
plan: Plan
simulated: { mid, fee, slippage, fill, exposure }
```

Check order (constitution, not a prompt):

1. HALT  
2. L0 read-only  
3. Withdraw / on-chain leave  
4. Forbidden venue / not in allowlist  
5. Symbol allowlist  
6. Daily loss floor  
7. Max notional  
8. Leverage  
9. L1 always confirm / confirmation_above  
10. ALLOW  

There is no LLM inside this function.

---

## Autonomy (not blockchain layers)

| Level | Meaning |
|---|---|
| **L0 — read only** | Markets only. Every write DENY. |
| **L1 — propose** | Plans exist. Every order CONFIRM. |
| **L2 — bounded auto** | Demo default. Legal spot under caps may ALLOW. |
| **HALT — stop** | Circuit breaker. Even a legal spot buy is DENY. |

---

## Paper vs live

| Mode | What happens on ALLOW |
|---|---|
| **paper** (default) | Simulated fill. MCP is not called. |
| **live** | Only if `policy.mode === "live"` **and** `VETUM_LIVE=1`. Caller may hit MCP spot write. |

`lib/executor.ts` encodes that. The **PAPER** pill in Chamber is a lamp, not a toggle. Do not put API keys in git.

Verified locally:

```
Buy $800 BNB spot     → PAPER + ALLOW + WITHIN_CONSTITUTION
Open 10x BTC perp     → BLOCKED + DENY + FORBIDDEN_VENUE
```

---

## Demo constitution (UI)

`lib/demoPolicy.ts`

- autonomy L2, mode paper  
- max_notional_usd 10_000  
- confirmation_above 2_500  
- max_daily_loss_usd 1_500  
- allowed venues: spot  
- forbidden: futures, margin  
- symbols: BNBUSDT, BTCUSDT, ETHUSDT  
- withdrawals: false  

Chamber chips (expected stamps):

| Intent | Stamp |
|---|---|
| Buy $800 of BNB on spot | ALLOW |
| Buy $2,800 of ETH on spot | CONFIRM |
| Buy $50,000 BTC | DENY MAX_NOTIONAL |
| Open 10x BTC perpetual | DENY FORBIDDEN_VENUE |
| HALT, then a legal spot buy | DENY HALTED |

---

## Repository map

```
lib/policy.ts              the gate
lib/skill.ts               Skill Hub wrapper
lib/executor.ts            paper / blocked / live-queued
lib/parseIntent.ts         language → plan (heuristic)
lib/demoPolicy.ts          UI constitution
lib/defaultPolicy.ts       test fixture — do not “fix” to $10k
lib/*.test.ts              9 tests
skills/vetum/SKILL.md      Agent OS skill contract
components/Chamber.tsx     control room
components/GateLanding.tsx /
components/three/          R3F core + horizon
components/SkillStudio.tsx two agents call the skill
app/app                    /app
DEMO.md                    90s shot list
MCP.md                     official endpoint notes
project.context.md         product bible for any LLM
```

---

## Threat model

- LLM never holds keys.  
- Writes never happen on DENY or CONFIRM.  
- Withdrawals are always denied.  
- Default venue is spot; futures are forbidden in the demo constitution.  
- Live requires two switches, not one UI click.  
- Two agents cannot fork policy. They call the same function.

---

## Record and submit

See `DEMO.md`. Ninety seconds:

`/` → `/app` four chips + HALT + agent toggle → `/skill` → `/`

Quote line: **Vetum — agents propose, policy decides.**

---

## License / status

Hackathon prototype. Paper-first. Not financial advice. Not a hosted exchange.
