import assert from "node:assert/strict";
import { test } from "node:test";
import { parseIntent } from "./parseIntent";

test("parses reduce-risk language as sell spot, not futures", () => {
  const plan = parseIntent("Reduce risk. Do not lose more than $5 today.");
  assert.equal(plan.side, "sell");
  assert.equal(plan.venue, "spot");
  assert.equal(plan.notional_usd, 5);
});
