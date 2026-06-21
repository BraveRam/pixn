"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const QUERIES = [
  "sunset at the beach",
  "my dog playing in the snow",
  "red sports car at night",
  "birthday cake with candles",
  "mountains above the clouds",
] as const;

const TYPE_MS = 70;
const DELETE_MS = 32;
const HOLD_MS = 1700;

/**
 * A faux search field that types and re-types example queries to demonstrate
 * searching by meaning. Falls back to a single static query when the user
 * prefers reduced motion.
 */
export function SearchPill() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;

    const current = QUERIES[index];
    const atEnd = !deleting && subIndex === current.length;
    const atStart = deleting && subIndex === 0;
    const delay = atEnd ? HOLD_MS : deleting ? DELETE_MS : TYPE_MS;

    const tick = setTimeout(() => {
      if (atEnd) {
        setDeleting(true);
      } else if (atStart) {
        setDeleting(false);
        setIndex((i) => (i + 1) % QUERIES.length);
      } else {
        setSubIndex((s) => s + (deleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(tick);
  }, [index, subIndex, deleting, reduce]);

  const text = reduce ? QUERIES[0] : QUERIES[index].slice(0, subIndex);

  return (
    <div
      className="group relative flex h-14 w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 backdrop-blur-sm"
      role="presentation"
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-red-500/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
      <Search className="size-5 shrink-0 text-red-400" aria-hidden="true" />
      <span className="sr-only">
        Example: search your gallery by describing a photo.
      </span>
      <span className="truncate text-base text-zinc-200" aria-hidden="true">
        {text}
        {!reduce && (
          <span className="ml-0.5 inline-block h-5 w-px translate-y-0.5 animate-pulse bg-red-400 align-middle" />
        )}
      </span>
      <kbd className="ml-auto hidden shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-zinc-400 sm:inline-block">
        Enter
      </kbd>
    </div>
  );
}
