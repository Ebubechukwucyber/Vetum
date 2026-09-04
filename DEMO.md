# Vetum — 90 second demo

Record 1920×1080. Voice or on-screen captions. Do not apologize for paper mode.

## Setup

- `npm run dev`
- Start on `/`
- Have `/app` and `/skill` ready in your head
- Mode: PAPER. Optional: funded Agentic sub-account for a balance read only

## 0:00–0:12  `/`

Hold on the core. Say:

> This is Vetum. Agents propose. Policy decides. Binance executes.
> Exchange permission is not a constitution.

Click **Enter the chamber**.

## 0:12–0:48  `/app`

Four chips, no refresh:

1. Buy $800 of BNB on spot → **ALLOW**
2. Buy $2,800 of ETH on spot → **CONFIRM**
3. Buy $50,000 BTC → **DENY** max_notional
4. Open 10x BTC perpetual → **DENY** forbidden_venues

Switch agent to MemeAgent. Repeat chip 1. Same gate.

Hit **HALT**. Chip 1 again → **DENY HALTED**.

Point at the ledger. One line per decision.

## 0:48–1:10  `/skill`

> Other agents do not get a second policy. They call `check_policy()`.

Click MemeAgent “Open 10x BTC perpetual”. Show DENY JSON.

## 1:10–1:30  close

Back to `/`. One line:

> LLM never holds keys. Futures never pass. Withdrawals are false.
> Two agents. One constitution.

End on the core.

## If you have $5 live

After ALLOW, show a balance **read** from the Agentic sub-account via MCP  
`https://agent.binance.com/mcp/agentic`  
Do **not** withdraw. One tiny spot fill is optional. If the fill fails on minNotional, keep paper and say so. Honesty beats a fake fill.

## Quote-tweet line

Vetum — programmable control plane for Binance Agent OS. Agents propose. Policy decides.
