# Vetum

**Agents propose. Policy decides. Binance executes.**

| | |
|---|---|
| [See it first](#see-it-first-no-install) | Hosted demo, no install |
| [The problem](#the-problem) | Why Agent OS permission is not enough |
| [Edit the constitution](#the-constitution-is-editable) | Change caps, venues, HALT |
| [Clone and test](#clone-and-test) | `npm test` + `agent/run.ts` |
| [Agent OS / ChatGPT](#query-it-on-real-agent-os-chatgpt) | Bind MCP + your policy |
| [What I built](#what-I-built) | Files and autonomy levels |
| [Demo constitution](#demo-constitution-libdemopolicyts) | Default numbers |
| [Threat model](#threat-model) | Keys, writes, halt |
| [Repository](#repository) | Tree |

Track A — [Binance Agent OS Mini Hackathon](https://x.com/binance/status/2094810011557838988)

Vetum is a **Binance Agent OS agent** with a programmable constitution.  
The host (ChatGPT, Claude Code, Codex) calls official MCP.  
**Vetum decides whether that call is allowed.**

It is not a signal bot, meme sniper, or candlestick terminal.

```
intent → plan → checkPolicy() → ALLOW | DENY | CONFIRM
                                      ↓
                         ALLOW + live → Binance MCP write
                         otherwise    → no write, ledger the stamp
```

MCP endpoint (official):

```text
https://agent.binance.com/mcp/agentic
```

Repo: https://github.com/Ebubechukwucyber/Vetum

---

## See it first (no install)

**[https://vetum.vercel.app](https://vetum.vercel.app)** — demo site only.

This is **not** the Agent OS agent. It does not log into Binance, does not call MCP, and cannot place an order. It is a hosted viewer of the same `checkPolicy` stamps so you can understand Vetum before anything else.

1. Click around the site (`/app` chips + HALT).  
2. Then clone and `npm test` if you want the proof in code.  
3. Then [Agent OS / ChatGPT](#query-it-on-real-agent-os-chatgpt) if you want the **real** agent (MCP tools + your constitution).

| Page | |
|---|---|
| [vetum.vercel.app](https://vetum.vercel.app) | Landing |
| [/app](https://vetum.vercel.app/app) | Chamber — $800 ALLOW · $2.8k CONFIRM · $50k DENY · perp DENY · HALT |
| [/skill](https://vetum.vercel.app/skill) | Two agents, one gate |

---

## The problem

Binance Agent OS lets an LLM call trading tools on an **Agentic sub-account**. That sandbox is real. It is not a **strategy constitution**.

Account permission can still allow an agent to:

- open **futures** when the desk only wanted spot
- size a market buy past what the trader can survive
- keep writing after the daily loss floor
- attempt a **withdraw** the user never meant to grant at strategy level

Exchange toggles are coarse (product on/off). They do not encode *this* trader:

> “Spot only. Max $10k. Above $2,500 ask me. If I smash HALT, nothing writes — even a legal buy.”

Vetum is that missing layer: **programmable policy between intent and MCP.**  
Agents propose. Policy decides. Binance executes only after ALLOW.

---

## The constitution is editable

The demo numbers are **not** the product. The product is that **you change the law** without rewriting the agent.

Edit `lib/demoPolicy.ts` (Chamber) or `policy.example.yaml` (readable copy):

| Knob | Example trader |
|---|---|
| `max_notional_usd` | $200 student desk vs $10,000 demo |
| `confirmation_above` | “ask me above $100” vs “ask me above $2,500” |
| `allowed_venues` / `forbidden_venues` | spot-only vs allow convert |
| `allowed_symbols` | BNB only vs BTC/ETH book |
| `max_leverage` | 1× vs a defined cap |
| `max_daily_loss_usd` | stop the day after a floor |
| `autonomy` | L0 read / L1 always confirm / L2 bounded auto / **HALT** |
| `mode` | simulate first; live only when you mean it |

Same `checkPolicy()`. Same Skill. Same ChatGPT host.  
Two agents cannot fork the law — they all call one function.  
Change the YAML/TS, re-run `npm test` / Chamber chips. The gate follows the new desk.

Do **not** edit `lib/defaultPolicy.ts` to “match demo.” That file pins the 9 unit tests.

---

## Clone and test

```bash
git clone https://github.com/Ebubechukwucyber/Vetum.git
cd Vetum
npm install
npm test
```

Expect **9/9**.

```bash
npx tsx agent/run.ts "Buy $800 of BNB on spot"
npx tsx agent/run.ts "Open 10x BTC perpetual"
```

Windows PowerShell: use **single quotes** around the intent so `$800` is not a variable.

| Command | Result |
|---|---|
| $800 BNB spot | `ALLOW` `WITHIN_CONSTITUTION` — no MCP write |
| 10x BTC perpetual | `DENY` `FORBIDDEN_VENUE` — blocked |

```bash
npm run dev
```

| URL | What to click |
|---|---|
| [/](http://localhost:3000) | Product |
| [/app](http://localhost:3000/app) | Chamber — four chips + **HALT** |
| [/skill](http://localhost:3000/skill) | Two agents, one `check_policy` |
| [/agent](http://localhost:3000/agent) | Track A loop |

Chamber expected stamps:

| Chip | Stamp |
|---|---|
| Buy $800 of BNB on spot | ALLOW |
| Buy $2,800 of ETH on spot | CONFIRM |
| Buy $50,000 BTC | DENY `MAX_NOTIONAL` |
| Open 10x BTC perpetual | DENY `FORBIDDEN_VENUE` |
| **HALT**, then any legal chip | DENY `HALTED` |

---

## Query it on real Agent OS (ChatGPT)

Vetum is not a second MCP server. Binance hosts MCP. You attach Vetum as the **agent constitution**.

### 1. Connect Binance MCP to ChatGPT

Desktop browser → [chatgpt.com](https://chatgpt.com)

1. Settings → enable **Developer mode**
2. Plugins / Apps → **Create**
3. URL:

```text
https://agent.binance.com/mcp/agentic
```

4. Authenticate on Binance  
5. Enable **market data** + **account**. Leave **futures** and withdraw **off**.

### 2. Bind Vetum — then make it *your* desk

The files in the repo are a **starter constitution**, not a lock.

Create a ChatGPT **Project** (any name). Upload:

```text
agent/SYSTEM.md
skills/vetum/SKILL.md
lib/policy.ts
lib/demoPolicy.ts
policy.example.yaml
```

ChatGPT does **not** run TypeScript. Two different places, two edits:

| Where you trade | File you change | Leave alone |
|---|---|---|
| Website Chamber (`npm run dev`) | **`lib/demoPolicy.ts` only** | `lib/policy.ts` |
| ChatGPT Agent OS | **Custom instructions** — the constitution list below | You do not need to edit uploaded `.ts` files |

Paste `agent/SYSTEM.md` into Custom instructions, then change **only this list** to your desk:

```text
Constitution (edit these lines):
- venues allowed: spot
- forbidden: futures, margin, withdraw
- max notional: 500 USD
- confirm above: 100 USD
- daily loss floor: 50 USD
- symbols allowed: BNBUSDT
- autonomy: L2
- live orders: only if I say "live allow"
```

Then tell ChatGPT once:

```text
Stamp ALLOW / DENY / CONFIRM using the constitution in these instructions, not the demo $10,000 in the repo.
```

Later changes: edit that list again, or say `Update constitution: max notional 200`.  
HALT stays a hard stop until you say `RESUME L2`.

Uploaded `demoPolicy.ts` is only reference. If you skip the Custom instructions edit, ChatGPT will keep the demo numbers even if you changed the file on disk.

Binance product toggles (futures off) are a second lock. Vetum is the strategy lock.

### 3. Prompts that prove it (use *your* sizes)

Plugin **on**, inside that project:

```text
Use Binance MCP. Show BTCUSDT price and Agentic spot balances. Do not place an order.
```

```text
Propose a spot buy under my max notional. Stamp ALLOW/DENY/CONFIRM. No write tools.
```

```text
Propose: Open 10x BTC perpetual. Stamp DENY if my constitution forbids futures. No write tools.
```

Pass: real **tool call** for price; a forbidden venue is **DENY** and no write tool.  
If you set max notional to $200, a $800 buy must DENY — that proves *your* policy loaded, not ours.

Claude Code (official recipe) if you use that host instead:

```bash
claude mcp add binance-mcp-server --transport http https://agent.binance.com/mcp/agentic
```

Then `/mcp` → Authenticate. Same `SYSTEM.md`.  
Cursor cannot finish Binance OAuth (no dynamic client registration). Use ChatGPT or Claude Code.

---

## What I built

| Layer | Implementation |
|---|---|
| Agent | `agent/run.ts` + `agent/SYSTEM.md` (ChatGPT / Claude) |
| Gate | `lib/policy.ts` → `checkPolicy` |
| Skill | `skills/vetum/SKILL.md` + `lib/skill.ts` → `check_policy` |
| Plan | `lib/parseIntent.ts` |
| After stamp | `lib/executor.ts` |
| Control room | `/app` Chamber |
| Demo constitution | `lib/demoPolicy.ts` (UI) |
| Test fixture | `lib/defaultPolicy.ts` — **do not merge with demo** |

Autonomy is **not** a blockchain layer:

| Level | Meaning |
|---|---|
| **L0 — read only** | Markets only. Every write DENY. |
| **L1 — propose** | Every order CONFIRM. |
| **L2 — bounded auto** | Demo default. Legal spot under caps may ALLOW. |
| **HALT — stop** | Circuit breaker. Even a legal spot buy is DENY. |

Check order in `checkPolicy`: HALT → L0 → withdraw → venue → symbol → daily loss → notional → leverage → confirm → ALLOW.

Writes never run on DENY or CONFIRM. No API keys in git. Auth is Binance pairing.

---

## Demo constitution (`lib/demoPolicy.ts`)

- L2, spot only  
- max notional **$10,000**  
- confirm above **$2,500**  
- daily loss floor **$1,500**  
- forbidden: futures, margin, withdraw  
- symbols: BNBUSDT, BTCUSDT, ETHUSDT  

---

## Threat model

- The LLM never holds exchange keys.  
- Two agents (PortfolioAgent, MemeAgent) share one function.  
- Withdrawals are out of scope.  
- Live MCP write only after ALLOW and an explicit live instruction.  
- HALT is a hard stop, not a prompt suggestion.

---

## Repository

```
lib/policy.ts              gate
lib/skill.ts               check_policy
lib/executor.ts            after the stamp
lib/parseIntent.ts         intent → plan
lib/demoPolicy.ts          UI constitution
lib/defaultPolicy.ts       test fixture
lib/*.test.ts              npm test — 9 tests
agent/run.ts               local VetumAgent
agent/SYSTEM.md            paste into ChatGPT / Claude
skills/vetum/SKILL.md      Agent OS skill
app/app                    Chamber
app/skill                  Skill Hub
app/agent                  Track A page
MCP.md                     official endpoint
DEMO.md                    recording shot list
```

---

Hackathon prototype. Not financial advice. Not a hosted exchange.
