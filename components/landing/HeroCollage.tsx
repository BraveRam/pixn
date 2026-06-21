"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeUp } from "./motion";

type Tile = {
  gradient: string;
  label: string;
  height: string;
};

const COLUMN_A: Tile[] = [
  {
    gradient: "from-amber-300 via-orange-500 to-rose-600",
    label: "golden hour",
    height: "h-44 sm:h-52",
  },
  {
    gradient: "from-emerald-300 via-green-600 to-teal-800",
    label: "forest trail",
    height: "h-60 sm:h-72",
  },
];

const COLUMN_B: Tile[] = [
  {
    gradient: "from-cyan-300 via-blue-500 to-indigo-700",
    label: "alpine lake",
    height: "h-60 sm:h-72",
  },
  {
    gradient: "from-fuchsia-400 via-purple-600 to-indigo-900",
    label: "neon city",
    height: "h-44 sm:h-52",
  },
];

function PhotoTile({ tile, index }: { tile: Tile; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={`group relative ${tile.height} overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${tile.gradient}`}
      />
      {/* depth + sheen */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" />
      <div className="landing-noise absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      <span className="absolute bottom-2.5 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
        {tile.label}
      </span>
    </motion.div>
  );
}

export function HeroCollage() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "visible"}
      transition={{ staggerChildren: 0.08 }}
      className="relative mx-auto w-full max-w-md lg:mx-0"
    >
      {/* ambient glow behind the collage */}
      <div className="absolute -inset-6 -z-10 rounded-[40%] bg-red-600/20 blur-3xl" />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {COLUMN_A.map((tile, i) => (
            <PhotoTile key={tile.label} tile={tile} index={i} />
          ))}
        </div>
        <div className="flex translate-y-8 flex-col gap-4">
          {COLUMN_B.map((tile, i) => (
            <PhotoTile key={tile.label} tile={tile} index={i + 1} />
          ))}
        </div>
      </div>

      {/* Floating "AI understood this" card — the semantic-search payoff */}
      <motion.div
        variants={fadeUp}
        custom={4}
        className="absolute -bottom-6 left-1/2 w-[88%] max-w-xs -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-950/80 p-4 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-red-400">
          <Sparkles className="size-3.5" />
          Pixn understood
        </div>
        <p className="mt-1.5 text-sm leading-snug text-zinc-200">
          “A golden sunset glowing over calm ocean waves.”
        </p>
      </motion.div>
    </motion.div>
  );
}
