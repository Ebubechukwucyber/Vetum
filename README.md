# Vetum

**Agents propose. Policy decides. Binance executes.**

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

## Judge in two minutes

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

### 2. Bind Vetum

Create a ChatGPT **Project** named `VetumAgent`. Upload:

```text
agent/SYSTEM.md
skills/vetum/SKILL.md
lib/policy.ts
```

Paste `agent/SYSTEM.md` into **Custom instructions**.

### 3. Prompts that prove it

Plugin **on**, inside that project:

```text
Use Binance MCP. Show BTCUSDT price and Agentic spot balances. Do not place an order.
```

```text
Propose: Buy $800 of BNB on spot. Stamp ALLOW/DENY/CONFIRM. No write tools.
```

```text
Propose: Open 10x BTC perpetual. Stamp DENY. Do not call futures tools.
```

Pass: real **tool call** for price; perp is **DENY** and no write tool.

Claude Code (official recipe) if you use that host instead:

```bash
claude mcp add binance-mcp-server --transport http https://agent.binance.com/mcp/agentic
```

Then `/mcp` → Authenticate. Same `SYSTEM.md`.  
Cursor cannot finish Binance OAuth (no dynamic client registration). Use ChatGPT or Claude Code.

---

## What we built

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

## Line for the submission tweet

> Track A — VetumAgent on Binance Agent OS.  
> Agents propose. Policy decides. MCP executes only after ALLOW.  
> https://github.com/Ebubechukwucyber/Vetum

Hackathon prototype. Not financial advice. Not a hosted exchange.
