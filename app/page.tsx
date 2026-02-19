"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Search, Zap, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

export default function LandingPage() {
  const containerRef = useRef(null);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-black text-white selection:bg-red-500/30"
    >
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-900/20 rounded-[100%] blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-red-900/10 rounded-[100%] blur-[100px] opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Image src={"/logo.png"} alt="Pixn Logo" width={24} height={24} />
            <span>Pixn</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/sign-in">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 font-medium"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeIn}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
            >
              Your Images, <br />
              <span className="text-red-500">Perfectly Organized</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeIn}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
            >
              Store, organize, and search your favorite images with AI-powered
              intelligence. Your personal gallery, beautifully designed and
              completely free.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="/auth/sign-in">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium text-lg shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.6)] transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-lg backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="mt-20 relative w-full max-w-5xl mx-auto perspective-1000"
            >
              <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-2 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-zinc-900 relative">
                  <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <div className="ml-4 flex-1 max-w-md h-8 rounded-md bg-white/5 flex items-center px-3 text-xs text-zinc-500">
                      <Search className="w-3 h-3 mr-2" />
                      Search for &quot;red sports car&quot;...
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-3 md:grid-cols-4 gap-4 mt-12">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg bg-white/5 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-red-500/20 blur-3xl -z-10 rounded-[50%]" />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Simple. Powerful. <br />
              <span className="text-red-500">Free.</span>
            </h2>
            <p className="text-xl text-zinc-400">
              Get started in seconds with our simple workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="md:col-span-2 row-span-2 rounded-3xl border border-white/10 bg-zinc-900/50 p-8 md:p-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/10 blur-[100px] rounded-full group-hover:bg-red-500/20 transition-colors duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                    <Search className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Find Instantly</h3>
                  <p className="text-zinc-400 max-w-md">
                    Search your images using natural language queries. Our AI
                    understands your photos better than traditional tags.
                  </p>
                </div>
                <div className="mt-8 rounded-xl border border-white/5 bg-black/40 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-xs">You</span>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-zinc-800 text-sm">
                      Show me photos of sunset at the beach
                    </div>
                  </div>
                  <div className="flex gap-2 pl-11">
                    <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/5" />
                    <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={1}
              className="row-span-2 rounded-3xl border border-white/10 bg-zinc-900/50 p-8 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-900/10 to-transparent" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Secure & Private</h3>
                <p className="text-zinc-400 mb-8">
                  Your photos are only yours.
                </p>
                <div className="mt-auto flex justify-center">
                  <div className="relative w-32 h-48 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center">
                    <Lock className="w-12 h-12 text-red-500/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent rounded-xl" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={2}
              className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 group hover:border-red-500/30 transition-colors"
            >
              <Zap className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Upload Speed</h3>
              <p className="text-sm text-zinc-400">
                Drag and drop your images at once.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={3}
              className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 group hover:border-red-500/30 transition-colors"
            >
              <LayoutGrid className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Organize</h3>
              <p className="text-sm text-zinc-400">
                Mark favorites and build your curated collection.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-24 text-center border border-white/10 bg-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Start Your Gallery <br />
                <span className="text-red-500">Today</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
                Join creators who trust Pixn to showcase their best work. No
                credit card required.
              </p>
              <Link href="/auth/sign-in">
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-lg"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-black py-12 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">Pixn</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
          <div className="text-zinc-600 text-sm">
            © 2025 Pixn. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
