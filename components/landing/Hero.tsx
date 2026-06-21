"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "./motion";
import { SearchPill } from "./SearchPill";
import { HeroCollage } from "./HeroCollage";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative px-6 pt-36 pb-24 lg:pt-44 lg:pb-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "visible"}
          transition={{ staggerChildren: 0.08 }}
          className="flex flex-col items-start"
        >
          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Find any photo
            <br />
            just by{" "}
            <span className="italic text-red-500">describing it.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-lg text-lg leading-relaxed text-zinc-400"
          >
            Pixn reads every image you upload and lets you search your whole
            library in plain language — no folders, no tags, no scrolling
            forever.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 w-full">
            <SearchPill />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-red-600 px-8 text-base font-medium text-white shadow-[0_0_40px_-10px_rgba(220,38,38,0.6)] transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_60px_-12px_rgba(220,38,38,0.7)]"
            >
              <Link href="/auth/sign-in">
                Start free
                <ArrowRight className="ml-1 size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 rounded-full px-6 text-base font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <Link href="#how">See how it works</Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-sm text-zinc-500"
          >
            Free to start · No credit card · Your images stay private
          </motion.p>
        </motion.div>

        <div className="pb-6 lg:pb-0">
          <HeroCollage />
        </div>
      </div>
    </section>
  );
}
