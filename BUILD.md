# Vetum — 5 chunks

**Line:** Agents propose. Policy decides. Binance executes.

Do not skip ahead. Each chunk has a done check. If the check fails, stay on that chunk.

---

## Chunk 1 — Constitution (NOW)

Pure policy engine. No UI. No Three.js. No MCP.

- Types for Plan, Policy, Decision
- `checkPolicy(plan, policy, context)` → ALLOW | DENY | CONFIRM
- Intent parser (heuristic, not an LLM)
- Circuit breaker / HALT
- Example constitution (`policy.example.yaml`)
- Node tests you can run with `npm test`

**Done when:** `npm test` is green and `Buy $500 BTC` returns DENY for `max_notional_usd`.

---

## Chunk 2 — Chamber

`/app` control-plane UI on the engine from Chunk 1.

- Intent dock + chips
- Plan → sim → decision stamp
- Policy inspector
- Ledger
- HALT switch
- Two agent names, one `checkPolicy()`

**Done when:** four chips produce ALLOW / DENY / CONFIRM / HALT on screen without a page refresh.

---

## Chunk 3 — Gate (marketing + 3D)

`/` cinematic page + R3F core.

- Hero serif + orb
- Loop diagram
- Autonomy cards
- Two-agents-one-gate
- Chamber orb mirrors decision state

**Done when:** 90s video can open on `/` then click into `/app`.

---

## Chunk 4 — Skill + second agent

- `skills/vetum/SKILL.md`
- `/skill` page
- Dummy MemeAgent script that must call the same gate
- README threat model + demo script

**Done when:** a judge can see two agents, one function.

---

## Chunk 5 — Live hook (optional, $5)

- MCP market-data read if keys exist
- One spot attempt only if minNotional clears
- Keep paper as default

**Done when:** either a real order id *or* an honest “minNotional blocked, paper fill” row.

Do not start Chunk 5 until 2–4 work.
