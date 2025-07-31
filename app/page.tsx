"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7 },
  }),
};

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white px-6">
      <motion.section
        className="flex items-center justify-center w-full mt-16"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </motion.section>
      <motion.section
        className="max-w-4xl text-center mt-15 space-y-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl font-bold tracking-tight"
          variants={fadeUp}
        >
          🎨 Save Your Memories, blud.
        </motion.h1>
        <motion.p className="text-zinc-400 text-lg" variants={fadeUp}>
          Discover, upload, and manage your favorite shots in the most elegant
          gallery ever built.
        </motion.p>
        <motion.div
          className="flex items-center justify-center gap-4 mt-4"
          variants={fadeUp}
        >
          <Link href="/auth/sign-in">
            <Button className="text-lg px-6 py-4">Get Started</Button>
          </Link>
          <Link href="/gallery">
            <Button variant="outline" className="text-lg px-6 py-4">
              Explore Gallery
            </Button>
          </Link>
        </motion.div>
      </motion.section>
      <motion.section
        className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full items-stretch"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {[
          {
            title: "Upload Instantly",
            icon: "⬆️",
            desc: "Drag, drop, done. Upload your images in seconds.",
          },
          {
            title: "Secured Images",
            icon: "🔒",
            desc: "Your images are secured and private.",
          },
          {
            title: "Simple UI and UX",
            icon: "💫",
            desc: "A clean and elegant UI.",
          },
        ].map((feature, i) => (
          <motion.div key={i} custom={i} variants={fadeUp} className="h-full">
            <Card className="bg-zinc-800 border-zinc-700 h-full transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl">
              <CardHeader>
                <CardTitle>
                  <span className="text-3xl mr-2">{feature.icon}</span>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-400">
                {feature.desc}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>
      <motion.section
        className="max-w-3xl w-full mt-28 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <h2 className="text-4xl font-bold mb-4">Simple pricing</h2>
        <p className="text-zinc-400 text-lg mb-10">
          No credit cards. Free forever😜
        </p>
        <Card className="bg-zinc-800 border-zinc-700 py-10 transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-5xl font-bold mb-2">Free</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-300 text-lg space-y-2">
            <p>✅ Unlimited uploads</p>
            <p>✅ Global image discovery</p>
            <p>✅ Your images protected</p>
            <div className="mt-6">
              <Link href="/auth/sign-in">
                <Button className="text-lg px-8 py-4">Start for Free</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.section>
      <motion.footer
        className="mt-28 mb-10 text-center text-zinc-500 space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
      >
        <p>© 2025 Pixn. All rights reserved.</p>
        <div className="flex justify-center gap-6 text-white">
          <a
            href="https://t.me/plxor"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle />
          </a>
          <a
            href="https://github.com/braveram/pixn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
          </a>
        </div>
      </motion.footer>
    </main>
  );
}
