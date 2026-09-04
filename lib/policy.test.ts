import assert from "node:assert/strict";
import { test } from "node:test";
import { defaultPolicy } from "./defaultPolicy.ts";
import { parseIntent } from "./parseIntent.ts";
import { checkPolicy } from "./policy.ts";
import type { Policy } from "./types.ts";

const ctx = { mid_usd: 600, realized_pnl_today_usd: 0 };

test("buy $4 BNB spot → CONFIRM because confirmation_above is 4", () => {
  const plan = parseIntent("Buy $4 of BNB on spot");
  const d = checkPolicy(plan, defaultPolicy, ctx);
  assert.equal(plan.symbol, "BNBUSDT");
  assert.equal(plan.venue, "spot");
  assert.equal(d.kind, "CONFIRM");
  assert.equal(d.code, "REQUIRES_HUMAN");
});

test("buy $3 BNB spot → ALLOW", () => {
  const plan = parseIntent("Buy $3 of BNB on spot");
  const d = checkPolicy(plan, defaultPolicy, ctx);
  assert.equal(d.kind, "ALLOW");
  assert.equal(d.code, "WITHIN_CONSTITUTION");
});

test("buy $500 BTC → DENY max_notional", () => {
  const plan = parseIntent("Buy $500 BTC");
  const d = checkPolicy(plan, defaultPolicy, ctx);
  assert.equal(plan.symbol, "BTCUSDT");
  assert.equal(d.kind, "DENY");
  assert.equal(d.code, "MAX_NOTIONAL");
});

test("open 5x BTC perpetual → DENY forbidden venue", () => {
  const plan = parseIntent("Open 5x BTC perpetual");
  const d = checkPolicy(plan, defaultPolicy, ctx);
  assert.equal(plan.venue, "futures");
  assert.equal(plan.leverage, 5);
  assert.equal(d.kind, "DENY");
  assert.equal(d.code, "FORBIDDEN_VENUE");
});

test("withdraw → DENY", () => {
  const plan = parseIntent("Withdraw 5 USDT to external wallet");
  const d = checkPolicy(plan, defaultPolicy, ctx);
  assert.equal(d.kind, "DENY");
  assert.equal(d.code, "WITHDRAWAL_FORBIDDEN");
});

test("HALT denies everything including a legal $3 spot buy", () => {
  const halted: Policy = { ...defaultPolicy, autonomy: "HALT" };
  const plan = parseIntent("Buy $3 of BNB on spot");
  const d = checkPolicy(plan, halted, ctx);
  assert.equal(d.kind, "DENY");
  assert.equal(d.code, "HALTED");
});

test("daily loss floor trips before size checks", () => {
  const plan = parseIntent("Buy $3 of BNB on spot");
  const d = checkPolicy(plan, defaultPolicy, {
    mid_usd: 600,
    realized_pnl_today_usd: -5,
  });
  assert.equal(d.kind, "DENY");
  assert.equal(d.code, "DAILY_LOSS_FLOOR");
});

test("MemeAgent and PortfolioAgent share the same gate", () => {
  const a = checkPolicy(parseIntent("Buy $500 BTC", "MemeAgent"), defaultPolicy, ctx);
  const b = checkPolicy(parseIntent("Buy $500 BTC", "PortfolioAgent"), defaultPolicy, ctx);
  assert.equal(a.code, b.code);
  assert.equal(a.kind, "DENY");
});
