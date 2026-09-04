import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export default function AgentPage() {
  return (
    <>
      <SiteChrome active="/agent" />
      <main className="mx-auto max-w-[1100px] px-5 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[.28em] text-mist">Track A · Agent</p>
        <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.88] md:text-8xl">
          VetumAgent
        </h1>
        <p className="mt-6 max-w-xl text-mist">
          The agent proposes. The gate decides. Agent OS executes only after ALLOW.
          This is the Track A loop — not a second policy.
        </p>
        <ol className="mt-12 space-y-3 font-mono text-sm text-mist">
          <li>1. Intent</li>
          <li>2. Plan (`parseIntent`)</li>
          <li>3. `check_policy`</li>
          <li>4. ALLOW → paper fill or MCP write · DENY → stop</li>
        </ol>
        <pre className="mt-10 overflow-auto border border-line bg-ink p-6 text-sm leading-7 text-mist">{`npx tsx agent/run.ts "Buy $800 of BNB on spot"
npx tsx agent/run.ts "Open 10x BTC perpetual"`}</pre>
        <p className="mt-8 text-sm text-mist">
          Paste <code className="text-bone">agent/SYSTEM.md</code> into Claude Code after MCP is paired.
          That session <em>is</em> the live agent.
        </p>
        <Link href="/app" className="mt-10 inline-flex rounded-full border border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[.16em] hover:border-violet">
          Chamber
        </Link>
      </main>
    </>
  );
}
