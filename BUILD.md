# Vetum — build log

Line: Agents propose. Policy decides. Binance executes.

Do not reopen a done chunk unless tests or the four chips regress.

---

## Chunk 1 — Constitution — DONE

- `lib/types.ts` Plan / Policy / Decision  
- `lib/policy.ts` `checkPolicy`  
- `lib/parseIntent.ts`  
- `lib/defaultPolicy.ts` + `policy.example.yaml`  
- `npm test` → 9/9  

Done check: `Buy $500 BTC` against the **test** fixture is DENY MAX_NOTIONAL.

---

## Chunk 2 — Chamber — DONE

- Next.js App Router + Tailwind  
- `/app` intent dock, chips, plan / sim / stamp, policy, ledger, HALT  
- PortfolioAgent + MemeAgent, one `checkPolicy`  
- Submit: Enter **and** arrow-in-box  
- Header: `L2 auto` (not bare L2), PAPER lamp, spent / cap  

Done check: four demo chips + HALT without refresh.

---

## Chunk 3 — Gate (marketing + R3F) — DONE

- `/` cinematic, centered hero, no Paper pill on marketing  
- `VetumCore` icosahedron + rings, 6.5s violet → green → gold → red  
- Labels ALLOW / CONFIRM / DENY on the **right** of the orb  
- Autonomy cards labeled as **read / propose / bounded auto / stop** (not chain L1/L2)  
- `VetumHorizon` footer field, client-mounted so SSR does not explode  

Done check: `/` then Enter chamber.

---

## Chunk 4 — Skill Hub — DONE

- `skills/vetum/SKILL.md`  
- `lib/skill.ts` `check_policy`  
- `/skill` + `SkillStudio` four callers  

Done check: MemeAgent 10x perp is DENY on the skill page.

---

## Chunk 5 — Executor + demo docs — DONE (paper)

- `lib/executor.ts`  
- `DEMO.md` 90s script  
- `MCP.md` official endpoint  

Live MCP fill: **not required to submit**. Optional balance read if the operator pairs Agent OS.

Done check: paper ALLOW + blocked futures (verified in PowerShell via `tmp-exec.mts`).

---

## Do not do next

- Restyle the hero again  
- Merge demoPolicy into defaultPolicy  
- Commit API keys  
- Enable futures “to see if MCP works”  
- Replace `checkPolicy` with an LLM  

## Do next (operator)

1. Drop any files still only on this machine into `Documents\vetum`  
2. `npm test`  
3. Commit and push (commands in `memory.md`)  
4. Record `DEMO.md`  
5. Quote-tweet the repo + video  
