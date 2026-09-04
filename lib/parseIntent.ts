import type { Plan, Venue } from "./types.ts";

const SYMBOLS: Record<string, string> = {
  bnb: "BNBUSDT",
  btc: "BTCUSDT",
  bitcoin: "BTCUSDT",
  eth: "ETHUSDT",
  ethereum: "ETHUSDT",
};

function pickSymbol(text: string): string {
  const lower = text.toLowerCase();
  for (const [k, v] of Object.entries(SYMBOLS)) {
    if (lower.includes(k)) return v;
  }
  return "BNBUSDT";
}

function pickVenue(text: string): Venue {
  const lower = text.toLowerCase();
  if (/\b(perp|perpetual|futures?|5x|10x|leverage)\b/.test(lower)) return "futures";
  if (/\bmargin\b/.test(lower)) return "margin";
  if (/\bwithdraw|send off.?exchange|external wallet\b/.test(lower)) return "onchain";
  return "spot";
}

function pickNotional(text: string): number {
  const m = text.replace(/,/g, "").match(/\$?\s*(\d+(?:\.\d+)?)/);
  if (!m) return 4;
  return Number(m[1]);
}

function pickLeverage(text: string): number {
  const m = text.toLowerCase().match(/(\d+(?:\.\d+)?)\s*x/);
  if (m) return Number(m[1]);
  if (/\bfutures?|perp/.test(text.toLowerCase())) return 2;
  return 1;
}

function pickSide(text: string): "buy" | "sell" {
  if (/\b(sell|short|reduce|flatten|hedge)\b/i.test(text)) return "sell";
  return "buy";
}

export function parseIntent(intent: string, agent = "PortfolioAgent"): Plan {
  return {
    agent,
    intent: intent.trim(),
    symbol: pickSymbol(intent),
    venue: pickVenue(intent),
    side: pickSide(intent),
    notional_usd: pickNotional(intent),
    leverage: pickLeverage(intent),
    order_type: "market",
  };
}
