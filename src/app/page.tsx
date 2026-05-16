import Link from "next/link";
import Image from "next/image";
import { Cinzel } from "next/font/google";

import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-landing-heading",
});

const featureCards = [
  {
    title: "Build Your Living World",
    description:
      "Create realms, factions, and political tensions that evolve with your table's decisions.",
  },
  {
    title: "Track Story Events",
    description:
      "Mark active, resolved, or abandoned hooks so your campaign arc stays coherent between sessions.",
  },
  {
    title: "Organize By Region",
    description:
      "Keep every city, dungeon, and wilderness thread attached to the exact region where it belongs.",
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_22%,#f8e3ba_0%,#f0cf95_28%,transparent_56%),radial-gradient(circle_at_86%_12%,#3a2616_0%,#1d1918_35%,transparent_60%),linear-gradient(160deg,#0f1117_0%,#131924_50%,#1d1512_100%)] text-amber-50">
      <div className="landing-grid-bg pointer-events-none absolute inset-0 opacity-35" />

      <section className="relative mx-auto flex min-h-[85vh] w-full max-w-6xl flex-col justify-center gap-10 px-6 py-18 sm:px-10 lg:px-14">
        <div className="landing-fade-up inline-flex w-fit items-center rounded-full border border-amber-300/40 bg-amber-100/10 px-4 py-1 text-xs tracking-[0.22em] uppercase">
          Campaign Intelligence For Dungeon Masters
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="landing-fade-up space-y-6 [animation-delay:120ms]">
            <h1
              className={cn(
                cinzel.className,
                "max-w-3xl text-4xl leading-tight font-bold text-amber-100 sm:text-5xl lg:text-6xl",
              )}
            >
              Forge Legends. Track Every Oath, Betrayal, And Battle.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-amber-100/85 sm:text-lg">
              The Realm Atlas helps you run long-form campaigns without losing
              narrative threads. Map your world, connect regions, and keep event
              timelines crystal clear.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-11 border border-amber-100/40 bg-amber-200 text-stone-900 hover:bg-amber-100",
                    )}
                  >
                    Enter Your Dashboard
                  </Link>
                  <Link
                    href="/worlds"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 border-amber-100/40 bg-transparent text-amber-100 hover:bg-amber-100/10",
                    )}
                  >
                    Browse Worlds
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-11 border border-amber-100/40 bg-amber-200 text-stone-900 hover:bg-amber-100",
                    )}
                  >
                    Start A New Campaign
                  </Link>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 border-amber-100/40 bg-transparent text-amber-100 hover:bg-amber-100/10",
                    )}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="landing-fade-up landing-float rounded-3xl border border-amber-100/20 bg-stone-900/40 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur [animation-delay:260ms]">
            <Image
              src="/landing/map-scroll.svg"
              alt="Fantasy campaign map parchment illustration"
              width={720}
              height={420}
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 pb-12 sm:px-10 lg:px-14">
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <article
              key={card.title}
              className="landing-fade-up rounded-2xl border border-amber-50/15 bg-black/25 p-5 backdrop-blur"
              style={{ animationDelay: `${420 + index * 120}ms` }}
            >
              <h2 className={cn(cinzel.className, "text-lg font-semibold text-amber-100")}>
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-50/80">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto grid w-full max-w-6xl gap-8 px-6 pb-20 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-14">
        <div className="landing-fade-up space-y-4 [animation-delay:760ms]">
          <h3 className={cn(cinzel.className, "text-3xl font-bold text-amber-100")}>
            Built For Epic Arcs, Not One-Shots
          </h3>
          <p className="text-sm leading-7 text-amber-50/80 sm:text-base">
            Realm Atlas is your campaign command center. Keep player-facing lore
            separated from DM-only context, and always know which unresolved
            event can become next session&apos;s hook.
          </p>

          <div className="rounded-2xl border border-amber-100/20 bg-black/25 p-4">
            <p className="text-xs tracking-[0.2em] text-amber-100/70 uppercase">
              Typical Workflow
            </p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-amber-50/85">
              <li>1. Create a world and define key regions.</li>
              <li>2. Log active and resolved events each session.</li>
              <li>3. Use event status to drive your next story beat.</li>
            </ol>
          </div>
        </div>

        <div className="landing-fade-up rounded-3xl border border-amber-100/20 bg-stone-950/50 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] [animation-delay:880ms]">
          <Image
            src="/landing/dice-banner.svg"
            alt="Fantasy tabletop dice illustration"
            width={720}
            height={300}
            className="h-auto w-full rounded-2xl"
          />
          <Image
            src="/landing/dragon-emblem.svg"
            alt="Dragon emblem artwork"
            width={640}
            height={420}
            className="mt-3 h-auto w-full rounded-2xl"
          />
        </div>
      </section>
    </main>
  );
}
