# Vetum memory

Last updated: 2026-09-04 11:44 WAT  
Operator: Ebubechukwu (`C:\Users\Ebubechukwu\Documents\vetum`)

## Where we stopped

**Chunk 1 — Constitution — DONE.**

`npm test` on the Windows machine:

- 9 passed
- 0 failed
- duration ~349ms

Confirmed locally:

- `$3 BNB spot` → ALLOW
- `$4 BNB spot` → CONFIRM (`confirmation_above: 4`)
- `$500 BTC` → DENY `MAX_NOTIONAL`
- `5x BTC perp` → DENY `FORBIDDEN_VENUE`
- withdraw → DENY `WITHDRAWAL_FORBIDDEN`
- HALT → DENY `HALTED` even on a legal $3 buy
- daily loss −$5 → DENY `DAILY_LOSS_FLOOR`
- MemeAgent and PortfolioAgent share `checkPolicy()`

**Chunk 2 — Chamber — NOT STARTED.**  
No Next.js app. No `/app` UI. No Three.js. No MCP. No Skill Hub folder.

## Next action (do this, nothing else)

Start **Chunk 2 only**:

1. Scaffold Next.js (App Router) + TypeScript + Tailwind in this same repo.
2. Move/keep `lib/` as the source of truth. Do not rewrite `checkPolicy`.
3. Build `/app` Chamber:
   - intent field + 4 chips
   - plan JSON → sim → decision stamp
   - policy inspector
   - ledger
   - HALT switch (`autonomy: "HALT"`)
   - agent toggle PortfolioAgent | MemeAgent (same gate)
4. Done check: four chips produce ALLOW / DENY / CONFIRM / HALT without a refresh.

Do **not** start Chunk 3 (marketing + R3F) until Chunk 2 done-check passes.

## How to resume with another LLM

Paste this file + `project.context.md` + `BUILD.md`.

First message to the new model:

> Read `memory.md` and `project.context.md`. Chunk 1 is done. Implement Chunk 2 only. Do not invent a new product. Do not add charts, tokens, or futures. Import `checkPolicy` and `parseIntent` from `lib/`.

After every session, update this file:

- what landed
- tests / done-check
- exact next file to touch
- anything the operator must run on Windows

## Session log

| When | What |
|---|---|
| 2026-09-03 | Product locked: control plane, not a bot. Brand: Vetum. Track A Binance Agent OS Mini Hackathon. $5 budget, spot only, paper default. |
| 2026-09-04 | Chunk 1 written (`lib/policy.ts` + tests). 9/9 pass on sandbox and on `C:\Users\Ebubechukwu\Documents\vetum`. |
| 2026-09-04 11:44 | This memory + `project.context.md` added. Git handoff prepared. Next = Chunk 2. |
