import type { Policy } from "./types";

// Demo policy is intentionally separate from defaultPolicy: tests keep their fixture.
export const demoPolicy: Policy = {
  autonomy: "L2",
  mode: "paper",
  max_notional_usd: 10000,
  max_daily_loss_usd: 1500,
  confirmation_above: 2500,
  allowed_venues: ["spot"],
  forbidden_venues: ["futures", "margin"],
  allowed_symbols: ["BNBUSDT", "BTCUSDT", "ETHUSDT"],
  withdrawals: false,
};
