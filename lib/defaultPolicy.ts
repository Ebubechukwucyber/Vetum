import type { Policy } from "./types";

/** $5 broke-builder constitution. Futures never leave this file as allowed. */
export const defaultPolicy: Policy = {
  autonomy: "L2",
  mode: "paper",
  max_notional_usd: 5,
  max_daily_loss_usd: 5,
  allowed_venues: ["spot"],
  forbidden_venues: ["futures", "margin"],
  allowed_symbols: ["BNBUSDT", "BTCUSDT", "ETHUSDT"],
  confirmation_above: 4,
  withdrawals: false,
};
