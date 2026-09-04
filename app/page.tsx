import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-mist">
        Chunk 2 · Chamber
      </p>
      <h1 className="font-serif text-6xl leading-none tracking-tight md:text-8xl">
        Vetum
      </h1>
      <p className="mt-6 max-w-md text-center text-mist">
        Agents propose. Policy decides. Binance executes.
      </p>
      <Link
        href="/app"
        className="mt-10 rounded-full border border-line bg-ink px-6 py-3 text-sm text-bone transition hover:border-violet"
      >
        Enter the chamber
      </Link>
    </main>
  );
}
