import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { SkillStudio } from "@/components/SkillStudio";

export default function Skill() {
  return (
    <>
      <SiteChrome active="/skill" />
      <main className="mx-auto max-w-[1200px] px-5 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[.28em] text-mist">04 · Skill Hub</p>
        <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.88] md:text-8xl">
          Other agents call the same gate.
        </h1>
        <p className="mt-6 max-w-xl text-mist">
          Vetum ships as <code className="text-bone">skills/vetum</code>. PortfolioAgent and MemeAgent
          do not get their own policy. They get one function.
        </p>
        <div className="mt-14">
          <SkillStudio />
        </div>
        <article className="mt-14 border border-line bg-ink p-8">
          <p className="font-mono text-[10px] text-violet">skills/vetum/SKILL.md</p>
          <pre className="mt-6 overflow-auto text-sm leading-7 text-mist">{`check_policy(plan) → ALLOW | DENY | CONFIRM

ALLOW    → caller may hit Binance MCP
DENY     → no write tools
CONFIRM  → human first`}</pre>
          <Link href="/app" className="mt-8 inline-flex rounded-full border border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[.16em] hover:border-violet">
            Open chamber
          </Link>
        </article>
      </main>
    </>
  );
}
