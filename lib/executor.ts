import { check_policy } from "./skill";
import type { Decision, Plan, Policy } from "./types";
import { demoPolicy } from "./demoPolicy";

export type Execution =
  | { status: "PAPER"; decision: Decision; note: string }
  | { status: "BLOCKED"; decision: Decision; note: string }
  | { status: "NEEDS_HUMAN"; decision: Decision; note: string }
  | { status: "LIVE_QUEUED"; decision: Decision; note: string };

/**
 * Nothing reaches Binance MCP unless kind === ALLOW and mode === live
 * and VETUM_LIVE=1. Default is paper. Withdrawals never queue.
 */
export function executePlan(plan: Plan, policy: Policy = demoPolicy): Execution {
  const decision = check_policy(plan, policy);

  if (decision.kind === "DENY") {
    return { status: "BLOCKED", decision, note: "No MCP write. Ledger the deny." };
  }
  if (decision.kind === "CONFIRM") {
    return { status: "NEEDS_HUMAN", decision, note: "Hold. Human must confirm." };
  }
  if (policy.mode !== "live" || process.env.VETUM_LIVE !== "1") {
    return {
      status: "PAPER",
      decision,
      note: "Simulated fill only. MCP not called.",
    };
  }
  return {
    status: "LIVE_QUEUED",
    decision,
    note: "Caller may invoke Binance MCP spot place on the Agentic sub-account. No withdraw tools.",
  };
}

/** Official Agent OS MCP. Auth is user-granted in the Binance account, not in this repo. */
export const BINANCE_MCP = "https://agent.binance.com/mcp/agentic";
