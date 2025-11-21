"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Github,
  Heart,
  ImagePlus,
  Lock,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="mb-8 relative"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <Image
                src="/logo.png"
                alt="Pixn Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Your Images,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Beautifully
            </span>{" "}
            Organized
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeIn}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            Upload, organize, and showcase your favorite images in a stunning gallery designed for creators.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/auth/sign-in">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all group">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold">
                Explore Gallery
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeIn}
            className="mt-6 text-sm text-muted-foreground"
          >
            No credit card required · Free forever
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              icon: <ImagePlus className="w-8 h-8" />,
              title: "Effortless Uploads",
              description: "Drag and drop your images. Upload up to 3 at once with a simple, intuitive interface.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: <Heart className="w-8 h-8" />,
              title: "Smart Organization",
              description: "Mark your favorites and create beautiful, curated collections that matter to you.",
              gradient: "from-pink-500 to-rose-500",
            },
            {
              icon: <Lock className="w-8 h-8" />,
              title: "Private & Secure",
              description: "Your images are encrypted and protected. Only you have access to your gallery.",
              gradient: "from-purple-500 to-indigo-500",
            },
          ].map((feature, i) => (
            <motion.div key={i} custom={i} variants={fadeIn}>
              <Card className="p-8 h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group bg-card/50 backdrop-blur">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "Fast", label: "Upload Speed" },
              { value: "5MB", label: "Max Size" },
              { value: "Free", label: "Forever" },
            ].map((stat, i) => (
              <motion.div key={i} custom={i} variants={fadeIn}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          className="max-w-4xl mx-auto"
        >
          <Card className="relative overflow-hidden p-12 md:p-16 text-center bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border-2 border-primary/20">
            <div className="absolute inset-0 bg-grid-white/5" />
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Start Your Gallery Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join creators who trust Pixn to showcase their best work.
              </p>
              <Link href="/auth/sign-in">
                <Button size="lg" className="rounded-full px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-border/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="/logo.png"
                alt="Pixn"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-semibold">Pixn</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 Pixn. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://t.me/plxor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/braveram/pixn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
