import { parseIntent } from "../lib/parseIntent.ts";
import { executePlan } from "../lib/executor.ts";
import { demoPolicy } from "../lib/demoPolicy.ts";

const intent = process.argv.slice(2).join(" ").trim();
if (!intent) {
  console.error('Usage: npx tsx agent/run.ts "Buy $800 of BNB on spot"');
  process.exit(1);
}

const plan = parseIntent(intent, "VetumAgent");
const exec = executePlan(plan, demoPolicy);

console.log(
  JSON.stringify(
    {
      name: "VetumAgent",
      os: "Binance Agent OS",
      mcp: "https://agent.binance.com/mcp/agentic",
      intent,
      plan,
      vetum: {
        kind: exec.decision.kind,
        code: exec.decision.code,
        reason: exec.decision.reason,
        simulated: exec.decision.simulated,
      },
      execution: { status: exec.status, note: exec.note, mcp_write: exec.status === "LIVE_QUEUED" },
    },
    null,
    2
  )
);

if (exec.status === "BLOCKED" || exec.status === "NEEDS_HUMAN") process.exit(2);
