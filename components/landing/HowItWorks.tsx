"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Upload, Sparkles, Search, type LucideIcon } from "lucide-react";
import { fadeUp } from "./motion";

type Step = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    icon: Upload,
    title: "Upload your photos",
    body: "Drag and drop your images straight into Pixn. Start with up to 20, no setup required.",
  },
  {
    icon: Sparkles,
    title: "AI reads each one",
    body: "Gemini writes a rich description of every photo and turns its meaning into a searchable vector.",
  },
  {
    icon: Search,
    title: "Search by meaning",
    body: "Type what you remember. Pixn finds the right shots by what's in them — not their filenames.",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="scroll-mt-24 px-6 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-wide text-red-500 uppercase">
            How it works
          </p>
          <h2
            id="how-heading"
            className="font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl"
          >
            From upload to <span className="italic">found</span> in three steps.
          </h2>
        </div>

        <motion.ol
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.12 }}
          className="relative grid gap-12 md:grid-cols-3 md:gap-8"
        >
          {/* connecting line on desktop */}
          <div
            aria-hidden="true"
            className="absolute top-7 right-8 left-8 hidden h-px bg-gradient-to-r from-white/10 via-white/10 to-transparent md:block"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                variants={fadeUp}
                custom={i}
                className="relative"
              >
                <div className="mb-6 flex items-center gap-4">
                  <span className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 text-red-500">
                    <Icon className="size-6" />
                  </span>
                  <span className="font-display text-5xl text-white/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mb-2.5 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-zinc-400">{step.body}</p>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
