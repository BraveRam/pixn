"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, Lock, Zap, Heart } from "lucide-react";
import { fadeUp } from "./motion";

const RESULTS = [
  { gradient: "from-amber-300 via-orange-500 to-rose-600", match: "98%" },
  { gradient: "from-orange-300 via-red-400 to-rose-700", match: "94%" },
  { gradient: "from-sky-300 via-blue-500 to-indigo-700", match: null },
  { gradient: "from-fuchsia-400 via-purple-600 to-indigo-900", match: null },
];

function SearchDemo() {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <Search className="size-4 text-red-400" />
        <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-zinc-200">
          sunset at the beach
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {RESULTS.map((r, i) => (
          <div
            key={i}
            className={`relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br ${r.gradient} ${
              r.match ? "ring-2 ring-red-500" : "opacity-60"
            }`}
          >
            {r.match && (
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {r.match}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="features-heading"
      className="px-6 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-wide text-red-500 uppercase">
            Why Pixn
          </p>
          <h2
            id="features-heading"
            className="font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl"
          >
            A gallery that actually <span className="italic">understands</span>{" "}
            your photos.
          </h2>
        </div>

        <motion.div
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 md:grid-cols-3"
        >
          {/* Hero tile: semantic search */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 md:col-span-2 md:row-span-2 md:p-10"
          >
            <div className="absolute top-0 right-0 size-72 rounded-full bg-red-500/10 blur-[100px] transition-colors duration-500 group-hover:bg-red-500/20" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <Search className="size-6" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-white">
                Search the way you think
              </h3>
              <p className="max-w-md leading-relaxed text-zinc-400">
                Describe a moment in your own words and Pixn surfaces the right
                images by meaning — ranked by how well each one actually matches.
              </p>
              <SearchDemo />
            </div>
          </motion.div>

          {/* Private */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition-colors hover:border-red-500/30 md:row-span-2"
          >
            <div className="flex h-full flex-col">
              <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-white/5 text-white">
                <Lock className="size-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                Private by default
              </h3>
              <p className="leading-relaxed text-zinc-400">
                Your images are never public. Every view runs through a
                time-limited signed URL tied to your account.
              </p>
              <div className="mt-auto flex justify-center pt-8">
                <div className="relative flex h-40 w-28 items-center justify-center rounded-2xl border border-white/10 bg-black/40">
                  <Lock className="size-12 text-red-500/50" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-red-500/10 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fast upload */}
          <motion.div
            variants={fadeUp}
            custom={2}
            className="group rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition-colors hover:border-red-500/30"
          >
            <Zap className="mb-4 size-8 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-white">
              Drop and go
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Drag in a batch of images at once. Descriptions and search are
              ready moments later.
            </p>
          </motion.div>

          {/* Favorites */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="group rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition-colors hover:border-red-500/30"
          >
            <Heart className="mb-4 size-8 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-white">
              Curate favorites
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Star the shots you love and build a collection that&apos;s truly
              yours.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
