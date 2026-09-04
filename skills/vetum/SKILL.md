---
name: vetum
version: 0.1.0
description: Deterministic policy gate for Binance Agent OS. Agents propose a plan. Vetum returns ALLOW, DENY, or CONFIRM. Never holds keys. Never executes.
entrypoint: check_policy
---

# Vetum

Call this skill **before** any Binance MCP write (`place_order`, convert, transfer).

Do **not** use this skill to invent a trade. Use it to decide whether a plan may proceed.

## When to use

- An agent produced a structured plan (symbol, venue, side, notional, leverage).
- You need a hard constitution: max notional, venue allowlist, daily loss, halt, no withdrawals.
- Two or more agents must share one gate.

## When not to use

- Market data only (L0).
- The user already issued HALT — return DENY yourself; do not retry.
- Withdrawals. Vetum always denies them.

## Contract

```
check_policy(plan, constitution?, market?) → Decision
```

### Plan

| field | type | notes |
|---|---|---|
| agent | string | e.g. PortfolioAgent, MemeAgent |
| intent | string | original user language |
| symbol | string | BNBUSDT, BTCUSDT, ETHUSDT |
| venue | spot \| margin \| futures \| convert \| onchain | futures/margin denied in default constitution |
| side | buy \| sell | |
| notional_usd | number | |
| leverage | number | >1 denied on spot constitution |
| order_type | market \| limit | |

### Decision

```
{
  kind: "ALLOW" | "DENY" | "CONFIRM",
  code: "WITHIN_CONSTITUTION" | "HALTED" | "FORBIDDEN_VENUE" | "MAX_NOTIONAL" | ...,
  reason: string,
  plan,
  simulated: { mid_usd, est_fee_usd, est_slippage_usd, est_fill_usd, exposure_after_usd }
}
```

### What the caller must do

| kind | action |
|---|---|
| ALLOW | May call Binance MCP write tools. Append decision to ledger. |
| DENY | Do **not** call write tools. Show `code` + `reason`. |
| CONFIRM | Pause. Ask the human. Only then execute. |

## Default constitution (demo)

```
autonomy: L2
mode: paper
max_notional_usd: 10000
max_daily_loss_usd: 1500
confirmation_above: 2500
allowed_venues: [spot]
forbidden_venues: [futures, margin]
allowed_symbols: [BNBUSDT, BTCUSDT, ETHUSDT]
withdrawals: false
```

Live contests may use a smaller fixture. The function does not care. The YAML does.

## Implementation

TypeScript source of truth:

- `lib/policy.ts` → `checkPolicy(plan, policy, ctx)`
- `lib/parseIntent.ts` → optional language → plan
- `lib/types.ts`

There is no LLM inside the gate.

## Example

```
plan = {
  agent: "MemeAgent",
  intent: "Open 10x BTC perpetual",
  symbol: "BTCUSDT",
  venue: "futures",
  side: "buy",
  notional_usd: 2000,
  leverage: 10,
  order_type: "market"
}

decision = check_policy(plan)
→ DENY  FORBIDDEN_VENUE  "forbidden_venues · futures"
```

Same function, different agent, same constitution.
