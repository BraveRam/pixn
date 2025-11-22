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
  Search,
  Zap,
  Upload,
  Star,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-2/3 left-2/3 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </motion.div>
        <div className="absolute inset-0 bg-grid-slate-100/[0.03] dark:bg-grid-slate-100/[0.02] bg-[size:60px_60px]" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 min-h-[90vh] flex items-center">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Free forever · AI-powered search</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight"
          >
            Your Images,{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Perfectly
            </span>{" "}
            Organized
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeIn}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl leading-relaxed"
          >
            Store, organize, and search your favorite images with AI-powered intelligence.
            Your personal gallery, beautifully designed and completely free.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/auth/sign-in">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold backdrop-blur-sm">
                Learn More
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeIn}
            className="mt-16 flex items-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant Search</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Free Forever</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4">
              Simple. Powerful. Free.
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground">
              Get started in seconds with our intuitive workflow
            </motion.p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: <Upload className="w-8 h-8" />,
                title: "Upload",
                description: "Drag and drop up to 3 images at once, max 5MB each",
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Processes",
                description: "Our AI automatically generates searchable descriptions",
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                icon: <Search className="w-8 h-8" />,
                title: "Find Instantly",
                description: "Search your images using natural language queries",
                color: "from-orange-500 to-red-500",
              },
              {
                step: "04",
                icon: <Heart className="w-8 h-8" />,
                title: "Organize",
                description: "Mark favorites and build your curated collection",
                color: "from-green-500 to-emerald-500",
              },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="relative">
                <Card className="p-6 h-full border-border bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 group">
                  <div className="text-6xl font-bold text-muted-foreground/20 mb-4">{step.step}</div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Card>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              icon: <ImagePlus className="w-8 h-8" />,
              title: "Effortless Uploads",
              description: "Upload images with our intuitive drag-and-drop interface. Your personal gallery, always ready.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: <Search className="w-8 h-8" />,
              title: "AI-Powered Search",
              description: "Find any image instantly with natural language search. Our AI understands your photos better than traditional tags.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: <Lock className="w-8 h-8" />,
              title: "Private & Secure",
              description: "Your images are encrypted and protected with Supabase infrastructure. Only you have access to your gallery.",
              gradient: "from-orange-500 to-red-500",
            },
          ].map((feature, i) => (
            <motion.div key={i} custom={i} variants={fadeIn}>
              <Card className="p-8 h-full border-border bg-card/50 backdrop-blur hover:bg-card/80 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group cursor-pointer">
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
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "Fast", label: "Upload Speed", suffix: "" },
              { value: "Secure", label: "Storage", suffix: "" },
              { value: "∞", label: "Always Free", suffix: "" },
            ].map((stat, i) => (
              <motion.div key={i} custom={i} variants={fadeIn} className="group">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
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
          <Card className="relative overflow-hidden p-12 md:p-16 text-center bg-card/50 border-border backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10" />
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Start Your Gallery Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join creators who trust Pixn to showcase their best work. No credit card required.
              </p>
              <Link href="/auth/sign-in">
                <Button size="lg" className="rounded-full px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Create Free Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src="/logo.png"
                    alt="Pixn"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-xl">Pixn</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your personal image gallery, powered by AI. Store, organize, and search your memories effortlessly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/auth/sign-in" className="block hover:text-foreground transition-colors">Gallery</Link>
                <Link href="/upload" className="block hover:text-foreground transition-colors">Upload</Link>
                <Link href="/#features" className="block hover:text-foreground transition-colors">Features</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/terms" className="block hover:text-foreground transition-colors">Terms</Link>
                <Link href="/privacy" className="block hover:text-foreground transition-colors">Privacy</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2025 Pixn. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://t.me/plxor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/braveram/pixn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
