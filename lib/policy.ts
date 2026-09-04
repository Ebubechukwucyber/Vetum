import type { Decision, MarketContext, Plan, Policy } from "./types";

const TAKER_FEE = 0.001;
const SLIPPAGE = 0.0005;

function simulate(plan: Plan, ctx: MarketContext) {
  const est_fee_usd = plan.notional_usd * TAKER_FEE;
  const est_slippage_usd = plan.notional_usd * SLIPPAGE;
  const est_fill_usd = plan.notional_usd + est_fee_usd + est_slippage_usd;
  const signed = plan.side === "buy" ? 1 : -1;
  return {
    mid_usd: ctx.mid_usd,
    est_fee_usd: round(est_fee_usd),
    est_slippage_usd: round(est_slippage_usd),
    est_fill_usd: round(est_fill_usd),
    exposure_after_usd: round(signed * plan.notional_usd),
  };
}

function round(n: number) {
  return Math.round(n * 10000) / 10000;
}

function decide(
  kind: Decision["kind"],
  code: Decision["code"],
  reason: string,
  plan: Plan,
  simulated: Decision["simulated"]
): Decision {
  return { kind, code, reason, plan, simulated };
}

/**
 * Deterministic gate. The LLM never calls this with keys.
 * Order of checks is the constitution: halt, withdrawals, venue, symbol, loss, size, leverage, confirm.
 */
export function checkPolicy(
  plan: Plan,
  policy: Policy,
  ctx: MarketContext = { mid_usd: 0, realized_pnl_today_usd: 0 }
): Decision {
  const simulated = simulate(plan, ctx);

  if (policy.autonomy === "HALT") {
    return decide("DENY", "HALTED", "Autonomy halted. No writes.", plan, simulated);
  }

  if (policy.autonomy === "L0") {
    return decide("DENY", "READ_ONLY", "L0 is market-data only.", plan, simulated);
  }

  if (plan.venue === "onchain" || /withdraw/i.test(plan.intent)) {
    return decide(
      "DENY",
      "WITHDRAWAL_FORBIDDEN",
      "Withdrawals are not a Vetum scope. Agent cannot withdraw.",
      plan,
      simulated
    );
  }

  if (policy.forbidden_venues.includes(plan.venue)) {
    return decide(
      "DENY",
      "FORBIDDEN_VENUE",
      `forbidden_venues · ${plan.venue}`,
      plan,
      simulated
    );
  }

  if (!policy.allowed_venues.includes(plan.venue)) {
    return decide(
      "DENY",
      "FORBIDDEN_VENUE",
      `venue ${plan.venue} is not in allowed_venues`,
      plan,
      simulated
    );
  }

  if (!policy.allowed_symbols.includes(plan.symbol)) {
    return decide(
      "DENY",
      "SYMBOL_NOT_ALLOWED",
      `symbol ${plan.symbol} is not in allowed_symbols`,
      plan,
      simulated
    );
  }

  if (ctx.realized_pnl_today_usd <= -Math.abs(policy.max_daily_loss_usd)) {
    return decide(
      "DENY",
      "DAILY_LOSS_FLOOR",
      `daily loss floor · ${ctx.realized_pnl_today_usd} vs -${policy.max_daily_loss_usd}`,
      plan,
      simulated
    );
  }

  if (plan.notional_usd > policy.max_notional_usd) {
    return decide(
      "DENY",
      "MAX_NOTIONAL",
      `max_notional_usd · $${plan.notional_usd} > $${policy.max_notional_usd}`,
      plan,
      simulated
    );
  }

  if (plan.leverage > 1) {
    return decide(
      "DENY",
      "MAX_LEVERAGE",
      `leverage ${plan.leverage}x is not in the $5 constitution`,
      plan,
      simulated
    );
  }

  if (policy.autonomy === "L1" || plan.notional_usd >= policy.confirmation_above) {
    return decide(
      "CONFIRM",
      "REQUIRES_HUMAN",
      `Notional $${plan.notional_usd} requires a human.`,
      plan,
      simulated
    );
  }

  return decide("ALLOW", "WITHIN_CONSTITUTION", "Within constitution.", plan, simulated);
}
