import { checkPolicy } from "./policy";
import { demoPolicy } from "./demoPolicy";
import type { MarketContext, Plan, Policy } from "./types";

const MID: Record<string, number> = {
  BNBUSDT: 600,
  BTCUSDT: 64000,
  ETHUSDT: 2400,
};

/** Skill Hub surface. Same gate. Optional constitution override. */
export function check_policy(
  plan: Plan,
  constitution: Policy = demoPolicy,
  market?: Partial<MarketContext>
) {
  return checkPolicy(plan, constitution, {
    mid_usd: market?.mid_usd ?? MID[plan.symbol] ?? 0,
    realized_pnl_today_usd: market?.realized_pnl_today_usd ?? 0,
  });
}
