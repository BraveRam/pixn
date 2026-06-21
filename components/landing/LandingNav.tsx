"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-white/10 bg-black/60 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-medium tracking-tight text-white"
        >
          <Image
            src="/logo.png"
            alt=""
            width={26}
            height={26}
            className="rounded-md"
            priority
          />
          <span>Pixn</span>
        </Link>

        <Button
          asChild
          size="sm"
          className="rounded-full bg-white px-5 font-medium text-black hover:bg-zinc-200"
        >
          <Link href="/auth/sign-in">Get started</Link>
        </Button>
      </nav>
    </header>
  );
}
