export type Venue = "spot" | "margin" | "futures" | "convert" | "onchain";

export type AutonomyLevel = "L0" | "L1" | "L2" | "HALT";

export type DecisionKind = "ALLOW" | "DENY" | "CONFIRM";

export type Policy = {
  autonomy: AutonomyLevel;
  mode: "paper" | "live";
  max_notional_usd: number;
  max_daily_loss_usd: number;
  allowed_venues: Venue[];
  forbidden_venues: Venue[];
  allowed_symbols: string[];
  confirmation_above: number;
  withdrawals: false;
};

export type Plan = {
  agent: string;
  intent: string;
  symbol: string;
  venue: Venue;
  side: "buy" | "sell";
  notional_usd: number;
  leverage: number;
  order_type: "market" | "limit";
};

export type MarketContext = {
  mid_usd: number;
  realized_pnl_today_usd: number;
};

export type Decision = {
  kind: DecisionKind;
  reason: string;
  code:
    | "WITHIN_CONSTITUTION"
    | "HALTED"
    | "READ_ONLY"
    | "FORBIDDEN_VENUE"
    | "SYMBOL_NOT_ALLOWED"
    | "MAX_NOTIONAL"
    | "MAX_LEVERAGE"
    | "DAILY_LOSS_FLOOR"
    | "WITHDRAWAL_FORBIDDEN"
    | "REQUIRES_HUMAN";
  plan: Plan;
  simulated: {
    mid_usd: number;
    est_fee_usd: number;
    est_slippage_usd: number;
    est_fill_usd: number;
    exposure_after_usd: number;
  };
};
